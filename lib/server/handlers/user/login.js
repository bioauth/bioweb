module.exports.get = function (req, res) {
    res.render('user/login', {
        clientId: req.query.clientId,
        redirectUri: req.query.redirectUri
    });
};
