const express = require('express');
const router = express.Router();
const fridayController = require('../controllers/friday.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.get('/', fridayController.getFridayInfo);
router.put('/', protect, authorizeFeature('canManageFridaySchedule'), fridayController.updateFridayInfo);
router.post('/preview', protect, authorizeFeature('canManageFridaySchedule'), fridayController.previewFriday);
router.post('/preview-adzan', protect, authorizeFeature('canManageFridaySchedule'), fridayController.previewAdzanJumat);
router.post('/preview-iqomah', protect, authorizeFeature('canManageFridaySchedule'), fridayController.previewIqomahJumat);

module.exports = router;
