var express = require('express');
var passport = require('./passport');
var app = express();

var config = require('../config');
app.use(express.static(__dirname + '/static'));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
// app.use(require('cookie-parser'));
app.use(require('express-session')(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', require('./handlers/index').get);

app.get('/client/register', require('./handlers/clientRegister').get);
app.post('/client/register', require('./handlers/clientRegister').post);

app.get('/user/register', require('./handlers/user/register').get);
app.get('/user/postreg', require('./handlers/user/register').postreg);
app.post('/user/register', require('./handlers/user/register').post);
app.post('/user/update', require('./handlers/user/update').update);

app.get('/user/login', require('./handlers/user/login').get);
app.post('/user/login', passport.authenticate('local', { failureRedirect: '/user/login' }), function(req, res) {
    res.redirect('/user/oauth/authorization?response_type=token&client_id=' + req.body.clientId + '&redirect_uri=' + req.body.redirectUri);
});

app.get('/user/oauth/authorization', require('./handlers/user/oauth').authorization);
app.post('/user/decision', require('./handlers/user/oauth').decision);

app.get('/external/land', require('./handlers/external').land);
app.post('/external/attempt', require('./handlers/external').attempt);
app.post('/external/verify', require('./handlers/external').verify);
app.get('/external/:user/list', require('./handlers/external').list);
app.get('/external/:token', require('./handlers/external').find);


module.exports = app;
