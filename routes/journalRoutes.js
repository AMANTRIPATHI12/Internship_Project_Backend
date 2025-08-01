const express = require('express');
const router = express.Router();
const {
  saveJournal,
  getJournalEntries,
  getJournalForDate
} = require('../controllers/journalController');

// 🟡 Save or Update Journal for Today
router.post('/log', saveJournal);

// 🟡 Get All Journal Entries for a User
router.get('/:uid', getJournalEntries);

// 🟡 Get Journal Entry by Date
router.get('/by-date', getJournalForDate); // use query params ?uid=...&date=...

module.exports = router;
