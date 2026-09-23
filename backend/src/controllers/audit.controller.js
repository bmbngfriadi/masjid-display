const prisma = require('../config/db');

exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Allow filtering by entity or action
    const where = {};
    if (req.query.entity) where.entity = req.query.entity;
    if (req.query.action) where.action = req.query.action;
    
    // Fetch logs with pagination, include user info
    const logs = await prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    // To attach username without complex relation mapping (since userId is a string field, not a strict relation in schema), 
    // we fetch user details manually for those userIds
    const userIds = [...new Set(logs.map(log => log.userId).filter(Boolean))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, role: true }
    });
    
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    
    const enrichedLogs = logs.map(log => ({
      ...log,
      user: log.userId ? userMap[log.userId] : null
    }));
    
    const total = await prisma.auditLog.count({ where });

    res.json({
      data: enrichedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};
