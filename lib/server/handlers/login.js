module.exports.get = function (req, res) {
    res.render('login', {
        clientId: req.query.clientId,
        redirectUri: req.query.redirectUri
    });
};
