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
      <div className="relative z-10 w-full h-1/2 flex flex-col items-center justify-center mt-[3cqh]">
        <div className="bg-black/40 backdrop-blur-md px-[4cqw] py-[2cqh] rounded-[2cqw] border border-white/20 shadow-2xl flex flex-col items-center">
          <h1 className="text-[min(12cqw,18cqh)] font-bold font-mono tracking-tighter leading-none mb-[1.5cqh] drop-shadow-lg text-white">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
          </h1>
          <div className="flex flex-col items-center gap-[0.5cqh]">
            <h2 className="text-[2.5cqw] text-emerald-400 font-semibold tracking-wide drop-shadow-md">{currentDate}</h2>
            <h3 className="text-[1.8cqw] text-yellow-400 tracking-wider font-medium drop-shadow-md">{currentHijri}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Section: Prayer Times Grid */}
      <div className="relative z-10 w-full bg-black/70 backdrop-blur-md border-t-[0.2cqw] border-emerald-500/50 p-[2cqw] flex flex-col justify-center">
        <div className="grid grid-cols-6 gap-[1.5cqw] w-full max-w-[96cqw] mx-auto">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toLowerCase() === prayer.name.toLowerCase();
            return (
              <div 
                key={prayer.name} 
                className={`flex flex-col items-center p-[1.5cqw] rounded-[1cqw] border-[0.2cqw] transition-all duration-500 relative overflow-hidden ${
                  isNext 
                    ? 'border-emerald-400 bg-emerald-900/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-105 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' 
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {isNext && (
                  <div className="absolute top-0 w-full h-[0.5cqh] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
                )}
                <h4 className={`text-[1.5cqw] font-bold uppercase tracking-widest mb-[1cqh] ${isNext ? 'text-emerald-300 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-300'}`}>
                  {prayer.name}
                </h4>
                <div className={`text-[4cqw] font-mono font-bold tracking-tighter mb-[0.5cqh] ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-white'}`}>
                  {prayer.time}
                </div>
                {prayer.iqamah && (
                  <div className={`text-[1cqw] font-medium px-[1cqw] py-[0.5cqh] rounded-full ${isNext ? 'bg-emerald-800/80 text-emerald-100 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-white/10 text-gray-300'}`}>
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
