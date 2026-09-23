const express = require('express');
const router = express.Router();
const mosqueController = require('../controllers/mosque.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

// Public route for TV display
router.get('/', mosqueController.getProfile);

// Protected route for Admin
router.put('/', protect, authorizeFeature('canManageProfile'), mosqueController.updateProfile);

module.exports = router;
