const prisma = require('../config/db');

/**
 * Logs an action to the AuditLog table
 * @param {Object} params
 * @param {String} params.userId - The ID of the user performing the action (from req.user.id)
 * @param {String} params.action - The action being performed (e.g., 'UPDATE', 'CREATE', 'DELETE')
 * @param {String} params.entity - The entity being affected (e.g., 'Mosque', 'PrayerTimeConfig', 'RunningText')
 * @param {String} [params.entityId] - The ID of the specific entity (optional)
 * @param {String|Object} [params.oldValue] - The previous state of the entity (optional)
 * @param {String|Object} [params.newValue] - The new state of the entity (optional)
 * @param {String} [params.ip] - The IP address of the user (from req.ip)
 */
const logAction = async ({ userId, action, entity, entityId, oldValue, newValue, ip }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        oldValue: oldValue ? (typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue) : null,
        newValue: newValue ? (typeof newValue === 'object' ? JSON.stringify(newValue) : newValue) : null,
        ip
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = { logAction };
