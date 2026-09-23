const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

exports.authorizeFeature = (featureNames) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const features = Array.isArray(featureNames) ? featureNames : [featureNames];
      const hasPermission = features.some(feature => user[feature] === true);

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({ 
        message: `Akses ditolak. Anda tidak memiliki izin untuk fitur ini.` 
      });
    } catch (error) {
      console.error('Authorize Feature Error:', error);
      res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
};
