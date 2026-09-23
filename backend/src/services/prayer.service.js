const adhan = require('adhan');
const prisma = require('../config/db');
const { format } = require('date-fns');

exports.getPrayerTimesForDate = async (date, mosqueId = null) => {
  // Get config from DB
  let config = await prisma.prayerTimeConfig.findFirst();
  if (!config) {
    config = {
      latitude: 1.1301, longitude: 104.0529, calculationMethod: "Singapore",
      fajrOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0
    };
  }

  const coordinates = new adhan.Coordinates(config.latitude, config.longitude);
  
  const addMinutes = (dateObj, minutes) => {
    return new Date(dateObj.getTime() + minutes * 60000);
  };

  // Kemenag Integration via MyQuran API
  if (config.calculationMethod === "Kemenag" && config.cityId) {
    try {
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');
      const day = format(date, 'dd');
      // Fix: native fetch or axios. Let's use fetch since node 24 supports it.
      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${config.cityId}/${year}/${month}/${day}`);
      const data = await response.json();
      
      if (data.status && data.data && data.data.jadwal) {
        const jadwal = data.data.jadwal;
        // Parse time strings "HH:mm" to Date objects for today
        const parseTime = (timeStr) => {
          const [h, m] = timeStr.split(':');
          const d = new Date(date);
          d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
          return d;
        };

        const fajrDate = parseTime(jadwal.subuh);
        const sunriseDate = parseTime(jadwal.terbit || jadwal.syuruq);
        const dhuhrDate = parseTime(jadwal.dzuhur);
        const asrDate = parseTime(jadwal.ashar);
        const maghribDate = parseTime(jadwal.maghrib);
        const ishaDate = parseTime(jadwal.isya);

        return {
          date: format(date, 'yyyy-MM-dd'),
          fajr: format(addMinutes(fajrDate, config.fajrOffset), 'HH:mm'),
          sunrise: format(sunriseDate, 'HH:mm'),
          dhuhr: format(addMinutes(dhuhrDate, config.dhuhrOffset), 'HH:mm'),
          asr: format(addMinutes(asrDate, config.asrOffset), 'HH:mm'),
          maghrib: format(addMinutes(maghribDate, config.maghribOffset), 'HH:mm'),
          isha: format(addMinutes(ishaDate, config.ishaOffset), 'HH:mm'),
        };
      }
    } catch (err) {
      console.error("Failed to fetch Kemenag API, falling back to adhan library:", err);
    }
  }

  // Setup Calculation Method
  let params;
  switch(config.calculationMethod) {
    case "Kemenag": // Fallback if API fails
      params = adhan.CalculationMethod.Singapore(); 
      params.fajrAngle = 20;
      params.ishaAngle = 18;
      break;
    case "MuslimWorldLeague":
      params = adhan.CalculationMethod.MuslimWorldLeague();
      break;
    case "Egyptian":
      params = adhan.CalculationMethod.Egyptian();
      break;
    case "Makkah":
      params = adhan.CalculationMethod.UmmAlQura();
      break;
    default:
      params = adhan.CalculationMethod.Singapore();
  }
  
  // Get base prayer times
  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

  return {
    date: format(date, 'yyyy-MM-dd'),
    fajr: format(addMinutes(prayerTimes.fajr, config.fajrOffset), 'HH:mm'),
    sunrise: format(prayerTimes.sunrise, 'HH:mm'),
    dhuhr: format(addMinutes(prayerTimes.dhuhr, config.dhuhrOffset), 'HH:mm'),
    asr: format(addMinutes(prayerTimes.asr, config.asrOffset), 'HH:mm'),
    maghrib: format(addMinutes(prayerTimes.maghrib, config.maghribOffset), 'HH:mm'),
    isha: format(addMinutes(prayerTimes.isha, config.ishaOffset), 'HH:mm'),
  };
};

exports.getPrayerScheduleForMonth = async (year, month) => {
  const schedule = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const times = await this.getPrayerTimesForDate(date);
    schedule.push(times);
  }
  
  return schedule;
};
