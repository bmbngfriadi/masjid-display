const prisma = require('../config/db');
const { logAction } = require('../utils/auditLogger');

exports.getProfile = async (req, res) => {
  try {
    let mosque = await prisma.mosque.findFirst();
    
    // Auto-create default mosque if none exists
    if (!mosque) {
      mosque = await prisma.mosque.create({
        data: {
          name: 'Masjid Baitul Jannah',
          address: 'Batam, Kepulauan Riau',
          logoUrl: '/logos/default.svg' // We will use a default or empty
        }
      });
    }
    
    res.json(mosque);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mosque profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, logoUrl } = req.body;
    let mosque = await prisma.mosque.findFirst();
    let oldData = null;
    
    if (mosque) {
      oldData = { ...mosque };
      mosque = await prisma.mosque.update({
        where: { id: mosque.id },
        data: { name, address, logoUrl }
      });
    } else {
      mosque = await prisma.mosque.create({
        data: { name, address, logoUrl }
      });
    }

    // Log the action
    await logAction({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'Mosque',
      entityId: mosque.id,
      oldValue: oldData,
      newValue: mosque,
      ip: req.ip
    });
    
    const io = req.app.get('io');
    if (io) {
      io.to('devices').emit('content:updated', { type: 'MOSQUE_PROFILE' });
    }
    
    res.json(mosque);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mosque profile' });
  }
};
