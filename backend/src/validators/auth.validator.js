const { body, validationResult } = require('express-validator');

// Middleware untuk menangkap error dari express-validator
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Kumpulkan pesan error menjadi satu string
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({ message: errorMessages.join(', ') });
  }
  next();
};

exports.registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username tidak boleh kosong')
    .isLength({ min: 3, max: 30 }).withMessage('Username harus antara 3 - 30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh berisi huruf, angka, dan underscore'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email tidak boleh kosong')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password tidak boleh kosong')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }).withMessage('Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka')
];

exports.loginValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username / Email tidak boleh kosong'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password tidak boleh kosong')
];

exports.resetPasswordValidator = [
  body('password')
    .trim()
    .notEmpty().withMessage('Password tidak boleh kosong')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }).withMessage('Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka')
];
