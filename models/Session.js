const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String, required: true },
  questionText: { type: String, required: true },
  questionImage: { type: String, default: "" }, 
  replyText: { type: String, default: "" },
  replyImage: { type: String, default: "" },
  status: { type: String, default: 'Not Started' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
