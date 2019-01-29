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

  database('albums').select()
    .then(albums => {
      if (year) {
        return albums.filter(album => album.year === year)
      } else {
        return albums
      }
    })
    .then(dateFilteredAlbums => {
      if (rating) {
        return dateFilteredAlbums.filter(album => {
          return parseFloat(album.rating.substring(0, 4)) >= parseFloat(rating.substring(0, 4))
        })
      } else {
        return dateFilteredAlbums
      }
    })
    .then(filteredAlbums => {
      response.status(200).json(filteredAlbums)
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


app.use((request, response) => {
  response.status(404).send('Page Not Found')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})
