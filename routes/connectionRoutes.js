// routes/connectionRoutes.js
const express = require('express');
const router = express.Router();
const {
  connectStudentToTherapist,
  getTherapistStudents,
  getTherapistStudentsWithData,
  disconnectStudent,
  therapistAcceptConnection,
} = require('../controllers/connectionController');

router.post('/connect', connectStudentToTherapist); // student connects to therapist
router.get('/therapist/:uid/students', getTherapistStudents); // therapist fetches connected students
router.get('/therapist/:uid/students-data', getTherapistStudentsWithData); // full data
router.post('/disconnect', disconnectStudent);
router.post('/accept-link', therapistAcceptConnection); 

module.exports = router;
