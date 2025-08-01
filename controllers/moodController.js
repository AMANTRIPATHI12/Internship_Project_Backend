const Mood = require('../models/Mood');
const HealCoin = require('../models/HealCoin');

// 🔵 Mood Log
const logMood = async (req, res) => {
  const { uid, mood, note } = req.body;
  if (!uid || !mood) return res.status(400).json({ message: 'uid and mood are required' });

  try {
    await Mood.create({ uid, mood, note });

    let record = await HealCoin.findOne({ uid });
    if (record) {
      record.coins += 5;
      await record.save();
    } else {
      await HealCoin.create({ uid, coins: 5 });
    }

    res.status(200).json({ message: 'Mood logged and 5 Heal Coins awarded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🔵 Get Mood Logs from Last 7 Days
const getMoodLast7Days = async (req, res) => {
  const { uid } = req.query;

  if (!uid) return res.status(400).json({ message: 'uid is required' });

  try {
    const today = new Date();
    const past7Days = new Date();
    past7Days.setDate(today.getDate() - 6);

    const logs = await Mood.find({
      uid,
      createdAt: { $gte: past7Days }
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error('❌ getMoodLast7Days error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// 🔵 Get Mood Logs
const getMoodLogs = async (req, res) => {
  try {
    const moods = await Mood.find({ uid: req.params.uid }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  logMood,
  getMoodLogs,
  getMoodLast7Days
};
