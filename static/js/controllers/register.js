function Register ($http) {
    var v = this;
    v.user = {};
    v.alert = null;
    v.disabled = false;

    v.run = function () {
        $http.post('/user/register', v.user)
            .success(function () {
                v.alert = ['success', 'You have been registered!'];
                window.location.pathname = '/user/postreg';
            })
            .error(function (data) {
                v.alert = ['danger', data];
            });
    };
}

Register.$inject = ['$http'];

module.exports = Register;
