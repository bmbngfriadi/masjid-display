const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerValidator, loginValidator, resetPasswordValidator, validate } = require('../validators/auth.validator');
const rateLimit = require('express-rate-limit');

// Strict Rate Limiter for Login/Register (Maks 10 percobaan dalam 15 menit)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan login/registrasi dari IP ini. Silakan coba lagi nanti.'
});

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/me', protect, authController.me);

module.exports = router;
