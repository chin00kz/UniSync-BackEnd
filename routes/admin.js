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
const { adminAuth } = require('../middlewares/auth');

// All Admin routes should be protected by adminAuth
router.use(adminAuth);

// Admin Dashboard & Stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id/ban', toggleUserBan);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Moderation & Reports
router.get('/reports', getAllReports);
router.post('/reports/:id/action', handleReportAction);

module.exports = router;
