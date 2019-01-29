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
    it('sdsf', done => {
      done()
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