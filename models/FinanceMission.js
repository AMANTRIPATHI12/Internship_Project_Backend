const mongoose = require('mongoose');

const financeMissionSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Student UID
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, enum: ['student', 'therapist'], required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinanceMission', financeMissionSchema);
