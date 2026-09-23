const prisma = require('../config/db');
const { logAction } = require('../utils/auditLogger');

exports.getRunningTexts = async (req, res) => {
  try {
    const texts = await prisma.runningText.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(texts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching running texts' });
  }
};

exports.createRunningText = async (req, res) => {
  try {
    const { text, isActive } = req.body;
    const newText = await prisma.runningText.create({
      data: { text, isActive: isActive !== undefined ? isActive : true }
    });
    
    await logAction({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'RunningText',
      entityId: newText.id,
      newValue: newText,
      ip: req.ip
    });

    const io = req.app.get('io');
    if (io) io.to('devices').emit('content:updated', { type: 'RUNNING_TEXT' });
    
    res.status(201).json(newText);
  } catch (error) {
    res.status(500).json({ message: 'Error creating running text' });
  }
};

exports.updateRunningText = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isActive } = req.body;
    
    const oldText = await prisma.runningText.findUnique({ where: { id } });
    const updated = await prisma.runningText.update({
      where: { id },
      data: { text, isActive }
    });

    await logAction({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'RunningText',
      entityId: id,
      oldValue: oldText,
      newValue: updated,
      ip: req.ip
    });

    const io = req.app.get('io');
    if (io) io.to('devices').emit('content:updated', { type: 'RUNNING_TEXT' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating running text' });
  }
};

exports.deleteRunningText = async (req, res) => {
  try {
    const { id } = req.params;
    const oldText = await prisma.runningText.findUnique({ where: { id } });
    await prisma.runningText.delete({ where: { id } });

    await logAction({
      userId: req.user.id,
      action: 'DELETE',
      entity: 'RunningText',
      entityId: id,
      oldValue: oldText,
      ip: req.ip
    });

    const io = req.app.get('io');
    if (io) io.to('devices').emit('content:updated', { type: 'RUNNING_TEXT' });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting running text' });
  }
};
