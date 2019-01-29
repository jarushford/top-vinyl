const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000)
app.locals.title = 'Top Vinyl'

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
        response.status(404).send('Could not find any albums that match your request.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

function sortByYearHelper(albums, sortByYear) {
  return sortByYear
    ? albums.sort((a, b) => parseInt(a.year) - parseInt(b.year))
    : albums
}

function filterByYearHelper(albums, year) {
  return year
    ? albums.filter(album => album.year === year)
    : albums
}

function sortByRatingHelper(albums, sortByRating) {
  return sortByRating
    ? albums.sort((a, b) => parseFloat(b.rating.substring(0, 4)) - parseFloat(a.rating.substring(0, 4)))
    : albums
}

function filterByRatingHelper(albums, rating) {
  return rating
    ? albums.filter(album => parseFloat(album.rating.substring(0, 4)) >= parseFloat(rating.substring(0, 4)))
    : albums
}

app.post('/api/v1/albums', (request, response) => {
  const album = request.body
  
  for (let requiredParam of ['album', 'genre', 'artist', 'rating', 'year']) {
    if (!album[requiredParam]) {
      return response.status(422).send(`Expected format: { album: <String>, genre: <String>, artist: <String>, rating: <Integer || Float>, year: <String> }. You're missing a ${requiredParam}.`)
    }
  }

  if (parseInt(album.rating) > 5) {
    return response.status(422).send('Improper format for rating. Rating must be either an integer or float between 0 and 5 and must have no more than 2 decimal places.')
  }

  if (album.year.length !== 4) {
    return response.status(422).send('Improper format for year. Year must be a string in YYYY format.')
  }

  const cleanedAlbum = { ...album, rating: album.rating.toString() + ' / 5'}
  database('albums').insert(cleanedAlbum, 'id')
    .then(albumID => {
      response.status(201).send(`Album successfully added to database. Album ID is ${albumID}`)
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

app.put('/api/v1/albums/:id', (request, response) => {
  const album = request.body
  const id = request.params.id

  database('albums').where('id', id).update(album)
    .then(updatedRow => {
      if (updatedRow) {
        response.status(202).send(`Successfully updated album ${id}.`)
      } else {
        response.status(404).send('Could not find that album.')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/albums/:id', (request, response) => {
  database('tracks').where('album_id', request.params.id).del()
    .then(() => {
      database('albums').where('id', request.params.id).del()
        .then(projectID => {
          if (projectID) {
            response.status(202).send(`Successfully deleted album ${request.params.id}.`)
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
        response.status(404).send('Could not find any tracks for that album')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/albums/:id/tracks', (request, response) => {
  const track = request.body
  const albumID = request.params.id

  for (let requiredParam of ['name', 'duration']) {
    if(!track[requiredParam]) {
      return response.status(422).send(`Expected format: { name: <String>, duration: <String> }. You're missing a ${requiredParam}.`)
    }
  }

  const cleanedTrack = { ...track, album_id: albumID }
  database('tracks').insert(cleanedTrack, 'id')
    .then(trackID => {
      if (trackID) {
        response.status(201).send(`Track successfully added to album ${albumID}. Track ID is ${trackID}`)
      } else {
        response.status(404).send('Could not find that album.')
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

app.put('/api/v1/tracks/:id', (request, response) => {
  const track = request.body
  const id = request.params.id

  database('tracks').where('id', id).update(track)
    .then(trackID => {
      if (trackID) {
        response.status(202).send(`Successfully updated track ${id}.`)
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
  response.status(404).send('Page Not Found')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})
