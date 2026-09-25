const express = require('express');
const router = express.Router();
const configController = require('../controllers/prayerConfig.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.get('/', configController.getConfig);
router.put('/', protect, authorizeFeature(['canManagePrayerTimes', 'canManageAdzanScreen', 'canManageIqomahScreen', 'canManageSholatScreen']), configController.updateConfig);
router.post('/preview-iqomah', protect, authorizeFeature(['canManageIqomahScreen']), configController.previewIqomah);

module.exports = router;
