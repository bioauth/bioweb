var request = require('request');
var Bluebird = require('bluebird');
var _ = require('lodash');
var config = require('../config');

function getHeaders () {
    return {
        'X-Mashape-Key': config.mashape.key,
        'Accept': 'application/json'
    };
}

module.exports = {
    get: function (url, data) {
        return new Bluebird(function (resolve, reject) {
            request.get(_.extend({
                url: url,
                headers: getHeaders()
            }, data), function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(response.body));
                }
            });
        });
    }
};
