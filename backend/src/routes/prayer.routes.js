const express = require('express');
const router = express.Router();
const prayerService = require('../services/prayer.service');

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const times = await prayerService.getPrayerTimesForDate(today);
    res.json(times);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prayer times' });
  }
});

router.get('/month', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = year ? parseInt(year) : new Date().getFullYear();
    const m = month ? parseInt(month) : new Date().getMonth() + 1;
    const schedule = await prayerService.getPrayerScheduleForMonth(y, m);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prayer schedule' });
  }
});

module.exports = router;
