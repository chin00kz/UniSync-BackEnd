const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
exports.getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notes.length, data: notes });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Public
exports.createNote = async (req, res, next) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json({ success: true, data: note });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update note (e.g., for rating or reporting)
// @route   PUT /api/notes/:id
// @access  Public
exports.updateNote = async (req, res, next) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!note) {
            return res.status(404).json({ success: false, error: 'Note not found' });
        }
        res.status(200).json({ success: true, data: note });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Public
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, error: 'Note not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
