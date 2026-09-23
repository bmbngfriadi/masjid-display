const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

// Only allow users with canManageLogs permission or SUPER_ADMIN
router.get('/', protect, authorizeFeature('canManageLogs'), auditController.getAuditLogs);

module.exports = router;
