const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getTutorBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/me', getMyBookings);
router.get('/tutor', getTutorBookings);
router.patch('/:id', updateBookingStatus);

module.exports = router;
