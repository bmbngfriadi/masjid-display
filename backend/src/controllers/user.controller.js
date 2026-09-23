const prisma = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        canManageDevices: true,
        canManageText: true,
        canManageProfile: true,
        canManageUsers: true,
        canManagePrayerTimes: true,
        canManageFridaySchedule: true,
        canManageAdzanScreen: true,
        canManageIqomahScreen: true,
        canManageSholatScreen: true,
        canManageLayout: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { 
      username, email, password, role,
      canManageDevices, canManageText, canManageProfile, canManageUsers,
      canManagePrayerTimes, canManageFridaySchedule, canManageAdzanScreen,
      canManageIqomahScreen, canManageSholatScreen, canManageLayout
    } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username atau Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'ADMIN',
        canManageDevices: canManageDevices ?? true,
        canManageText: canManageText ?? true,
        canManageProfile: canManageProfile ?? true,
        canManageUsers: canManageUsers ?? false,
        canManagePrayerTimes: canManagePrayerTimes ?? true,
        canManageFridaySchedule: canManageFridaySchedule ?? true,
        canManageAdzanScreen: canManageAdzanScreen ?? true,
        canManageIqomahScreen: canManageIqomahScreen ?? true,
        canManageSholatScreen: canManageSholatScreen ?? true,
        canManageLayout: canManageLayout ?? true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Gagal membuat pengguna baru' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      username, email, password, role,
      canManageDevices, canManageText, canManageProfile, canManageUsers,
      canManagePrayerTimes, canManageFridaySchedule, canManageAdzanScreen,
      canManageIqomahScreen, canManageSholatScreen, canManageLayout
    } = req.body;

    const updateData = {
      username,
      email,
      role,
      canManageDevices,
      canManageText,
      canManageProfile,
      canManageUsers,
      canManagePrayerTimes,
      canManageFridaySchedule,
      canManageAdzanScreen,
      canManageIqomahScreen,
      canManageSholatScreen,
      canManageLayout
    };

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        canManageDevices: true,
        canManageText: true,
        canManageProfile: true,
        canManageUsers: true,
        canManagePrayerTimes: true,
        canManageFridaySchedule: true,
        canManageAdzanScreen: true,
        canManageIqomahScreen: true,
        canManageSholatScreen: true,
        canManageLayout: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Gagal memperbarui pengguna' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting oneself if needed, but for simplicity let's just delete
    if (req.user.id === id) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun Anda sendiri' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Gagal menghapus pengguna' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        canManageDevices: true,
        canManageText: true,
        canManageProfile: true,
        canManageUsers: true,
        canManagePrayerTimes: true,
        canManageFridaySchedule: true,
        canManageAdzanScreen: true,
        canManageIqomahScreen: true,
        canManageSholatScreen: true,
        canManageLayout: true
      }
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};
