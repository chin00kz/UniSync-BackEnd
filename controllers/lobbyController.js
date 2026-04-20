const Lobby = require('../models/Lobby');

// @desc    Get all lobbies
// @route   GET /api/lobbies
exports.getAllLobbies = async (req, res) => {
  try {
    const lobbies = await Lobby.find().sort('-createdAt');
    res.status(200).json({ success: true, count: lobbies.length, data: lobbies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create a new lobby
// @route   POST /api/lobbies
exports.createLobby = async (req, res) => {
  try {
    const { name, type, maxParticipants, privateCode, ownerId, ownerName } = req.body;
    
    const lobby = await Lobby.create({
      name,
      type,
      maxParticipants,
      privateCode,
      ownerId,
      ownerName
    });

    res.status(201).json({ success: true, data: lobby });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete a lobby
// @route   DELETE /api/lobbies/:id
exports.deleteLobby = async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id);

    if (!lobby) {
      return res.status(404).json({ success: false, error: 'Lobby not found' });
    }

    // Optional: Add check for ownerId here if needed
    // if (lobby.ownerId !== req.headers['x-user-id']) { ... }

    await lobby.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update a lobby
// @route   PUT /api/lobbies/:id
exports.updateLobby = async (req, res) => {
  try {
    const { name, type, maxParticipants } = req.body;
    let lobby = await Lobby.findById(req.params.id);

    if (!lobby) {
      return res.status(404).json({ success: false, error: 'Lobby not found' });
    }

    // Handle invite code generation if switching to Private
    let privateCode = lobby.privateCode;
    if (type === 'Private' && lobby.type !== 'Private' && !privateCode) {
      privateCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } else if (type === 'Public') {
      privateCode = null;
    }

    lobby = await Lobby.findByIdAndUpdate(
      req.params.id,
      { name, type, maxParticipants, privateCode },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: lobby });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
