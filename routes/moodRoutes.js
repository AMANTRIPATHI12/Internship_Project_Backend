const express = require('express');
const router = express.Router();
const {
  logMood,
  getMoodLogs,
  getMoodLast7Days
} = require('../controllers/moodController');

// 🔵 Log Mood
router.post('/log', logMood);

// 🔵 Get Mood Logs for User
router.get('/:uid', getMoodLogs);

// 🔵 Get Mood Logs Last 7 Days
router.get('/last-7-days', getMoodLast7Days); // ⬅️ this was missing

module.exports = router;
