const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    // uri: 'mongodb://localhost:27017/mean-angular-5',
    url: 'mongodb://user:test123@ds259499.mlab.com:59499/memento-app',
    secret: crypto,
    db: 'memento-app'
}
