const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find().populate('adminId', 'name email').sort('-timestamp');
        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get audit logs for a specific admin
// @route   GET /api/audit-logs/me
// @access  Private/Admin
exports.getAdminLogs = async (req, res, next) => {
    try {
        const adminId = req.headers['x-admin-id'];
        if (!adminId) {
            return res.status(400).json({ success: false, error: 'Admin ID required' });
        }
        const logs = await AuditLog.find({ adminId }).sort('-timestamp').limit(10);
        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Helper function to create an audit log
exports.createLog = async (adminId, action, targetId, targetModel, details) => {
    try {
        await AuditLog.create({
            adminId,
            action,
            targetId,
            targetModel,
            details
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};
