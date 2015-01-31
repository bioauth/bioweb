var angular = require('angular');

var app = angular.module('bio', [])
    .controller('land', require('./controllers/land'))
    .controller('register', require('./controllers/register'));
