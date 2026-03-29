const express = require('express');
const router = express.Router();
const { getAllSessions, createSession, updateSession } = require('../controllers/sessionController');

router.get('/', getAllSessions);
router.post('/', createSession);
router.patch('/:id', updateSession);

module.exports = router;
