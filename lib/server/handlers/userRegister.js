var knex = require('../../knex');
var Bluebird = require('bluebird');
var crypto = Bluebird.promisifyAll(require('crypto'));

module.exports.get = function (req, res) {
    res.render('registerUser');
};

module.exports.post = function (req, res) {
    console.log(knex);
    var user = new knex.User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user.hashPassword().then(function () {
        return user.save();
    }).then(function (user) {
        return res.status(200).json(user.clean());
    });
};
