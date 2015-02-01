var knex = require('../../../knex');
var Bluebird = require('bluebird');
var crypto = Bluebird.promisifyAll(require('crypto'));
var util  = require('util');
var mashape = require('../../../mashape');

var apnConnection = require('../../../apn');
var apn  = require('apn');

function NotFoundError (msg) { this.msg = msg; }
util.inherits(NotFoundError, Error);
function InvalidError (msg) { this.msg = msg; }
util.inherits(InvalidError, Error);

var validTime = 60 * 60 * 1000;

module.exports.attempt = function (req, res) {
    Bluebird.all([
        new knex.ExternalClient({ id: req.body.id }).fetch(),
        new knex.User({ email: req.body.email }).fetch(),
        mashape.get('https://montanaflynn-geocoder.p.mashape.com/ip', { qs: { ip: '138.51.205.14' }}),
        crypto.randomBytesAsync(24)
    ]).spread(function (client, user, geoip, token) {
        if (!client) {
            throw new NotFoundError('Client unknown.');
        } else if (!user) {
            throw new NotFoundError('User not found.');
        }

        pushNotification(user, token);

        return new knex.ExternalAccessToken({
            expiration: new Date(Date.now() + validTime),
            token: token.toString('hex'),
            user: user.id,
            location: buildLocationStr(geoip),
            created_at: new Date(),
            status: 'pending'
        }).save();
    }).then(function (token) {
        res.status(200).json({ token: token.get('token') });
    }).catch(NotFoundError, function (err) {
        res.status(400).json(err.msg);
    });
};

module.exports.verify = function (req, res) {
    new knex.ExternalAccessToken({ token: req.body.token }).fetch().then(function (token) {
        if (!token || token.get('expiration').getTime() < Date.now()) {
            throw new NotFoundError('Invalid token.');
        }

        return new knex.User({ id: token.get('user') }).fetch().then(function (user) {
            return [token, user];
        });
    }).spread(function (token, user) {

        var expected = crypto.createHash('sha512').update(
            user.get('public_key') + token.get('token')
        ).digest('hex');

        console.log(user.get('public_key') + '/' + token.get('token'));
        console.log(expected);

        if (req.body.hashed === expected) {
            token.set('status', 'accepted');
        } else {
            token.set('status', 'rejected');
        }

        return token.save();
    }).then(function (token) {
        res.status(token.get('status') === 'accepted' ? 200 : 400).json(token);
    }).catch(NotFoundError, function (err) {
        res.status(404).json(err.msg);
    });
};

module.exports.list = function (req, res) {
    knex.ExternalAccessToken.query()
        .where('user', '=', req.params.user)
        .where('expiration', '>', new Date())
        .orderBy('created_at', 'desc')
        .then(function (tokens) {
            res.status(200).json(tokens);
        });
};

module.exports.find = function (req, res) {
    new knex.ExternalAccessToken({ token: req.params.token }).fetch().then(function (token) {
        if (token) {
            res.status(200).json(token);
        } else {
            res.status(404).json('Token not found.');
        }
    });
};

module.exports.land = function (req, res) {
    res.render('external/land');
};

function buildLocationStr (response) {
    var out = [];
    if (response.city) {
        out.push(response.city);
    }
    if (response.region) {
        out.push(response.region);
    }
    if (out.length < 2 && response.country) {
        out.push(response.country);
    }

    return out.join(', ');
}

function pushNotification (user, token) {
    if (!user.get('device')) {
        return;
    }

    var notification = new apn.Notification();
    notification.expiry = ~~((Date.now() + validTime) / 1000);
    notification.alert = 'You have a new BioAuth login request.';
    notification.payload = { token: token };

    apnConnection.pushNotification(notification, new apn.Device(user.get('device')));
}
