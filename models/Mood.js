const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mood', moodSchema);
