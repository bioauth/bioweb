var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisifyAll(require('bcrypt'));
var _ = require('lodash');
var bookshelf = require('../bookshelf');

module.exports =  bookshelf.Model.extend({
    tableName: 'user',

    /**
     * Checks to see if the given password matches the one
     * stored on this model.
     * @param  {String} password
     * @return {Promise} => Boolean
     */
    validatePassword: function (password) {
        return bcrypt.compareAsync(password, this.get('password'));
    },

    /**
     * Hashes the password on this user.
     * @return {Promise}
     */
    hashPassword: function () {
        var password = this.get('password');
        var self = this;

        return bcrypt.genSaltAsync(8).then(function(salt) {
            return bcrypt.hashAsync(password, salt);
        }).then(function (hashed) {
            self.set('password', hashed);
        });
    },

    /**
     * Returns safe, public attributes of the user.
     * @return {Object}
     */
    clean: function () {
        return _.omit(this.attributes, ['password', 'device', 'public_key']);
    }
});
