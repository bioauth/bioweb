var knex = require('../../../knex');
var oauth2orize = require('oauth2orize');
var crypto = require('crypto');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

//(De-)Serialization for clients
server.serializeClient(function(client, done) {
    return done(null, client.id);
});

server.deserializeClient(function(id, done) {
    new knex.Client({ id: id }).fetch().then(function(client) {
        done(null, client);
    });
});

//Implicit grant
server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
  require('crypto').randomBytes(24, function (_, buf) {
    var token = buf.toString('hex');
    var tokenHash = crypto.createHash('sha1').update(token).digest('hex');
    var expiration = new Date(new Date().getTime() + (60 * 60 * 24 * 30));

    new knex.AccessToken({
        token: tokenHash,
        expiration: expiration,
        user: user.get('id')
    }).save().then(function () {
        return done(null, token, { expires_in: expiration.toISOString() });
    });
  });
}));

// user authorization endpoint
exports.authorization = [
  function(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  server.authorization(function(clientId, redirectURI, done) {
    new knex.Client({ id: clientId }).fetch().then(function(client) {
      // WARNING: For security purposes, it is highly advisable to check that
      // redirectURI provided by the client matches one registered with
      // the server. For simplicity, this example does not. You have
      // been warned.
      return done(null, client, redirectURI);
    });
  }),
  function(req, res) {
    res.render('user/decision', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
];

// user decision endpoint

exports.decision = [
  function(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/user/login');
    }
  },
  server.decision()
];
