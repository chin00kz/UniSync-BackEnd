const express = require('express');
const router = express.Router();
const { getAllSessions, createSession, updateSession } = require('../controllers/sessionController');
const { generateLiveKitToken } = require('../utils/livekitService');

// LiveKit Token Generation Route
router.get('/token', async (req, res) => {
  const { roomName, participantName } = req.query;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'roomName and participantName are required' });
  }

  try {
    const token = await generateLiveKitToken(roomName, participantName);
    res.json({ token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

router.get('/', getAllSessions);
router.post('/', createSession);
router.patch('/:id', updateSession);

module.exports = router;

