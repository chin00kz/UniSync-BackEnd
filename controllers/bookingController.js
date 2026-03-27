const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { tutorId, subject, date, timeSlot, message } = req.body;
        const studentId = req.headers['x-user-id'];

        console.log('--- BOOKING REQUEST ---');
        console.log('Student ID:', studentId);
        console.log('Tutor ID:', tutorId);
        console.log('Body:', req.body);

        if (!studentId || !tutorId) {
            return res.status(400).json({ 
                success: false, 
                error: `ID missing: Student(${studentId}) Tutor(${tutorId})` 
            });
        }

        const tutor = await User.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ success: false, error: 'Tutor not found in database' });
        }
        
        if (tutor.role !== 'staff' && tutor.role !== 'tutor') {
            return res.status(400).json({ 
                success: false, 
                error: `User ${tutor.name} is a ${tutor.role}, not a tutor/staff.` 
            });
        }

        const booking = await Booking.create({
            student: studentId,
            tutor: tutorId,
            subject,
            date,
            timeSlot,
            message
        });

        console.log('Booking successful:', booking._id);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.error('Create Booking Error:', err);
        res.status(500).json({ success: false, error: err.message || 'Server Error' });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        const bookings = await Booking.find({ student: userId })
            .populate('tutor', 'name sliitId email avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.error('Get My Bookings Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get tutor bookings
// @route   GET /api/bookings/tutor
// @access  Private
exports.getTutorBookings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        const bookings = await Booking.find({ tutor: userId })
            .populate('student', 'name sliitId email avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.error('Get Tutor Bookings Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
// @access  Private
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.headers['x-user-id'];

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Make sure user is the tutor of this booking
        if (booking.tutor.toString() !== userId) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.error('Update Booking Status Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
