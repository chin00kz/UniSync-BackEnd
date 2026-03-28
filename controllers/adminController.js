const User = require('../models/User');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');

// @desc    Get comprehensive Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const studentCount = await User.countDocuments({ role: 'student' });
        const tutorCount = await User.countDocuments({ role: 'staff' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        const bannedCount = await User.countDocuments({ isBanned: true });
        
        // Real counts for reports
        const pendingReports = await Report.countDocuments({ status: 'pending' });
        const resolvedReports = await Report.countDocuments({ status: 'resolved' });

        // Get recent activity from AuditLog
        const recentActivity = await AuditLog.find()
            .sort({ timestamp: -1 })
            .limit(5)
            .populate('adminId', 'name role');

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    total: totalUsers,
                    students: studentCount,
                    tutors: tutorCount,
                    admins: adminCount,
                    banned: bannedCount
                },
                reports: {
                    pending: pendingReports,
                    resolved: resolvedReports
                },
                recentActivity: recentActivity.map(log => ({
                    id: log._id,
                    user: log.adminId ? log.adminId.name : 'System',
                    role: log.adminId ? log.adminId.role : 'system',
                    action: log.action,
                    description: log.details?.message || log.action || 'No description',
                    time: log.timestamp
                }))
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all users for Admin management
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Ban or Unban a user
// @route   PUT /api/admin/users/:id/ban
exports.toggleUserBan = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Superadmins cannot be banned' });
        }

        user.isBanned = !user.isBanned;
        user.banReason = user.isBanned ? (req.body.reason || 'No reason provided') : null;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update a user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, {
            new: true,
            runValidators: true
        });
        
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create a new user (via Admin)
// @route   POST /api/admin/users
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all reports for Admin moderation
// @route   GET /api/admin/reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email sliitId avatar')
            .populate('reportedUser', 'name email sliitId avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: reports.length, data: reports });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Take action on a report
// @route   POST /api/admin/reports/:id/action
exports.handleReportAction = async (req, res) => {
    try {
        const { action, banReason } = req.body; // 'discard', 'resolve', 'ban'
        const report = await Report.findById(req.params.id);
        
        if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

        if (action === 'discard') {
            report.status = 'dismissed';
        } else {
            report.status = 'resolved';
            
            // If action is ban, handle the user ban
            if (action === 'ban' && report.reportedUser) {
                const user = await User.findById(report.reportedUser);
                if (user && user.role !== 'superadmin') {
                    user.isBanned = true;
                    user.banReason = banReason || `Banned due to report: ${report.reason}`;
                    await user.save();
                }
            }
        }

        await report.save();
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

