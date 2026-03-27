const User = require('../models/User');
const { createLog } = require('./auditLogController');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Check for user
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if user is banned
        if (user.isBanned) {
            return res.status(403).json({ success: false, error: 'Your account has been banned. ' + (user.banReason || 'Please contact administration.') });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Create Audit Log for Login
        await createLog(user._id, 'LOGIN', user._id, 'User', 'Administrator logged into the portal');

        res.status(200).json({ success: true, message: 'Logged in successfully', id: user._id, role: user.role, name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
    try {
        const actorId = req.headers['x-admin-id'] || req.body.adminId;
        const actor = await User.findById(actorId);
        
        if (!actor) {
            return res.status(403).json({ success: false, error: 'Unauthorized: Admin ID required' });
        }

        const allowedRolesForAdmin = ['admin', 'student', 'staff'];
        const allowedRolesForSuperAdmin = ['superadmin', 'admin', 'moderator', 'student', 'staff', 'user'];

        if (actor.role === 'superadmin') {
            // SuperAdmin can assign any role
            if (!allowedRolesForSuperAdmin.includes(req.body.role)) {
                return res.status(400).json({ success: false, error: 'Invalid role' });
            }
        } else if (actor.role === 'admin') {
            // Admin can only assign admin, student, staff
            if (!allowedRolesForAdmin.includes(req.body.role)) {
                return res.status(403).json({ success: false, error: 'Regular admins can only assign Admin, Student, or Staff roles' });
            }
        } else {
            return res.status(403).json({ success: false, error: 'Unauthorized role assignment' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Create Audit Log
        await createLog(req.headers['x-admin-id'] || req.body.adminId, 'ROLE_CHANGE', user._id, 'User', `Changed role to ${req.body.role}`);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Ban user
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
exports.banUser = async (req, res, next) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (targetUser.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Superadmins cannot be banned' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { 
            isBanned: true, 
            banReason: req.body.reason 
        }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Create Audit Log
        await createLog(req.headers['x-admin-id'] || req.body.adminId, 'BAN_USER', user._id, 'User', `Reason: ${req.body.reason}`);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Unban user
// @route   PUT /api/users/:id/unban
// @access  Private/Admin
exports.unbanUser = async (req, res, next) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (targetUser.role === 'superadmin') {
            return res.status(403).json({ success: false, error: 'Superadmins cannot be banned/unbanned' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { 
            isBanned: false, 
            banReason: null 
        }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Create Audit Log
        await createLog(req.headers['x-admin-id'] || req.body.adminId, 'UNBAN_USER', user._id, 'User', 'Ban lifted');

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        
        // Mock data for reports since we don't have many yet
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAdmins,
                bannedUsers,
                pendingReports: 0, // Will update once Report model is used
                recentActivity: []
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (targetUser.role === 'superadmin') {
            const adminId = req.headers['x-admin-id'] || req.body.adminId;
            const admin = await User.findById(adminId);
            if (!admin || admin.role !== 'superadmin') {
                return res.status(403).json({ success: false, error: 'Only superadmins can delete other superadmins' });
            }
        }

        const user = await User.findByIdAndDelete(req.params.id);

        // Create Audit Log
        await createLog(req.headers['x-admin-id'] || req.body.adminId, 'DELETE_USER', req.params.id, 'User', `Deleted user: ${user.name} (${user.email})`);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const userId = req.headers['x-admin-id'];
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res, next) => {
    try {
        const userId = req.headers['x-admin-id'];
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID required' });
        }
        
        // Fields to update
        const { name, phone } = req.body;
        
        const user = await User.findByIdAndUpdate(userId, { name, phone }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Create Audit Log for Profile Update
        await createLog(userId, 'PROFILE_UPDATE', userId, 'User', 'Updated personal profile details');

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
