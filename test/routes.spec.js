const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

const environment = process.env.NODE_ENV || 'development'
const config = require('../knexfile')[environment]
const knex = require('knex')(config)

chai.use(chaiHttp)

describe('API', () => {
  before(done => {
    knex.migrate.latest()
      .then(() => {
        done()
      })
  })

  beforeEach(done => {
    knex.seed.run()
      .then(() => {
        done()
      })
  })

  describe('/api/v1/albums', () => {
    it('GET all albums with no query params', done => {
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.should.have.length(5)
          response.body[0].should.have.property('artist')
          response.body[0].artist.should.be.a('string')
          response.body[0].should.have.property('genre')
          response.body[0].artist.should.be.a('string')
          response.body[0].should.have.property('year')
          response.body[0].artist.should.be.a('string')
          response.body[0].should.have.property('rating')
          response.body[0].artist.should.be.a('string')
          response.body[0].should.have.property('album')
          response.body[0].artist.should.be.a('string')
          done()
        })
    })

    it('GET all albums sorted by year', done => {
      chai.request(server)
        .get('/api/v1/albums?sortByYear=true')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.should.have.length(5)
          response.body[0].year.should.equal('1933')
          response.body[1].year.should.equal('1972')
          response.body[2].year.should.equal('1973')
          response.body[3].year.should.equal('1974')
          response.body[4].year.should.equal('1987')
          done()
        })
    })

    it('GET all albums sorted by rating', done => {
      chai.request(server)
        .get('/api/v1/albums?sortByRating=true')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.should.have.length(5)
          response.body[0].rating.should.equal('4.69 / 5')
          response.body[1].rating.should.equal('4.49 / 5')
          response.body[2].rating.should.equal('4.34 / 5')
          response.body[3].rating.should.equal('4.31 / 5')
          response.body[4].rating.should.equal('4.07 / 5')
          done()
        })
    })

    it('GET all albums filtered by year', done => {
      chai.request(server)
        .get('/api/v1/albums?year=1972')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.should.have.length(1)
          response.body[0].album.should.equal('Houses Of The Holy')
          response.body[0].year.should.equal('1972')
          done()
        })
    })

    it('GET all albums filtered by rating', done => {
      chai.request(server)
        .get('/api/v1/albums?rating=4.4')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.should.have.length(2)
          done()
        })
    })

    it('GET all albums with no query string matches', done => {
      chai.request(server)
        .get('/api/v1/albums?rating=4.7')
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal('Could not find any albums that match your request.')
          done()
        })
    })

    it('POST an album successfully', done => {
      chai.request(server)
        .post('/api/v1/albums')
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "1968",
          "rating": 4.79,
          "album": "The Division Bell"
        })
        .end((err, response) => {
          response.should.have.status(201)
          response.should.be.html
          response.res.text.should.be.a('string')
          done()
        })
    })

    it('POST an album with incomplete data', done => {
      chai.request(server)
        .post('/api/v1/albums')
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "1968",
          "rating": 4.79
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.should.be.html
          response.res.text.should.equal('Expected format: { album: <String>, genre: <String>, artist: <String>, rating: <Integer || Float>, year: <String> }. You\'re missing a album.')
          done()
        })
    })

    it('POST an album with an improperly formatted rating', done => {
      chai.request(server)
        .post('/api/v1/albums')
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "1968",
          "rating": 5.79,
          "album": "The Division Bell"
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.should.be.html
          response.res.text.should.equal('Improper format for rating. Rating must be either an integer or float between 0 and 5 and must have no more than 2 decimal places.')
          done()
        })
    })

    it('POST an album with an improperly formatted year', done => {
      chai.request(server)
        .post('/api/v1/albums')
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "'87",
          "rating": 4.79,
          "album": "The Division Bell"
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.should.be.html
          response.res.text.should.equal('Improper format for year. Year must be a string in YYYY format.')
          done()
        })
    })
  })

  describe('/api/v1/albums/:id', () => {

  })

  describe('/api/v1/albums/:id/tracks', () => {

  })

  describe('/api/v1/tracks', () => {

  })

  describe('/api/v1/tracks/:id', () => {

  })
})