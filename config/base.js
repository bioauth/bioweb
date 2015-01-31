module.exports = {
    db: {
        client: 'mysql',
        debug: true,
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'bioweb'
        }
    },
    session: {
        secret: 'foo',
        resave: false,
        saveUninitialized: false
    },
    apn: {
        cert: __dirname + '/BioAuthCert.pem',
        key: __dirname + '/BioAuthKey.pem',
        gateway: 'gateway.sandbox.push.apple.com',
        passphrase: 'bioauth'
    }
};
