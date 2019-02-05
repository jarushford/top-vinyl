const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const {
  validateAlbumParams,
  validateTrackParams,
  validateRating,
  validateYear,
  sortByYearHelper,
  filterByYearHelper,
  sortByRatingHelper,
  filterByRatingHelper,
  checkForID
} = require('./utils/middleware')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Top Vinyl'
app.use(cors())
app.use(bodyParser.json())

app.get('/api/v1/albums', (request, response) => {
  const year = request.query.year
  const rating = request.query.rating
  const sortByYear = request.query.sortByYear
  const sortByRating = request.query.sortByRating

  database('albums').select()
    .then(albums => {
      const SBY = sortByYearHelper(albums, sortByYear)
      const FBY = filterByYearHelper(SBY, year)
      const SBR = sortByRatingHelper(FBY, sortByRating)
      const fullyFiltered = filterByRatingHelper(SBR, rating)
      if (fullyFiltered.length) {
        response.status(200).json(fullyFiltered)
      } else {
        response.status(404)
          .send('Could not find any albums that match your request.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/albums', validateAlbumParams, validateRating, validateYear, checkForID, (request, response) => {
  const album = request.body
  const cleanedAlbum = { ...album, rating: album.rating.toString() + ' / 5'}
  database('albums').insert(cleanedAlbum, 'id')
    .then(albumID => {
      response.status(201)
        .json({message: `Album successfully added to database. Album ID is ${albumID}`, id: albumID})
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/albums/:id', (request, response) => {
  database('albums').where('id', request.params.id).select()
    .then(album => {
      if (album.length) {
        response.status(200).json(album[0])
      } else {
        response.status(404).send('Could not find that album.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.put('/api/v1/albums/:id', validateAlbumParams, validateRating, validateYear, checkForID, (request, response) => {
  const album = request.body
  const id = request.params.id

  database('albums').where('id', id).update(album)
    .then(updatedRow => {
      if (updatedRow) {
        response.status(202).json({message: `Successfully updated album ${id}.`, id})
      } else {
        response.status(404).send('Could not find that album.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/albums/:id', (request, response) => {
  const { id } = request.params
  database('tracks').where('album_id', id).del()
    .then(() => {
      database('albums').where('id', id).del()
        .then(projectID => {
          if (projectID) {
            response.status(202)
              .json({message: `Successfully deleted album ${id}.`, id})
          } else {
            response.status(404).send('Could not find an album with that ID.')
          }
        })
        .catch(error => {
          response.status(500).json({ error })
        })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/albums/:id/tracks', (request, response) => {
  database('tracks').where('album_id', request.params.id).select()
    .then(tracks => {
      if (tracks.length) {
        response.status(200).json(tracks)
      } else {
        response.status(404).send('Could not find any tracks for that album.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/albums/:id/tracks', validateTrackParams, checkForID, (request, response) => {
  const track = request.body
  const albumID = request.params.id

  const cleanedTrack = { ...track, album_id: albumID }
  database('albums').where('id', albumID).select()
    .then(albums => {
      if (albums.length) {
        database('tracks').insert(cleanedTrack, 'id')
          .then(trackID => {
            response.status(201)
              .json({message: `Track successfully added to album ${albumID}. Track ID is ${trackID}`, id: trackID})
          })
          .catch(error => {
            response.status(500).json({ error })
          })
      } else {
        response.status(404).send('Could not find an album with that ID.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/tracks', (request, response) => {
  database('tracks').select()
    .then(tracks => {
      response.status(200).json(tracks)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/tracks/:id', (request, response) => {
  database('tracks').where('id', request.params.id).select()
    .then(track => {
      if (track.length) {
        response.status(200).json(track[0])
      } else {
        response.status(404).send('Could not find that track.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.put('/api/v1/tracks/:id', validateTrackParams, checkForID, (request, response) => {
  const track = request.body
  const id = request.params.id

  database('tracks').where('id', id).update(track)
    .then(trackID => {
      if (trackID) {
        response.status(202).send({message: `Successfully updated track ${id}.`, id})
      } else {
        response.status(404).send('Could not find that album.')
      }
    }) 
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/tracks/:id', (request, response) => {
  database('tracks').where('id', request.params.id).del()
    .then(trackID => {
      if (trackID) {
        response.status(202).send(`Successfully deleted track ${request.params.id}.`)
      } else {
        response.status(404).send('Could not find a track with that ID.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.use((request, response) => {
  response.status(404).send('Page Not Found. You can find the main API at the extension \'/api/v1/albums\'')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

module.exports = app
