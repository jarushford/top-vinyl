const data = require('./albums.json')
const fs = require('fs')

const cleanedData = data.reduce((cleanData, album) => {
  let cleanAlbum = {
    album: cleanAlbumName(album.album),
    genre: album.allContent[0],
    year: cleanYear(album.allContent),
    tracks: cleanTracks(album.allTracks),
    artist: album.artist,
    rating: `${album.rating} / 5`
  }
  cleanData.push(cleanAlbum)
  return cleanData
}, [])

function cleanYear(content) {
  const year = content.filter(item => {
    if (!isNaN(parseInt(item))) {
      return item
    }
  })
  return year[0]
}

function cleanAlbumName(uncleanName) {
  const nameArray = uncleanName.split('')
  let foundHyphen = false
  const cleanName = nameArray.reduce((acc, letter) => {
    if (letter === '–') {
      foundHyphen = true
      return acc
    } else if (!foundHyphen) {
      return acc
    } else {
      acc += letter
      return acc
    }
  }, '')
  return cleanName.substring(1)
}

function cleanTracks(uncleanTracks) {
  return uncleanTracks.map(track => {
    if (track.duration === '') {
      return { duration: 'No Data', track: track.track }
    } else {
      return track
    }
  })
}

fs.writeFileSync('utils/cleanData.json', JSON.stringify(cleanedData))
