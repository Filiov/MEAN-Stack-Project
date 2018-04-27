const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
<<<<<<< HEAD
    // uri: 'mongodb://localhost:27017/mean-angular-5',
    uri: 'mongodb://admin:test123@ds259499.mlab.com:59499/memento-app',
    secret: crypto,
    db: 'memento-app'
=======
  // uri: 'mongodb://admin:test123@ds259499.mlab.com:59499/memento-app',
  uri: 'mongodb://localhost:27017/mean-angular-5',
  secret: crypto,
  db: 'mean-angular-5'
>>>>>>> move-to-mlab
}
