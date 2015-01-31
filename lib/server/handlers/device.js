var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisifyAll(require('bcrypt'));
var knex = require('../../knex');

function InvalidAuthError () {]}

module.exports = function (req, res) {
    var user = basicAuth(req);
    if (!user) {
        return res.status(400).json('You must authenticate.');
    }

    knex('users')
        .where('username', user.name)
        .find(function (users) {
            if (users.length === 0) {
                throw new InvalidAuthError();
            }

            return bcrypt.compareAsync(user.pass, user[0].password);
        })
        .then(function (matches) {
            if (!matches) {
                throw new InvalidAuthError();
            } else {
                knex('users').
            }
        })
};
