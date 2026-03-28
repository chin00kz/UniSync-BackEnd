const express = require('express');
const router = express.Router();
const { getMyBookings, createBooking, submitReport, getMySessions } = require('../controllers/studentController');

// Student bookings
router.get('/bookings', getMyBookings);
router.post('/bookings', createBooking);

// Student sessions/questions
router.get('/sessions', getMySessions);

// Student reports
router.post('/reports', submitReport);

module.exports = router;
