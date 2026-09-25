const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

router.post('/register', deviceController.registerDevice);
router.get('/check-pairing/:id', deviceController.checkPairing);
router.post('/pair', protect, authorizeFeature('canManageDevices'), deviceController.pairDevice);
router.get('/', protect, authorizeFeature('canManageDevices'), deviceController.getDevices);
router.put('/:id', protect, authorizeFeature('canManageDevices'), deviceController.updateDevice);
router.post('/:id/refresh', protect, authorizeFeature('canManageDevices'), deviceController.refreshDevice);
router.delete('/:id', protect, authorizeFeature('canManageDevices'), deviceController.deleteDevice);

module.exports = router;
