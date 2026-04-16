const express = require('express');
const router = express.Router();
const { 
    getAdminStats, 
    getAllUsers, 
    toggleUserBan, 
    updateUserRole, 
    createUser, 
    deleteUser, 
    getAllReports, 
    handleReportAction 
} = require('../controllers/adminController');
const { adminAuth, roleAuthorize } = require('../middlewares/auth');

// All Admin routes should be protected by adminAuth
router.use(adminAuth);

// Admin Dashboard & Stats
router.get('/stats', getAdminStats);

// User Management - Restricted to Admin/SuperAdmin
router.get('/users', roleAuthorize('admin', 'superadmin'), getAllUsers);
router.post('/users', roleAuthorize('admin', 'superadmin'), createUser);
router.put('/users/:id/ban', roleAuthorize('admin', 'superadmin'), toggleUserBan);
router.put('/users/:id/role', roleAuthorize('admin', 'superadmin'), updateUserRole);
router.delete('/users/:id', roleAuthorize('admin', 'superadmin'), deleteUser);

// Moderation & Reports - Restricted to Admin/SuperAdmin
router.get('/reports', roleAuthorize('admin', 'superadmin'), getAllReports);
router.post('/reports/:id/action', roleAuthorize('admin', 'superadmin'), handleReportAction);

module.exports = router;
