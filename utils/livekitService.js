const { AccessToken } = require('livekit-server-sdk');

/**
 * Generates a LiveKit Access Token for a participant to join a room.
 * @param {string} roomName - The name/ID of the lobby/room.
 * @param {string} participantName - The display name of the user.
 * @returns {Promise<string>} - The signed JWT token.
 */
const generateLiveKitToken = async (roomName, participantName) => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API key or secret not found in environment variables.');
  }

  // Define the participant's identity and metadata
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
  });

  // Grant permissions for the room
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
};

module.exports = {
  generateLiveKitToken,
};
