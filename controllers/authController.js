const User = require('../models/User');

const registerOrLoginUser = async (req, res) => {
  const { uid, email, role } = req.body;

  console.log("Received data:", uid, email, role);

  if (!uid || !email || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      // First time login — create user with role
      user = new User({ uid, email, role });
      await user.save();
      console.log("User saved to MongoDB:", user); // <-- Add this
    }

    return res.status(200).json({ message: 'User verified', user });
  } catch (err) {
      console.error("Error saving user:", err); // <--- add this
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerOrLoginUser,
  getUserInfo
};
