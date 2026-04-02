const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    subjectCode: {
        type: String,
        required: [true, 'Please add a subject code']
    },
    year: {
        type: String,
        required: [true, 'Please add a year']
    },
    rating: {
        type: Number,
        default: 0
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reportReason: {
        type: String,
        default: null
    },
    reportedBy: {
        type: String,
        default: null
    },
    uploadedBy: {
        type: String,
        required: [true, 'Please add an uploader']
    },
    fileName: {
        type: String,
        required: [true, 'Please add a file name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);
