var express = require('express');
var passport = require('./passport');
var app = express();

var config = require('../config');
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
// app.use(require('cookie-parser'));
app.use(require('express-session')(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.get('/client/register', require('./handlers/clientRegister').get);
app.post('/client/register', require('./handlers/clientRegister').post);

app.get('/user/register', require('./handlers/userRegister').get);
app.post('/user/register', require('./handlers/userRegister').post);

app.get('/login', require('./handlers/login').get);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/oauth/authorization?response_type=token&client_id=' + req.body.clientId + '&redirect_uri=' + req.body.redirectUri);
});

app.get('/oauth/authorization', require('./handlers/oauth').authorization);
app.post('/decision', require('./handlers/oauth').decision);

app.get('/restricted', passport.authenticate('accessToken', { session: false }), function (req, res) {
    res.send("Yay, you successfully accessed the restricted resource!");
});

module.exports = app;
