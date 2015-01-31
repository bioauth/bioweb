module.exports = {
    development: require('./lib/config').db,
    staging: require('./lib/config').db,
    production: require('./lib/config').db
};
