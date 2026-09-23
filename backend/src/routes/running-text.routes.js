const express = require('express');
const router = express.Router();
const runningTextController = require('../controllers/running-text.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.get('/', runningTextController.getRunningTexts);
router.post('/', protect, authorizeFeature('canManageText'), runningTextController.createRunningText);
router.put('/:id', protect, authorizeFeature('canManageText'), runningTextController.updateRunningText);
router.delete('/:id', protect, authorizeFeature('canManageText'), runningTextController.deleteRunningText);

module.exports = router;
