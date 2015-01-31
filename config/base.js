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
        cert: __dirname + '/BioMessageCert.pem',
        key: __dirname + '/BioMessageKey.pem',
        gateway:'gateway.sandbox.push.apple.com',
        passphrase: 'biomessage'
    }
};
