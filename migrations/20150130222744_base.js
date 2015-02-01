exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('user', function (table) {
            table.increments();
            table.string('username');
            table.string('email');
            table.string('password');
            table.string('device');
            table.binary('public_key');
        }),

        knex.schema.createTable('client', function (table) {
            table.string('id').primary();
            table.string('secret');
            table.string('name');
        }),

        knex.schema.createTable('external_client', function (table) {
            table.string('id').primary();
            table.string('secret');
            table.string('name');
        }),

        knex.schema.createTable('external_access_token', function (table) {
            table.increments();
            table.dateTime('expiration');
            table.string('token').index();
            table.integer('user').index();
            table.string('status');
            table.string('location');
            table.dateTime('created_at');
        }),

        knex.schema.createTable('access_token', function (table) {
            table.increments();
            table.dateTime('expiration');
            table.string('token').index();
            table.integer('user').index();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
