const express = require('express');
const router = express.Router();
const { getTutorList, getMyBookings, updateBookingStatus } = require('../controllers/tutorController');

// Tutor list (available for students/public)
router.get('/list', getTutorList);

// Tutor private routes (requires x-user-id in header)
router.get('/bookings', getMyBookings);
router.patch('/bookings/:id', updateBookingStatus);

module.exports = router;
