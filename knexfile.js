module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/vinyl',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/vinyltest',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: '/db/seeds/test'
    }
  }

};
