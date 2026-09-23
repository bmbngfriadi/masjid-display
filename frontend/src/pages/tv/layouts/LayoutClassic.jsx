import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutClassic({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
  const getIqamahTime = (prayerTime, delayMins) => {
    if (!prayerTime || prayerTime === '--:--' || !delayMins) return null;
    const [h, m] = prayerTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m + delayMins, 0);
    return format(d, 'HH:mm');
  };

  const prayers = [
    { name: 'Subuh', time: prayerTimes.fajr, iqamah: getIqamahTime(prayerTimes.fajr, prayerConfig?.fajrIqamah) },
    { name: 'Syuruq', time: prayerTimes.sunrise || '--:--', iqamah: null },
    { name: 'Dzuhur', time: prayerTimes.dhuhr, iqamah: getIqamahTime(prayerTimes.dhuhr, prayerConfig?.dhuhrIqamah) },
    { name: 'Ashar', time: prayerTimes.asr, iqamah: getIqamahTime(prayerTimes.asr, prayerConfig?.asrIqamah) },
    { name: 'Maghrib', time: prayerTimes.maghrib, iqamah: getIqamahTime(prayerTimes.maghrib, prayerConfig?.maghribIqamah) },
    { name: 'Isya', time: prayerTimes.isha, iqamah: getIqamahTime(prayerTimes.isha, prayerConfig?.ishaIqamah) }
  ];

  return (
    <div 
      className="flex-1 w-full h-full relative overflow-hidden text-white flex flex-col transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      {/* Light dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Top Section: Clock and Date */}
      <div className="relative z-10 w-full h-1/2 flex flex-col items-center justify-center mt-10">
        <div className="bg-black/40 backdrop-blur-md px-16 py-8 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col items-center">
          <h1 className="text-[10rem] font-bold font-mono tracking-tighter leading-none mb-4 drop-shadow-lg text-white">
            {format(time, 'HH:mm')}
          </h1>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-4xl text-emerald-400 font-semibold tracking-wide drop-shadow-md">{currentDate}</h2>
            <h3 className="text-2xl text-yellow-400 tracking-wider font-medium drop-shadow-md">{currentHijri}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Section: Prayer Times Grid */}
      <div className="relative z-10 w-full bg-black/70 backdrop-blur-md border-t-2 border-emerald-500/50 p-6 flex flex-col justify-center">
        <div className="grid grid-cols-6 gap-6 w-full max-w-screen-2xl mx-auto">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();
            return (
              <div 
                key={prayer.name} 
                className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden ${
                  isNext 
                    ? 'border-emerald-400 bg-emerald-900/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-105' 
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {isNext && (
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
                )}
                <h4 className={`text-2xl font-bold uppercase tracking-widest mb-4 ${isNext ? 'text-emerald-300' : 'text-gray-300'}`}>
                  {prayer.name}
                </h4>
                <div className={`text-6xl font-mono font-bold tracking-tighter mb-2 ${isNext ? 'text-white' : 'text-white'}`}>
                  {prayer.time}
                </div>
                {prayer.iqamah && (
                  <div className={`text-lg font-medium px-4 py-1 rounded-full ${isNext ? 'bg-emerald-800/80 text-emerald-100' : 'bg-white/10 text-gray-300'}`}>
                    Iqamah: {prayer.iqamah}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
