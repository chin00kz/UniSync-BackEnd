const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public',
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 10,
  },
  privateCode: {
    type: String,
    default: null,
  },
  ownerId: {
    type: String, // Storing as String for now to match the frontend currentUserObj.id logic
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lobby', LobbySchema);
