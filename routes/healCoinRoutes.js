const express = require('express');
const router = express.Router();
const { getHealCoins } = require('../controllers/healCoinController');

router.get('/:uid', getHealCoins);

module.exports = router;
