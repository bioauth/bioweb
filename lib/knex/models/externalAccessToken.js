var bookshelf = require('../bookshelf');
var User = require('./user');

module.exports =  bookshelf.Model.extend({
    tableName: 'external_access_token'
});
