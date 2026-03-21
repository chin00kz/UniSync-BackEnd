const express = require('express');
const router = express.Router();
const { getUsers, createUser, loginUser, getDashboardStats, updateUserRole, banUser, unbanUser, deleteUser, getMe, updateMe } = require('../controllers/userController');

router.get('/', getUsers);
router.get('/stats', getDashboardStats);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/:id/role', updateUserRole);
router.put('/:id/ban', banUser);
router.put('/:id/unban', unbanUser);
router.delete('/:id', deleteUser);

module.exports = router;
