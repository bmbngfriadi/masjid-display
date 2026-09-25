const prisma = require('../config/db');
const crypto = require('crypto');

const pendingAutoRepairs = {};

exports.registerDevice = async (req, res) => {
  try {
    // Generate 6 digit pairing code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    let device;

    if (pendingAutoRepairs[ip]) {
      const { oldName } = pendingAutoRepairs[ip];
      delete pendingAutoRepairs[ip];
      const token = crypto.randomBytes(32).toString('hex');
      
      device = await prisma.device.create({
        data: {
          name: oldName || 'TV Masjid',
          pairingCode: code,
          pairingCodeExpiresAt: expiresAt,
          token,
          status: 'ONLINE',
          ip
        }
      });

      const io = req.app.get('io');
      setTimeout(() => {
        if (io) io.to(device.id).emit('device:paired', { token });
      }, 3000);

    } else {
      device = await prisma.device.create({
        data: {
          name: 'New TV Device',
          pairingCode: code,
          pairingCodeExpiresAt: expiresAt,
          ip
        }
      });
    }

    res.json({
      deviceId: device.id,
      code,
      expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering device' });
  }
};

exports.pairDevice = async (req, res) => {
  try {
    const { code, mosqueId } = req.body;
    
    const device = await prisma.device.findUnique({
      where: { pairingCode: code }
    });

    if (!device) {
      return res.status(404).json({ message: 'Invalid pairing code' });
    }

    if (device.pairingCodeExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Pairing code expired' });
    }

    // Generate permanent token
    const token = crypto.randomBytes(32).toString('hex');

    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: {
        pairingCode: null,
        pairingCodeExpiresAt: null,
        token: token,
        mosqueId: mosqueId || undefined
      }
    });

    // We should emit a socket event to the device here
    const io = req.app.get('io');
    if (io) {
      io.to(device.id).emit('device:paired', { token, mosqueId });
    }

    res.json({ message: 'Device paired successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error pairing device' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    // Only return devices that have been paired (have a token)
    const devices = await prisma.device.findMany({
      where: {
        token: { not: null }
      }
    });
    // determine if online based on lastSeen (e.g. < 2 mins ago)
    const devicesWithStatus = devices.map(d => ({
      ...d,
      status: (d.lastSeen && new Date(Date.now() - 120000) < d.lastSeen) ? 'ONLINE' : 'OFFLINE'
    }));
    res.json(devicesWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices' });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const device = await prisma.device.update({
      where: { id },
      data: { name }
    });
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device' });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.device.delete({ where: { id } });
    
    // Tell the specific TV to unpair and go back to pairing screen
    const io = req.app.get('io');
    if (io) {
      io.to(id).emit('device:unpaired');
    }

    res.json({ message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device' });
  }
};

exports.checkPairing = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    if (device.token && !device.pairingCode) {
      res.json({ isPaired: true, token: device.token });
    } else {
      res.json({ isPaired: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking pairing status' });
  }
};

exports.refreshDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    const io = req.app.get('io');
    if (io) {
      // 1. Emit refresh command for NEW TVs
      io.to(id).emit('device:refresh');
      
      // 2. Fallback for LEGACY TVs: mark for auto-repair, then unpair to force reload
      if (device.ip) {
        pendingAutoRepairs[device.ip] = { oldName: device.name };
        setTimeout(() => { delete pendingAutoRepairs[device.ip]; }, 60000); // 1 min expiry
        io.to(id).emit('device:unpaired');
        
        // Delete old device record since a new one will be created upon auto-repair
        await prisma.device.delete({ where: { id } }).catch(() => {});
      }
    }
    
    res.json({ message: 'Refresh command sent to device' });
  } catch (error) {
    console.error('Error refreshing device:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
