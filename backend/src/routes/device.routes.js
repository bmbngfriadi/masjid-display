const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');
const prisma = require('../config/db');
const crypto = require('crypto');

router.get('/force-pair', async (req, res) => {
  const device = await prisma.device.findFirst({ where: { pairingCode: { not: null } }, orderBy: { createdAt: 'desc' } });
  if (device) {
      const token = crypto.randomBytes(32).toString('hex');
      await prisma.device.update({ where: { id: device.id }, data: { token, pairingCode: null, lastConnectionStatus: true, name: 'TV Masjid (Auto Recovered)' } });
      const io = req.app.get('io');
      if (io) io.to(device.id).emit('device:paired', { token });
      res.json({ success: true, message: 'TV has been force paired!' });
  } else {
      res.json({ success: false, message: 'No waiting TV found' });
  }
});

router.post('/register', deviceController.registerDevice);
router.get('/check-pairing/:id', deviceController.checkPairing);
router.post('/pair', protect, authorizeFeature('canManageDevices'), deviceController.pairDevice);
router.get('/', protect, authorizeFeature('canManageDevices'), deviceController.getDevices);
router.put('/:id', protect, authorizeFeature('canManageDevices'), deviceController.updateDevice);
router.post('/:id/refresh', protect, authorizeFeature('canManageDevices'), deviceController.refreshDevice);
router.delete('/:id', protect, authorizeFeature('canManageDevices'), deviceController.deleteDevice);

module.exports = router;
