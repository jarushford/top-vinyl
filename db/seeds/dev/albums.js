const albums = require('../../../utils/cleanData.json')

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

      albums.forEach(album => {
        albumPromises.push(createAlbum(knex, album))
      })
      return Promise.all(albumPromises)
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
