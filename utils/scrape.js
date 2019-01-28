const Nightmare = require('nightmare')
const fs = require('fs')
const urls = require('./urlOutput')

const albums = require('./albums.json')

  Nightmare()
    .goto(urls[99])
    .evaluate(() => {
      const artist = document.querySelector('h1#profile_title a').innerText
      const album = document.querySelector('h1#profile_title').innerText
      const rating = document.querySelector('span.rating_value').innerText
      const contentNodes = document.querySelectorAll('div.content a')
      const contentList = [].slice.call(contentNodes)
      const allContent = contentList.map(item => item.innerText)
      const trackNodes = document.querySelectorAll('span.tracklist_track_title')
      const durationNodes = document.querySelectorAll('td.tracklist_track_duration span')
      const trackList = [].slice.call(trackNodes)
      const durationList = [].slice.call(durationNodes)
      const tracks = trackList.map(track => track.innerText)
      const durations = durationList.map(time => time.innerText)
      const allTracks = tracks.reduce((acc, track, i) => {
        let builtTrack = { track, duration: durations[i] }
        acc.push(builtTrack)
        return acc
      }, [])
      return {
        artist,
        allContent,
        allTracks,
        rating,
        album
      }
    })
    .end()
    .then(result => {
      albums.push(result)
      fs.writeFileSync('utils/albums.json', JSON.stringify(albums))
    })
    .catch(error => {
      console.error('Search failed:', error)
    })
