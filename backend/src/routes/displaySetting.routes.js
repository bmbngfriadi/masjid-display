const express = require('express');
const router = express.Router();
const displaySettingController = require('../controllers/displaySetting.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

// Public route to get setting for TV
router.get('/', displaySettingController.getDisplaySetting);

// Protected route to update setting
router.put('/', protect, authorizeFeature('canManageLayout'), displaySettingController.updateDisplaySetting);

module.exports = router;
