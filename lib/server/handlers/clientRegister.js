var knex = require('../../knex');
var Bluebird = require('bluebird');
var crypto = Bluebird.promisifyAll(require('crypto'));

module.exports.get = function (req, res) {
    res.render('registerClient');
};

module.exports.post = function (req, res) {
    Bluebird.all([
        crypto.randomBytesAsync(8),
        crypto.randomBytesAsync(32),
    ]).spread(function (id, secret) {
        var values = {
            id: id.toString('hex'),
            secret: secret.toString('hex'),
            name: req.body.name
        };

        return knex.Client.query().insert(values).then(function () {
            return values;
        });
    }).then(function (values) {
        return res.status(200).json(values);
    });
};
