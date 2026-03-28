const Booking = require('../models/Booking');
const Report = require('../models/Report');
const Session = require('../models/Session');

// @desc    Get the logged-in student's bookings
// @route   GET /api/student/bookings
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(400).json({ success: false, error: 'User ID required' });

        const bookings = await Booking.find({ student: userId })
            .populate('tutor', 'name sliitId email avatar')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create a new booking/consultation request
// @route   POST /api/student/bookings
exports.createBooking = async (req, res) => {
    try {
        const { tutorId, subject, date, timeSlot, message } = req.body;
        const studentId = req.headers['x-user-id'];

        if (!studentId || !tutorId) {
            return res.status(400).json({ success: false, error: 'Student and Tutor IDs required' });
        }

        const booking = await Booking.create({
            student: studentId,
            tutor: tutorId,
            subject,
            date,
            timeSlot,
            message
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Submit a report/complaint
// @route   POST /api/student/reports
exports.submitReport = async (req, res) => {
    try {
        const studentId = req.headers['x-user-id'];
        const report = await Report.create({
            ...req.body,
            reporter: studentId
        });
        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get the student's own questions/sessions
// @route   GET /api/student/sessions
exports.getMySessions = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ success: false, error: 'Student name required' });
        
        const sessions = await Session.find({ studentName: name }).sort('-createdAt');
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
