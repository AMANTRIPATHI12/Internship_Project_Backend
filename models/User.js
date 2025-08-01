const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'therapist'] },
  
  // 👇 Student-side field
  connectedTherapistUid: { type: String, default: null },

  // 👇 Therapist-side field
  connectedStudentUids: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);
