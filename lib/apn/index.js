var apn = require('apn');
var config = require('../config');

module.exports = new apn.Connection(config.apn);
