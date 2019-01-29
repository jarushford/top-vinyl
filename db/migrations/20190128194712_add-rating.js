
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('albums', (table) => {
      table.string('rating');
      table.string('album');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('albums', (table) => {
      table.dropColumn('rating');
      table.dropColumn('album');
    })
  ])
};
