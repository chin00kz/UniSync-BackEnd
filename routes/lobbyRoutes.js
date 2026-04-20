const express = require('express');
const router = express.Router();
const { getAllLobbies, createLobby, deleteLobby, updateLobby } = require('../controllers/lobbyController');

router.get('/', getAllLobbies);
router.post('/', createLobby);
router.put('/:id', updateLobby);
router.delete('/:id', deleteLobby);

module.exports = router;
