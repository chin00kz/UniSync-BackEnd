const User = require('../models/User');

exports.adminAuth = async (req, res, next) => {
    try {
        const adminId = req.headers['x-admin-id'] || req.body.adminId;
        
        if (!adminId) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this route. Missing admin ID.' });
        }

        const adminUser = await User.findById(adminId);
        
        if (!adminUser) {
            return res.status(401).json({ success: false, error: 'Not authorized. Invalid admin ID.' });
        }

        if (adminUser.isBanned) {
            return res.status(403).json({ success: false, error: 'Your account is banned.' });
        }

        if (!['admin', 'superadmin', 'moderator', 'staff', 'student'].includes(adminUser.role)) {
            return res.status(403).json({ success: false, error: 'User role brings insufficient permissions to perform this action.' });
        }

        // Attach admin user to req for later use
        req.admin = adminUser;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, error: 'Server error during authentication' });
    }
};

// Middleware to authorize specific roles after adminAuth
exports.roleAuthorize = (...roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ success: false, error: 'Not authorized. Please authenticate first.' });
        }

        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `Permission Denied: Your role (${req.admin.role}) does not have access to this resource.` 
            });
        }
        next();
    };
};
