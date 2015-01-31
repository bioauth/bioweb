var angular = require('angular');

var app = angular.module('bio', [])
    .controller('register', require('./controllers/register'));
