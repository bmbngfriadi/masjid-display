const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logAction } = require('../utils/auditLogger');

// Get the display setting (singleton logic)
exports.getDisplaySetting = async (req, res) => {
  try {
    let setting = await prisma.displaySetting.findFirst();
    if (!setting) {
      setting = await prisma.displaySetting.create({
        data: {
          layoutStyle: 'signature'
        }
      });
    }
    res.json(setting);
  } catch (error) {
    console.error('Error fetching display setting:', error);
    res.status(500).json({ error: 'Failed to fetch display setting' });
  }
};

// Update the display setting
exports.updateDisplaySetting = async (req, res) => {
  try {
    const {
      layoutStyle, 
      backgroundUrl, 
      backgroundUrls,
      backgroundSlideInterval,
      backgroundSliderEnabled,
      layoutDuration,
      infoSlideEnabled,
      infoSlideVisibleItems,
      infoSlideScrollSpeed,
      infoSlideDuration,
      infoSlideItems,
      runningTextEnabled,
      runningTextAdzanEnabled,
      runningTextIqomahEnabled,
      runningTextSholatEnabled,
      runningTextSpeed,
      runningTextSize
    } = req.body;
    let setting = await prisma.displaySetting.findFirst();
    let oldData = null;
    
    if (!setting) {
      setting = await prisma.displaySetting.create({
        data: {
          layoutStyle: layoutStyle || 'signature',
          backgroundUrl: backgroundUrl || '/masjid/mosque_bg.png',
          backgroundUrls: backgroundUrls || [],
          backgroundSlideInterval: backgroundSlideInterval || 10,
          backgroundSliderEnabled: backgroundSliderEnabled !== undefined ? backgroundSliderEnabled : true,
          layoutDuration: layoutDuration || 30,
          infoSlideEnabled: infoSlideEnabled || false,
          infoSlideVisibleItems: infoSlideVisibleItems || 5,
          infoSlideScrollSpeed: infoSlideScrollSpeed || 3,
          infoSlideDuration: infoSlideDuration || 10,
          infoSlideItems: infoSlideItems || [],
          runningTextEnabled: runningTextEnabled !== undefined ? runningTextEnabled : true,
          runningTextAdzanEnabled: runningTextAdzanEnabled !== undefined ? runningTextAdzanEnabled : true,
          runningTextIqomahEnabled: runningTextIqomahEnabled !== undefined ? runningTextIqomahEnabled : true,
          runningTextSholatEnabled: runningTextSholatEnabled !== undefined ? runningTextSholatEnabled : false,
          runningTextSpeed: runningTextSpeed || 25,
          runningTextSize: runningTextSize || 64
        }
      });
    } else {
      oldData = { ...setting };
      setting = await prisma.displaySetting.update({
        where: { id: setting.id },
        data: { 
          layoutStyle: layoutStyle !== undefined ? layoutStyle : setting.layoutStyle,
          backgroundUrl: backgroundUrl !== undefined ? backgroundUrl : setting.backgroundUrl,
          backgroundUrls: backgroundUrls !== undefined ? backgroundUrls : setting.backgroundUrls,
          backgroundSlideInterval: backgroundSlideInterval !== undefined ? parseInt(backgroundSlideInterval) : setting.backgroundSlideInterval,
          backgroundSliderEnabled: backgroundSliderEnabled !== undefined ? backgroundSliderEnabled : setting.backgroundSliderEnabled,
          layoutDuration: layoutDuration !== undefined ? parseInt(layoutDuration) : setting.layoutDuration,
          infoSlideEnabled: infoSlideEnabled !== undefined ? infoSlideEnabled : setting.infoSlideEnabled,
          infoSlideVisibleItems: infoSlideVisibleItems !== undefined ? parseInt(infoSlideVisibleItems) : setting.infoSlideVisibleItems,
          infoSlideScrollSpeed: infoSlideScrollSpeed !== undefined ? parseInt(infoSlideScrollSpeed) : setting.infoSlideScrollSpeed,
          infoSlideDuration: infoSlideDuration !== undefined ? parseInt(infoSlideDuration) : setting.infoSlideDuration,
          infoSlideItems: infoSlideItems !== undefined ? infoSlideItems : setting.infoSlideItems,
          runningTextEnabled: runningTextEnabled !== undefined ? runningTextEnabled : setting.runningTextEnabled,
          runningTextAdzanEnabled: runningTextAdzanEnabled !== undefined ? runningTextAdzanEnabled : setting.runningTextAdzanEnabled,
          runningTextIqomahEnabled: runningTextIqomahEnabled !== undefined ? runningTextIqomahEnabled : setting.runningTextIqomahEnabled,
          runningTextSholatEnabled: runningTextSholatEnabled !== undefined ? runningTextSholatEnabled : setting.runningTextSholatEnabled,
          runningTextSpeed: runningTextSpeed !== undefined ? parseInt(runningTextSpeed) : setting.runningTextSpeed,
          runningTextSize: runningTextSize !== undefined ? parseInt(runningTextSize) : setting.runningTextSize
        }
      });
    }

    await logAction({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'DisplaySetting',
      entityId: setting.id,
      oldValue: oldData,
      newValue: setting,
      ip: req.ip
    });

    // Emit socket event to all clients to change layout immediately
    const io = req.app.get('io');
    if (io) {
      io.emit('DISPLAY_SETTING_UPDATED', setting);
    }

    res.json(setting);
  } catch (error) {
    console.error('Error updating display setting:', error);
    res.status(500).json({ error: 'Failed to update display setting' });
  }
};
