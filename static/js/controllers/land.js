var querystring = require('querystring');

function Register ($http) {
    var v = this;
    var query = querystring.parse(location.search.slice(1));

    v.alert = null;

    function run () {
        $http.get('/external/' + query.token)
            .success(function (data) {
                if (data.status !== 'pending') {
                    window.location = query.redirectUri + '?token=' + query.token;
                } else {
                    setTimeout(run, 1000);
                }
            })
            .error(function (data) {
                v.alert = ['danger', data];
            });
    }

    run();
}

Register.$inject = ['$http'];

module.exports = Register;
