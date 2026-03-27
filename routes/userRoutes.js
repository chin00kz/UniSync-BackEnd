const express = require('express');
const router = express.Router();
const { getUsers, createUser, loginUser, getDashboardStats, updateUserRole, banUser, unbanUser, deleteUser, getMe, updateMe, getTutors } = require('../controllers/userController');
const { adminAuth } = require('../middlewares/auth');

router.get('/', adminAuth, getUsers);
router.get('/stats', adminAuth, getDashboardStats);
router.post('/', adminAuth, createUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/:id/role', adminAuth, updateUserRole);
router.put('/:id/ban', adminAuth, banUser);
router.put('/:id/unban', adminAuth, unbanUser);
router.get('/tutors', getTutors);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
