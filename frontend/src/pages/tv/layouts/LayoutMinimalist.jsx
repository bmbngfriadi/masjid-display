import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutMinimalist({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
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
      {/* Top Gradient for Clock Visibility */}
      <div className="w-full h-48 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0"></div>

      {/* Top Bar: Mosque Name and Clock */}
      <div className="relative z-10 w-full p-8 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold tracking-wide drop-shadow-lg text-white mb-2">{mosqueProfile?.name || 'Masjid Baitul Jannah'}</h1>
          <h2 className="text-xl text-emerald-300 font-medium tracking-wider drop-shadow-md">{currentDate} | {currentHijri}</h2>
        </div>
        <div className="text-right">
          <h1 className="text-8xl font-bold font-mono tracking-tighter leading-none drop-shadow-xl text-white">
            {format(time, 'HH:mm')}
          </h1>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Minimalist Bar */}
      <div className="relative z-10 w-full bg-white/95 text-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white flex flex-col">
        <div className="flex justify-between items-stretch h-36">
          {prayers.map((prayer, index) => {
            const isNext = nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();
            return (
              <div 
                key={prayer.name} 
                className={`flex-1 flex flex-col items-center justify-center relative border-r border-slate-200 last:border-r-0 transition-all duration-500 ${
                  isNext ? 'bg-emerald-600 text-white' : 'bg-transparent'
                }`}
              >
                {/* Active Indicator Top Border */}
                {isNext && <div className="absolute top-0 w-full h-2 bg-emerald-400"></div>}
                
                <h4 className={`text-xl font-bold uppercase tracking-widest mb-1 ${isNext ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {prayer.name}
                </h4>
                <div className={`text-5xl font-mono font-bold tracking-tighter mb-1 ${isNext ? 'text-white' : 'text-slate-800'}`}>
                  {prayer.time}
                </div>
                {prayer.iqamah && (
                  <div className={`text-sm font-medium ${isNext ? 'text-emerald-200' : 'text-slate-400'}`}>
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
