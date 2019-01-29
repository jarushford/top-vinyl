const mockAlbums = [
  {
    "artist": "Pink Floyd",
    "genre": "Rock",
    "year": "1933",
    "rating": "4.69 / 5",
    "album": "The Dark Side Of The Moon",
    "tracks": [
      { "track": "Test Song", "duration": "4:00" }
    ]
  },
  {
    "artist": "Elton John",
    "genre": "Rock",
    "year": "1974",
    "rating": "4.31 / 5",
    "album": "Goodbye Yellow Brick Road",
    "tracks": [
      { "track": "Test Song", "duration": "4:00" }
    ]
  },
  {
    "artist": "Led Zeppelin",
    "genre": "Rock",
    "year": "1972",
    "rating": "4.49 / 5",
    "album": "Houses Of The Holy",
    "tracks": [
      { "track": "Test Song", "duration": "4:00" }
    ]
  },
  {
    "artist": "The Rolling Stones",
    "genre": "Rock",
    "year": "1987",
    "rating": "4.07 / 5",
    "album": "Goat’s Head Soup",
    "tracks": [
      { "track": "Test Song", "duration": "4:00" }
    ]
  },
  {
    "artist": "Paul McCartney And Wings",
    "genre": "Rock",
    "year": "1973",
    "rating": "4.34 / 5",
    "album": "Band On The Run",
    "tracks": [
      { "track": "Test Song", "duration": "4:00" }
    ]
  }
]

const createAlbum = (knex, album) => {
  return knex('albums').insert({
    album: album.album,
    genre: album.genre,
    artist: album.artist,
    rating: album.rating,
    year: album.year
  }, 'id')
  .then(albumID => {
    let trackPromises = []

    album.tracks.forEach(track => {
      trackPromises.push(
        createTrack(knex, {
          name: track.track,
          duration: track.duration,
          album_id: albumID[0]
        })
      )
    })
    return Promise.all(trackPromises)
  })
}

const createTrack = (knex, track) => {
  return knex('tracks').insert(track)
}

exports.seed = function(knex, Promise) {
  return knex('tracks').del()
    .then(() => knex('albums').del())
    .then(() => {
      let albumPromises = []

      mockAlbums.forEach(album => {
        albumPromises.push(createAlbum(knex, album))
      })
      return Promise.all(albumPromises)
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};