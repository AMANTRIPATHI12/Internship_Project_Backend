const User = require('../models/User');
const Mood = require('../models/Mood');
const JournalEntry = require('../models/JournalEntry');
const HealCoin = require('../models/HealCoin');

// 🟡 Student connects to a therapist
const connectStudentToTherapist = async (req, res) => {
  const { studentUid, therapistUid } = req.body;

  if (!studentUid || !therapistUid) {
    return res.status(400).json({ message: 'studentUid and therapistUid are required' });
  }

  try {
    const student = await User.findOne({ uid: studentUid });
    const therapist = await User.findOne({ uid: therapistUid });

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or invalid role' });
    }

    if (!therapist || therapist.role !== 'therapist') {
      return res.status(404).json({ message: 'Therapist not found or invalid role' });
    }

    // Prevent duplicate connection
    if (student.connectedTherapistUid === therapistUid) {
      return res.status(200).json({ message: 'Already connected' });
    }

    student.connectedTherapistUid = therapistUid;
    await student.save();

    // Add student to therapist's list if not already there
    if (!therapist.connectedStudentUids.includes(studentUid)) {
      therapist.connectedStudentUids.push(studentUid);
      await therapist.save();
    }

    res.status(200).json({ message: 'Student connected to therapist' });
  } catch (err) {
    console.error('❌ Error connecting student:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🟡 Therapist fetches connected students (basic info only)
const getTherapistStudents = async (req, res) => {
  const { uid } = req.params;

  try {
    const therapist = await User.findOne({ uid });

    if (!therapist || therapist.role !== 'therapist') {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const students = await User.find({ uid: { $in: therapist.connectedStudentUids } });
    res.status(200).json(students);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🟢 Therapist fetches connected students with mood, journal, coins
const getTherapistStudentsWithData = async (req, res) => {
  const { uid } = req.params;

  try {
    const therapist = await User.findOne({ uid });

    if (!therapist || therapist.role !== 'therapist') {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const students = await User.find({ uid: { $in: therapist.connectedStudentUids } });

    const result = await Promise.all(
      students.map(async (student) => {
        const moodLogs = await Mood.find({ uid: student.uid })
          .sort({ createdAt: -1 })
          .limit(7);

        const journal = await JournalEntry.find({ uid: student.uid })
          .sort({ date: -1 })
          .limit(1);

        const healCoin = await HealCoin.findOne({ uid: student.uid });

        return {
          email: student.email,
          uid: student.uid,
          moods: moodLogs,
          journal: journal[0]?.entry || '',
          coins: healCoin?.coins || 0,
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error fetching student data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🔴 Therapist disconnects a student
const disconnectStudent = async (req, res) => {
  const { therapistUid, studentUid } = req.body;

  if (!therapistUid || !studentUid) {
    return res.status(400).json({ message: 'therapistUid and studentUid are required' });
  }

  try {
    const therapist = await User.findOne({ uid: therapistUid });
    const student = await User.findOne({ uid: studentUid });

    if (!therapist || therapist.role !== 'therapist') {
      return res.status(404).json({ message: 'Therapist not found or invalid role' });
    }

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or invalid role' });
    }

    // Remove therapist from student's connected therapist
    if (student.connectedTherapistUid === therapistUid) {
      student.connectedTherapistUid = null;
      await student.save();
    }

    // Remove student from therapist's list
    therapist.connectedStudentUids = therapist.connectedStudentUids.filter(
      (uid) => uid !== studentUid
    );
    await therapist.save();

    res.status(200).json({ message: 'Student disconnected successfully' });
  } catch (err) {
    console.error('❌ Error disconnecting student:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Therapist accepts connection via link
const therapistAcceptConnection = async (req, res) => {
  const { therapistUid, studentUid } = req.body;

  if (!therapistUid || !studentUid) {
    return res.status(400).json({ message: 'therapistUid and studentUid are required' });
  }

  try {
    const student = await User.findOne({ uid: studentUid });
    const therapist = await User.findOne({ uid: therapistUid });

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or invalid role' });
    }

    if (!therapist || therapist.role !== 'therapist') {
      return res.status(404).json({ message: 'Therapist not found or invalid role' });
    }

    if (student.connectedTherapistUid === therapistUid) {
      return res.status(200).json({ message: 'Already connected' });
    }

    student.connectedTherapistUid = therapistUid;
    await student.save();

    if (!therapist.connectedStudentUids.includes(studentUid)) {
      therapist.connectedStudentUids.push(studentUid);
      await therapist.save();
    }

    res.status(200).json({ message: 'Connected successfully' });
  } catch (err) {
    console.error('❌ Error accepting connection:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = {
  connectStudentToTherapist,
  getTherapistStudents,
  getTherapistStudentsWithData,
  disconnectStudent,
  therapistAcceptConnection,
};