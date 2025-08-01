const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // <- You’ll download this from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
