const Report = require('../models/Report');
const { createLog } = require('./auditLogController');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
    try {
        const reports = await Report.find().populate('reporter', 'name email').populate('reportedUser', 'name email');
        res.status(200).json({ success: true, count: reports.length, data: reports });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
    try {
        const report = await Report.create(req.body);
        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
exports.updateReportStatus = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true
        });

        if (!report) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }

        // Create Audit Log
        await createLog(req.headers['x-admin-id'] || req.body.adminId, 'REPORT_MODERATION', report._id, 'Report', `Status changed to ${req.body.status}`);

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
