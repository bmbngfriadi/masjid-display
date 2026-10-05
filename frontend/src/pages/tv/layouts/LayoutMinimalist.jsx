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
      <div className="w-full h-[15cqh] bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0"></div>

      {/* Top Bar: Mosque Name and Clock */}
      <div className="relative z-10 w-full p-[2cqw] flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-[3cqw] font-bold tracking-wide drop-shadow-lg text-white mb-[1cqh]">{mosqueProfile?.name || 'Masjid Baitul Jannah'}</h1>
          <h2 className="text-[1cqw] text-emerald-300 font-medium tracking-wider drop-shadow-md">{currentDate} | {currentHijri}</h2>
        </div>
        <div className="text-right">
          <h1 className="text-[min(6cqw,9cqh)] font-bold font-mono tracking-tighter leading-none drop-shadow-xl text-white">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
          </h1>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Minimalist Bar */}
      <div className="relative z-10 w-full bg-white/95 text-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white flex flex-col">
        <div className="flex justify-between items-stretch h-[18cqh]">
          {prayers.map((prayer, index) => {
            const isNext = nextPrayer?.name?.toLowerCase() === prayer.name.toLowerCase();
            return (
              <div 
                key={prayer.name} 
                className={`flex-1 flex flex-col items-center justify-center relative border-r border-slate-200 last:border-r-0 transition-all duration-500 ${
                  isNext ? 'bg-emerald-600 text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-transparent'
                }`}
              >
                {/* Active Indicator Top Border */}
                {isNext && <div className="absolute top-0 w-full h-[0.8cqh] bg-emerald-400"></div>}
                
                <h4 className={`text-[1.2cqw] font-bold uppercase tracking-widest mb-[0.5cqh] ${isNext ? 'text-emerald-100 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-slate-500'}`}>
                  {prayer.name}
                </h4>
                <div className={`text-[3cqw] font-mono font-bold tracking-tighter mb-[0.5cqh] ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-slate-800'}`}>
                  {prayer.time}
                </div>
                {prayer.iqamah && (
                  <div className={`text-[0.8cqw] font-medium ${isNext ? 'text-emerald-200 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-slate-400'}`}>
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
