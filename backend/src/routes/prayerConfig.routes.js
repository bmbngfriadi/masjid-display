const express = require('express');
const router = express.Router();
const configController = require('../controllers/prayerConfig.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.get('/', configController.getConfig);
router.put('/', protect, authorizeFeature(['canManagePrayerTimes', 'canManageAdzanScreen', 'canManageIqomahScreen', 'canManageSholatScreen', 'canManageFridaySchedule']), configController.updateConfig);
router.post('/preview-iqomah', protect, authorizeFeature(['canManageIqomahScreen']), configController.previewIqomah);
router.post('/preview-iqomah-alarm', protect, authorizeFeature(['canManageIqomahScreen']), configController.previewIqomahAlarm);
router.post('/preview-adzan', protect, authorizeFeature(['canManageAdzanScreen']), configController.previewAdzan);
router.post('/preview-adzan-alarm', protect, authorizeFeature(['canManageAdzanScreen']), configController.previewAdzanAlarm);
router.post('/preview-sholat', protect, authorizeFeature(['canManageSholatScreen']), configController.previewSholat);
router.post('/preview-full-flow', protect, configController.previewFullFlow);

module.exports = router;
