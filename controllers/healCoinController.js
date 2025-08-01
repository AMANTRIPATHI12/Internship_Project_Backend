const HealCoin = require('../models/HealCoin');

const getHealCoins = async (req, res) => {
  try {
    const { uid } = req.params;
    const record = await HealCoin.findOne({ uid });
    const coins = record ? record.coins : 0;
    res.status(200).json({ coins });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getHealCoins };
