const express = require('express');
const router = express.Router();
const { registerOrLoginUser, getUserInfo } = require('../controllers/authController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// Called after Firebase login — registers/stores role if new user
router.post('/verify', registerOrLoginUser);

// Get user info if authenticated
router.get('/me', verifyFirebaseToken, getUserInfo);

module.exports = router;
