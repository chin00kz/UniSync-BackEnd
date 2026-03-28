const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all active tutors (staff role)
// @route   GET /api/tutor/list
exports.getTutorList = async (req, res) => {
    try {
        const tutors = await User.find({
            role: 'staff',
            isBanned: false
        }).select('-password');

        res.status(200).json({ success: true, count: tutors.length, data: tutors });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get bookings for the logged-in tutor
// @route   GET /api/tutor/bookings
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(400).json({ success: false, error: 'User ID required' });

        const bookings = await Booking.find({ tutor: userId })
            .populate('student', 'name sliitId email avatar')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update a booking status (Accept/Reject/Complete)
// @route   PATCH /api/tutor/bookings/:id
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.headers['x-user-id'];

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

        // Security check: only the assigned tutor can update
        if (booking.tutor.toString() !== userId) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
        }

        const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
