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
const sanitizeValue = (val) => {
  if (!val) return null;
  let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  // Hapus pola gambar base64 agar tidak menuh-menuhin log
  str = str.replace(/data:image\/[a-zA-Z]*;base64,[^"]+/g, '"[BASE64_IMAGE_REMOVED]"');
  // Potong jika masih terlalu panjang
  if (str.length > 2000) {
    return str.substring(0, 2000) + '... [TRUNCATED]';
  }
  return str;
};

const logAction = async ({ userId, action, entity, entityId, oldValue, newValue, ip }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        oldValue: sanitizeValue(oldValue),
        newValue: sanitizeValue(newValue),
        ip
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = { logAction };
