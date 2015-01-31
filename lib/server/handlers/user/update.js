var knex = require('../../../knex');

module.exports.update = function (req, res) {
    req.user.set({
        public_key: new Buffer(req.body.pk, 'hex'),
        device: req.body.device
    });

    req.user.save().then(function (user) {
        res.status(200).json(user.clean());
    });
};
