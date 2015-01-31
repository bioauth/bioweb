var knex = require('../../knex');
var Bluebird = require('bluebird');
var validator = require('validator');
var util = require('util');
var crypto = Bluebird.promisifyAll(require('crypto'));

function ValidationError (msg) { this.msg = msg; }
util.inherits(ValidationError, Error);

module.exports.get = function (req, res) {
    res.render('user/register');
};

module.exports.postreg = function (req, res) {
    res.render('user/postreg');
};

module.exports.post = function (req, res) {
    var user;
    var details = {
        username: req.body.username,
        email: req.body.email
    };

    new knex.User().query({ orWhere: details }).fetch().then(function (user) {
        if (!user) {
            return;
        } else if (user.get('username') === details.username) {
            throw new ValidationError('That username has already been taken.');
        } else if (user.get('email') === details.email) {
            throw new ValidationError('That email has already been taken.');
        } else {
            throw new Error('Unreachable');
        }
    }).then(function () {
        details.password = req.body.password;
        if (!validator.isEmail(details.email)) {
            throw new ValidationError('Invalid email');
        } else if (!validator.isLength(details.username, 4, 30)) {
            throw new ValidationError('Your username must be between 4 and 30 characters');
        } else if (!validator.isLength(details.password, 4, 30)) {
            throw new ValidationError('Your password must be between 4 and 30 characters');
        }

        user = new knex.User(details);
        return user.hashPassword()
    }).then(function () {
        return user.save();
    }).then(function () {
        res.status(200).json(user.clean);
    }).catch(ValidationError, function (err) {
        res.status(400).json(err.msg);
    });
};
