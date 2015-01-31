exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments();
            table.string('username');
            table.string('email');
            table.string('password');
            table.string('device');
            table.timestamps();
        }),

        knex.schema.createTable('clients', function (table) {
            table.string('id').primary();
            table.string('secret');
            table.string('name');
            table.timestamps();
        }),

        knex.schema.createTable('access_token', function (table) {
            table.string('id').primary();
            table.dateTime('expiration');
            table.string('token').index();
            table.integer('user').index();
            table.timestamps();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
