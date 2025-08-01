// models/JournalEntry.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  uid: { type: String, required: true },
  entry: { type: String, required: true },
  date: { type: Date, default: Date.now } // ✅ auto-set current date
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
