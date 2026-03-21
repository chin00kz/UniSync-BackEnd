const express = require('express');
const router = express.Router();
const { getReports, createReport, updateReportStatus } = require('../controllers/reportController');

router.get('/', getReports);
router.post('/', createReport);
router.put('/:id', updateReportStatus);

module.exports = router;
