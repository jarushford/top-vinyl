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
      const FBR = filterByRatingHelper(SBR, rating)
      if (FBR.length) {
        response.status(200).json(FBR)
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
