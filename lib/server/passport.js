var passport = require('passport');
var crypto = require('crypto');
var knex = require('../knex');

var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        new knex.User({ username: username }).fetch().then(function (user) {
            if (!user) {
                return done(null, false);
            }

            return user.validatePassword(password).then(function (res) {
                done(null, res ? user : false);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    new knex.User({ id: id }).fetch().then(function (user) {
        done(null, user);
    });
});


function strategy (clientId, clientSecret, done) {
    new knex.Clients({ id: clientId, secret: clientSecret }).fetch().then(function (client) {
        done(null, client || false);
    });
}

passport.use('clientBasic', new BasicStrategy(strategy));
passport.use('clientPassword', new ClientPasswordStrategy(strategy));

passport.use('accessToken', new BearerStrategy(
    function (accessToken, done) {
        var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex');

        new knex.AccessToken({ token: accessTokenHash }).fetch().then(function (token) {
            if (!token) {
                return done(null, false);
            }

            if (new Date() > token.get('expirationDate')) {
                token.destroy().then(function () {
                    done();
                });
            } else {
                new knex.User({ id: token.get('user') }).fetch().then(function (user) {
                    done(null, user, { scope: '*' });
                });
            }
        });
    }
));

module.exports = passport;
