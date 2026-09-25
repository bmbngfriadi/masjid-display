const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/db');
const sendEmail = require('../utils/sendEmail');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email belum diverifikasi. Silakan cek kotak masuk atau folder spam email Anda.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isFirstUser) {
      // First user is automatically verified and has all permissions
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          isVerified: true,
          role: 'SUPER_ADMIN',
          canManageText: true,
          canManageProfile: true,
          canManagePrayerTimes: true,
          canManageFridaySchedule: true,
          canManageAdzanScreen: true,
          canManageIqomahScreen: true,
          canManageSholatScreen: true,
          canManageLayout: true,
          canManageDevices: true,
          canManageUsers: true
        }
      });
      return res.status(201).json({ message: 'Registrasi Admin Utama berhasil! Akun langsung aktif.' });
    } else {
      // Subsequent users must be verified by super admin and start with no permissions
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          isVerified: false,
          role: 'ADMIN',
          canManageText: false,
          canManageProfile: false,
          canManagePrayerTimes: false,
          canManageFridaySchedule: false,
          canManageAdzanScreen: false,
          canManageIqomahScreen: false,
          canManageSholatScreen: false,
          canManageLayout: false,
          canManageDevices: false,
          canManageUsers: false
        }
      });
      return res.status(201).json({ message: 'Pendaftaran berhasil! Akun Anda menunggu verifikasi dan persetujuan dari Super Admin sebelum bisa digunakan.' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const verifyEmailToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        verifyEmailToken,
        verifyEmailExpire: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Email Anda sudah terverifikasi sebelumnya.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true
        // Kita tidak men-null-kan token agar aman dari React StrictMode double-fetch
        // atau jika user double-click link di email.
      }
    });

    res.status(200).json({ message: 'Email berhasil diverifikasi.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetPasswordExpire }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/masjid/admin/reset-password/${resetToken}`;

    const message = `Anda menerima email ini karena Anda (atau orang lain) meminta pengaturan ulang kata sandi (reset password) untuk akun Admin Masjid Anda.\n\nSilakan klik tautan berikut untuk membuat kata sandi baru:\n\n${resetUrl}\n\nJika Anda tidak memintanya, abaikan email ini dan kata sandi Anda tidak akan berubah.`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <h2 style="color: #047857; text-align: center; margin-bottom: 24px;">Reset Kata Sandi</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Anda menerima email ini karena Anda (atau orang lain) meminta pengaturan ulang kata sandi (reset password) untuk akun Admin Masjid Anda.</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background-color: #047857; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; border: 2px solid #047857;">Ubah Kata Sandi Sekarang</a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">Jika tombol di atas tidak merespons, Anda juga dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
        <p style="color: #0ea5e9; font-size: 14px; word-break: break-all; text-align: center; margin-bottom: 24px;"><a href="${resetUrl}" style="color: #0ea5e9;">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.5;">Tautan ini akan kedaluwarsa dalam 10 menit.<br>Jika Anda tidak memintanya, abaikan email ini dan kata sandi Anda tidak akan berubah.</p>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">&copy; ${new Date().getFullYear()} Takmir Masjid Baitul Jannah</p>
      </div>
    `;

    // FALLBACK: Log the reset URL to the console so admins can reset password even if SMTP fails
    console.log(`\n======================================================`);
    console.log(`🔑 PASSWORD RESET REQUESTED FOR: ${email}`);
    console.log(`🔗 RESET LINK: ${resetUrl}`);
    console.log(`======================================================\n`);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Password - Masjid Baitul Jannah',
        message,
        html: htmlMessage
      });
      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error('Email error:', err);
      // Don't nullify the token if email fails, so the admin can still use the console link!
      res.status(200).json({ message: 'Permintaan reset berhasil dibuat, namun gagal mengirim email. Jika Anda admin server, silakan cek log VPS (pm2 logs) untuk mendapatkan link reset.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: user.password,
        resetPasswordToken: null,
        resetPasswordExpire: null
      }
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during reset password' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // exclude password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
