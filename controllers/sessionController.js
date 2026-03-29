const Session = require('../models/Session');
const User = require('../models/User');

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort('-createdAt');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSession = async (req, res) => {
    try {
        const { studentName, questionText, questionImage } = req.body;
        const user = await User.findOne({ name: studentName });
        const session = await Session.create({
            studentId: user ? user._id : null,
            studentName,
            questionText,
            questionImage
        });
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const { status, replyText, replyImage } = req.body;
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { status, replyText, replyImage },
            { new: true, runValidators: true }
        );
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
