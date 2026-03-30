const express = require('express');
const router = express.Router();
const {
    getSettings,
    getSettingByKey,
    updateSetting
} = require('../controllers/systemSettingController');
const { adminAuth } = require('../middlewares/auth');

router.route('/')
    .get(getSettings);

router.route('/:key')
    .get(getSettingByKey)
    .put(adminAuth, updateSetting);

module.exports = router;
