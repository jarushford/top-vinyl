
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('albums', (table) => {
      table.increments('id').primary();
      table.string('artist');
      table.string('genre');
      table.string('year');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('tracks', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('duration');
      table.integer('album_id').unsigned();
      table.foreign('album_id').references('albums.id')
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tracks'),
    knex.schema.dropTable('albums')
  ])
};
