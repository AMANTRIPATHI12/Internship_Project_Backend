// controllers/journalController.js
const JournalEntry = require('../models/JournalEntry');
const HealCoin = require('../models/HealCoin');

// ✅ Save or Update Today's Journal (awards 10 coins only on first entry today)
const saveJournal = async (req, res) => {
  const { uid, entry } = req.body;
  if (!uid || !entry) return res.status(400).json({ message: 'uid and entry are required' });

  const today = new Date().toISOString().split('T')[0];

  try {
    const existing = await JournalEntry.findOne({ uid, date: today });

    if (existing) {
      existing.entry = entry;
      await existing.save();
      return res.status(200).json({ message: 'Journal updated (no coins awarded)' });
    } else {
      await JournalEntry.create({ uid, entry, date: today });

      let record = await HealCoin.findOne({ uid });
      if (record) {
        record.coins += 10;
        await record.save();
      } else {
        await HealCoin.create({ uid, coins: 10 });
      }

      return res.status(200).json({ message: 'Journal saved and 10 Heal Coins awarded' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get All Journal Entries (sorted)
const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ uid: req.params.uid }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Journal for Specific Date
const getJournalForDate = async (req, res) => {
  const { uid, date } = req.query;
  if (!uid || !date) return res.status(400).json({ message: 'uid and date are required' });

  try {
    const entry = await JournalEntry.findOne({ uid, date });
    res.status(200).json(entry || { entry: '' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  saveJournal,
  getJournalEntries,
  getJournalForDate
};
