const SystemSetting = require('../models/SystemSetting');
const { createLog } = require('./auditLogController');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await SystemSetting.find();
        
        // Convert array to an object map for easier consumption on frontend
        const settingsMap = {};
        settings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
        });

        res.status(200).json({ success: true, data: settingsMap });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get a single setting by key
// @route   GET /api/settings/:key
// @access  Public
exports.getSettingByKey = async (req, res, next) => {
    try {
        const setting = await SystemSetting.findOne({ key: req.params.key });
        
        if (!setting) {
            return res.status(404).json({ success: false, error: 'Setting not found' });
        }

        res.status(200).json({ success: true, data: setting.value });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create or update a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
exports.updateSetting = async (req, res, next) => {
    try {
        const key = req.params.key;
        const { value, description } = req.body;
        const adminId = req.headers['x-admin-id'] || req.body.adminId;

        if (value === undefined) {
            return res.status(400).json({ success: false, error: 'Value is required' });
        }

        let setting = await SystemSetting.findOne({ key });

        if (setting) {
            setting.value = value;
            if (description !== undefined) setting.description = description;
            await setting.save();
        } else {
            setting = await SystemSetting.create({
                key,
                value,
                description: description || `Created setting ${key}`
            });
        }

        // Create Audit Log
        if (adminId) {
            await createLog(adminId, 'SETTING_UPDATE', setting._id, 'SystemSetting', `Updated ${key} to ${value}`);
        }

        res.status(200).json({ success: true, data: setting });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
