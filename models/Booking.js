const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    date: {
        type: Date,
        required: [true, 'Please add a booking date']
    },
    timeSlot: {
        type: String,
        required: [true, 'Please select a time slot']
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
