var _ = require('lodash');
var fs = require('fs');

var path = __dirname + '/../../config/';
var config = require(path + 'base');

var env = process.env.NODE_ENV;
if (fs.existsSync(path + env)) {
    _.extend(config, require(path + env));
}

module.exports = config;
