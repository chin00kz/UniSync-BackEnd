const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    year: {
        type: String,
        required: [true, 'Please add a year']
    },
    code: {
        type: String,
        required: [true, 'Please add a subject code'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a subject name']
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);
