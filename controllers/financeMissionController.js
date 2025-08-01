const FinanceMission = require('../models/FinanceMission');

// 🔹 Get all missions for a student
const getMissionsByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const missions = await FinanceMission.find({ uid }).sort({ createdAt: -1 });
    res.status(200).json(missions);
  } catch (err) {
    console.error('❌ Error fetching missions:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🔹 Add a new mission (by student or therapist)
const addMission = async (req, res) => {
  try {
    const { uid, title, description = '', createdBy } = req.body;

    // Validate required fields
    if (!uid || !title || !createdBy) {
      return res.status(400).json({ message: 'uid, title, and createdBy are required' });
    }

    // Validate createdBy
    if (!['student', 'therapist'].includes(createdBy)) {
      return res.status(400).json({ message: 'createdBy must be either "student" or "therapist"' });
    }

    const mission = new FinanceMission({ uid, title, description, createdBy });
    await mission.save();

    res.status(201).json(mission);
  } catch (err) {
    console.error('❌ Error adding mission:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🔹 Mark mission as complete
const completeMission = async (req, res) => {
  try {
    const { id } = req.params;

    const mission = await FinanceMission.findById(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    mission.completed = true;
    await mission.save();

    res.status(200).json({ message: 'Mission marked as completed', mission });
  } catch (err) {
    console.error('❌ Error completing mission:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getMissionsByUid,
  addMission,
  completeMission,
};
