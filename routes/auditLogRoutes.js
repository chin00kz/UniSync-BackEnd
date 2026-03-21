const express = require('express');
const router = express.Router();
const { getAuditLogs, getAdminLogs } = require('../controllers/auditLogController');

router.get('/', getAuditLogs);
router.get('/me', getAdminLogs);

module.exports = router;
