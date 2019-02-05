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
          response.should.be.json
          response.body.should.be.a('object')
          response.body.should.have.property('message')
          response.body.should.have.property('id')
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

    it('POST with an id', done => {
      chai.request(server)
        .post('/api/v1/albums')
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "1968",
          "rating": 4.79,
          "album": "The Division Bell",
          "id": 45
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.should.be.html
          response.res.text.should.equal('Property id cannot be set or updated.')
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
    it('GET an album that exists', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .get(`/api/v1/albums/${id}`)
            .end((err, response) => {
              response.should.have.status(200)
              response.should.be.json
              response.body.album.should.be.a('string')
              response.body.genre.should.be.a('string')
              response.body.artist.should.be.a('string')
              response.body.rating.should.be.a('string')
              response.body.year.should.be.a('string')
              done()
            })
        })
    })

    it('GET an album that does not exist', done => {
      chai.request(server)
        .get(`/api/v1/albums/-4`)
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal('Could not find that album.')
          done()
        })
    })

    it('PUT an album that exists', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/albums/${id}`)
            .send({
              "artist": "Pink Floyd",
              "genre": "Rock",
              "year": "1965",
              "rating": 4.59,
              "album": "The Division Bell"
            })
            .end((err, response) => {
              response.should.have.status(202)
              response.should.be.json
              response.body.should.be.a('object')
              response.body.should.have.property('message')
              response.body.should.have.property('id')
              response.body.message.should.equal(`Successfully updated album ${id}.`)
              done()
            })
        })
    })

    it('PUT an album that does not exist', done => {
      chai.request(server)
        .put(`/api/v1/albums/-4`)
        .send({
          "artist": "Pink Floyd",
          "genre": "Rock",
          "year": "1965",
          "rating": 4.59,
          "album": "The Division Bell"
        })
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal(`Could not find that album.`)
          done()
        })
    })

    it('PUT with an id', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/albums/${id}`)
            .send({
              "artist": "Pink Floyd",
              "genre": "Rock",
              "year": "1965",
              "rating": 4.59,
              "id": 56,
              "album": "The Division Bell"
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Property id cannot be set or updated.`)
              done()
            })
        })
    })

    it('PUT an album with incomplete data', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/albums/${id}`)
            .send({
              "artist": "Pink Floyd",
              "genre": "Rock",
              "year": "1965",
              "album": "The Division Bell"
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Expected format: { album: <String>, genre: <String>, artist: <String>, rating: <Integer || Float>, year: <String> }. You're missing a rating.`)
              done()
            })
        })
    })

    it('PUT an album with an improperly formatted rating', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/albums/${id}`)
            .send({
              "artist": "Pink Floyd",
              "genre": "Rock",
              "year": "1965",
              "rating": 5.59,
              "album": "The Division Bell"
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Improper format for rating. Rating must be either an integer or float between 0 and 5 and must have no more than 2 decimal places.`)
              done()
            })
        })
    })

    it('PUT an album with an improperly formatted year', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/albums/${id}`)
            .send({
              "artist": "Pink Floyd",
              "genre": "Rock",
              "year": "65",
              "rating": 4.59,
              "album": "The Division Bell"
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Improper format for year. Year must be a string in YYYY format.`)
              done()
            })
        })
    })

    it('DELETE an album successfully', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .delete(`/api/v1/albums/${id}`)
            .end((err, response) => {
              response.should.have.status(202)
              response.should.be.json
              response.body.should.have.property('message')
              response.body.should.have.property('id')
              response.body.message.should.equal(`Successfully deleted album ${id}.`)
              done()
            })
        })
    })

    it('DELETE an album that cannot be found', done => {
      chai.request(server)
        .delete(`/api/v1/albums/-2`)
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal(`Could not find an album with that ID.`)
          done()
        })
    })
  })

  describe('/api/v1/albums/:id/tracks', () => {
    it('GET tracks for an album that exists', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .get(`/api/v1/albums/${id}/tracks`)
            .end((err, response) => {
              response.should.have.status(200)
              response.should.be.json
              response.body[0].should.have.property('name')
              response.body[0].name.should.be.a('string')
              response.body[0].should.have.property('duration')
              response.body[0].duration.should.be.a('string')
              done()
            })
        })
    })

    it('GET tracks for an album that does not exist', done => {
      chai.request(server)
        .get(`/api/v1/albums/-3/tracks`)
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal('Could not find any tracks for that album.')
          done()
        })
    })

    it('POST a track to an existing album', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .post(`/api/v1/albums/${id}/tracks`)
            .send({
              name: 'Breathe',
              duration: '3:46'
            })
            .end((err, response) => {
              response.should.have.status(201)
              response.should.be.json              
              response.body.should.have.property('message')
              response.body.should.have.property('id')
              response.body.id.should.be.a('number')
              response.body.message.should.be.a('string')
              done()
            })
        })
    })

    it('POST a track to an album that does not exist', done => {
      chai.request(server)
        .post(`/api/v1/albums/2/tracks`)
        .send({
          name: 'Breathe',
          duration: '3:46'
        })
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal('Could not find an album with that ID.')
          done()
        })
    })

    it('POST with an id', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .post(`/api/v1/albums/${id}/tracks`)
            .send({
              name: 'Breathe',
              duration: '3:46',
              id: 86
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal('Property id cannot be set or updated.')
              done()
            })
        })
    })

    it('POST a track with incomplete data', done => {
      let id
      chai.request(server)
        .get('/api/v1/albums')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .post(`/api/v1/albums/${id}/tracks`)
            .send({
              name: 'Breathe'
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal('Expected format: { name: <String>, duration: <String> }. You\'re missing a duration.')
              done()
            })
        })
    })
  })

  describe('/api/v1/tracks', () => {
    it('GET all tracks', done => {
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          response.should.have.status(200)
          response.body.should.be.a('array')
          response.body.should.have.length(5)
          response.body[0].should.have.property('name')
          response.body[0].name.should.be.a('string')
          response.body[0].should.have.property('duration')
          response.body[0].duration.should.be.a('string')
          done()
        })
    })
  })

  describe('/api/v1/tracks/:id', () => {
    it('GET track that exists', done => {
      let id
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .get(`/api/v1/tracks/${id}`)
            .end((err, response) => {
              response.should.have.status(200)
              response.should.be.json
              response.body.should.have.property('name')
              response.body.should.have.property('duration')
              done()
            })
        })
    })

    it('GET track that does not exist', done => {
      chai.request(server)  
        .get(`/api/v1/tracks/-5`)
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal('Could not find that track.')
          done()
        })
    })

    it('PUT a track successfully', done => {
      let id
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/tracks/${id}`)
            .send({
              name: 'Rio',
              duration: '8:38'
            })
            .end((err, response) => {
              response.should.have.status(202)
              response.should.be.html
              response.res.text.should.equal(`Successfully updated track ${id}.`)
              done()
            })
        })
    })

    it('PUT a track that does not exist', done => {
      chai.request(server)
        .put(`/api/v1/tracks/-4`)
        .send({
          name: 'Rio',
          duration: '8:38'
        })
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal(`Could not find that album.`)
          done()
        })
    })

    it('PUT with an id', done => {
      let id
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/tracks/${id}`)
            .send({
              name: 'Rio',
              duration: '8:38',
              id: 12
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Property id cannot be set or updated.`)
              done()
            })
        })
    })

    it('PUT a track with incomplete data', done => {
      let id
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .put(`/api/v1/tracks/${id}`)
            .send({
              name: 'Rio'
            })
            .end((err, response) => {
              response.should.have.status(422)
              response.should.be.html
              response.res.text.should.equal(`Expected format: { name: <String>, duration: <String> }. You're missing a duration.`)
              done()
            })
        })
    })

    it('DELETE a track successfully', done => {
      let id
      chai.request(server)
        .get('/api/v1/tracks')
        .end((err, response) => {
          id = response.body[0].id
          chai.request(server)
            .delete(`/api/v1/tracks/${id}`)
            .end((err, response) => {
              response.should.have.status(202)
              response.should.be.html
              response.res.text.should.equal(`Successfully deleted track ${id}.`)
              done()
            })
        })
    })

    it('DELETE a track that cannot be found', done => {
      chai.request(server)
        .delete(`/api/v1/tracks/-2`)
        .end((err, response) => {
          response.should.have.status(404)
          response.should.be.html
          response.res.text.should.equal(`Could not find a track with that ID.`)
          done()
        })
    })
  })
})