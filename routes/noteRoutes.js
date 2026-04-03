const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Default: store in memory
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

router.route('/')
    .get(getNotes)
    .post(upload.single('file'), createNote); // Use multer for file upload


// Download note file by ID
const { downloadNoteFile } = require('../controllers/noteController');
router.get('/:id/download', downloadNoteFile);

router.route('/:id')
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
