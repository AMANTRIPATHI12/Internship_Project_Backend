const mongoose = require('mongoose');

const healCoinSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  coins: { type: Number, default: 0 }
});

module.exports = mongoose.model('HealCoin', healCoinSchema);
