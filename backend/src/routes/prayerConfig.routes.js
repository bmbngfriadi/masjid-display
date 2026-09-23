const express = require('express');
const router = express.Router();
const configController = require('../controllers/prayerConfig.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.get('/', configController.getConfig);
router.put('/', protect, authorizeFeature(['canManagePrayerTimes', 'canManageAdzanScreen', 'canManageIqomahScreen', 'canManageSholatScreen']), configController.updateConfig);

module.exports = router;
