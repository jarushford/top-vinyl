const validateAlbumParams = (req, res, next) => {
  const album = req.body

  for (let requiredParam of ['album', 'genre', 'artist', 'rating', 'year']) {
    if (!album[requiredParam]) {
      return res.status(422)
        .send(`Expected format: { album: <String>, genre: <String>, artist: <String>, rating: <Integer || Float>, year: <String> }. You're missing a ${requiredParam}.`)
    }
  }

  next()
}

const validateTrackParams = (req, res, next) => {
  const track = req.body

  for (let requiredParam of ['name', 'duration']) {
    if(!track[requiredParam]) {
      return res.status(422)
        .send(`Expected format: { name: <String>, duration: <String> }. You're missing a ${requiredParam}.`)
    }
  }

  next()
}

const validateRating = (req, res, next) => {
  const album = req.body

  if (parseFloat(album.rating) > 5 || parseFloat(album.rating) < 0) {
    return res.status(422)
      .send('Improper format for rating. Rating must be either an integer or float between 0 and 5 and must have no more than 2 decimal places.')
  }

  next()
}

const validateYear = (req, res, next) => {
  const album = req.body

  if (parseInt(album.year.length) !== 4) {
    return res.status(422)
      .send('Improper format for year. Year must be a string in YYYY format.')
  }

  next()
}

const checkForID = (req, res, next) => {
  const album = req.body

  if (album.id) {
    return res.status(422).send('Property id cannot be set or updated.')
  }

  next()
}

const sortByYearHelper = (albums, sortByYear) => {
  return sortByYear
    ? albums.sort((a, b) => parseInt(a.year) - parseInt(b.year))
    : albums
}

const filterByYearHelper = (albums, year) => {
  return year
    ? albums.filter(album => album.year === year)
    : albums
}

const sortByRatingHelper = (albums, sortByRating) => {
  return sortByRating
    ? albums.sort((a, b) => parseFloat(b.rating.substring(0, 4)) - parseFloat(a.rating.substring(0, 4)))
    : albums
}

const filterByRatingHelper = (albums, rating) => {
  return rating
    ? albums.filter(album => parseFloat(album.rating.substring(0, 4)) >= parseFloat(rating.substring(0, 4)))
    : albums
}

module.exports = {
  validateAlbumParams,
  validateTrackParams,
  validateRating,
  validateYear,
  sortByYearHelper,
  filterByYearHelper,
  sortByRatingHelper,
  filterByRatingHelper,
  checkForID
}