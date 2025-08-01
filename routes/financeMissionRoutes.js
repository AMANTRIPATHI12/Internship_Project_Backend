const express = require('express');
const router = express.Router();

const {
  getMissionsByUid,
  addMission,
  completeMission,
} = require('../controllers/financeMissionController');

// Get all missions for a student
router.get('/:uid', getMissionsByUid);

// Add a new mission
router.post('/', addMission);

// Mark mission as completed
router.patch('/:id/complete', completeMission);

module.exports = router;
