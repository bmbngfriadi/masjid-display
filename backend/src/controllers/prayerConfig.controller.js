const prisma = require('../config/db');
const { logAction } = require('../utils/auditLogger');

// Inisialisasi atau dapatkan config (karena kita hanya butuh 1 config global)
const getOrCreateConfig = async () => {
  let config = await prisma.prayerTimeConfig.findFirst();
  if (!config) {
    config = await prisma.prayerTimeConfig.create({
      data: {} // Gunakan default dari schema
    });
  }
  return config;
};

exports.getConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    const oldData = { ...config };
    
    // Extract fields
    const { 
      latitude, longitude, cityId, calculationMethod,
      fajrOffset, dhuhrOffset, asrOffset, maghribOffset, ishaOffset,
      fajrIqamah, dhuhrIqamah, asrIqamah, maghribIqamah, ishaIqamah,
      jumatMode, jumatTimeStart, jumatTimeEnd, jumatRunningTextEnabled, ramadanMode, alarmSound,
      adzanDuration,
      adzanBackground,
      adzanBackgroundUrl,
      adzanAudio,
      iqomahBackground,
      iqomahBackgroundUrl,
      iqomahMessage,
      sholatDuration,
      sholatScreenMessage,
      sholatBackgroundUrl
    } = req.body;

    const updated = await prisma.prayerTimeConfig.update({
      where: { id: config.id },
      data: {
        latitude: latitude !== undefined ? parseFloat(latitude) : config.latitude,
        longitude: longitude !== undefined ? parseFloat(longitude) : config.longitude,
        cityId: cityId || config.cityId,
        calculationMethod: calculationMethod || config.calculationMethod,
        
        fajrOffset: fajrOffset !== undefined ? parseInt(fajrOffset) : config.fajrOffset,
        dhuhrOffset: dhuhrOffset !== undefined ? parseInt(dhuhrOffset) : config.dhuhrOffset,
        asrOffset: asrOffset !== undefined ? parseInt(asrOffset) : config.asrOffset,
        maghribOffset: maghribOffset !== undefined ? parseInt(maghribOffset) : config.maghribOffset,
        ishaOffset: ishaOffset !== undefined ? parseInt(ishaOffset) : config.ishaOffset,
        
        fajrIqamah: fajrIqamah !== undefined ? parseInt(fajrIqamah) : config.fajrIqamah,
        dhuhrIqamah: dhuhrIqamah !== undefined ? parseInt(dhuhrIqamah) : config.dhuhrIqamah,
        asrIqamah: asrIqamah !== undefined ? parseInt(asrIqamah) : config.asrIqamah,
        maghribIqamah: maghribIqamah !== undefined ? parseInt(maghribIqamah) : config.maghribIqamah,
        ishaIqamah: ishaIqamah !== undefined ? parseInt(ishaIqamah) : config.ishaIqamah,
        
        jumatMode: jumatMode !== undefined ? Boolean(jumatMode) : config.jumatMode,
        jumatTimeStart: jumatTimeStart !== undefined ? jumatTimeStart : config.jumatTimeStart,
        jumatTimeEnd: jumatTimeEnd !== undefined ? jumatTimeEnd : config.jumatTimeEnd,
        jumatRunningTextEnabled: jumatRunningTextEnabled !== undefined ? Boolean(jumatRunningTextEnabled) : config.jumatRunningTextEnabled,
        ramadanMode: ramadanMode !== undefined ? Boolean(ramadanMode) : config.ramadanMode,
        alarmSound: alarmSound !== undefined ? alarmSound : config.alarmSound,
        
        adzanDuration: adzanDuration !== undefined ? parseInt(adzanDuration) : config.adzanDuration,
        adzanBackground: adzanBackground !== undefined ? adzanBackground : config.adzanBackground,
        ...(adzanBackgroundUrl !== undefined && { adzanBackgroundUrl }),
        adzanAudio: adzanAudio !== undefined ? adzanAudio : config.adzanAudio,
        
        iqomahBackground: iqomahBackground !== undefined ? iqomahBackground : config.iqomahBackground,
        ...(iqomahBackgroundUrl !== undefined && { iqomahBackgroundUrl }),
        iqomahMessage: iqomahMessage !== undefined ? iqomahMessage : config.iqomahMessage,
        
        sholatDuration: sholatDuration !== undefined ? parseInt(sholatDuration) : config.sholatDuration,
        sholatScreenMessage: sholatScreenMessage !== undefined ? sholatScreenMessage : config.sholatScreenMessage,
        ...(sholatBackgroundUrl !== undefined && { sholatBackgroundUrl }),
      }
    });

    await logAction({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'PrayerTimeConfig',
      entityId: updated.id,
      oldValue: oldData,
      newValue: updated,
      ip: req.ip
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('content:updated', { type: 'PRAYER_CONFIG' });
    }

    res.json({ message: 'Konfigurasi waktu sholat berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan konfigurasi.' });
  }
};
