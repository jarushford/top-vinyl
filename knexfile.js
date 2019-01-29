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
  }

};
