import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutModern({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
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
      className="flex-1 w-full h-full relative overflow-hidden text-white flex transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      {/* Dark gradient on the right side only */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent"></div>

      <div className="flex-1"></div>

      {/* Right side modern panel */}
      <div className="w-[35cqw] h-full relative z-10 flex flex-col justify-center items-end pr-[4cqw] gap-[1cqh] py-[2cqh]">
        
        {/* Clock Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-[2cqw] border border-white/20 p-[1.5cqw] shadow-2xl mb-[1cqh] flex flex-col items-center">
          <h1 className="text-[min(7cqw,10.5cqh)] font-bold font-mono tracking-tighter leading-none mb-[0.5cqh] text-white">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
          </h1>
          <div className="w-full border-t border-white/20 my-[1cqh]"></div>
          <div className="flex w-full justify-between items-center px-[1cqw]">
            <h2 className="text-[1cqw] text-emerald-300 font-semibold tracking-wide">{currentDate}</h2>
            <div className="w-[0.5cqw] h-[0.5cqw] rounded-full bg-yellow-400"></div>
            <h3 className="text-[1cqw] text-yellow-300 font-medium">{currentHijri}</h3>
          </div>
        </div>

        {/* Prayer Cards */}
        <div className="w-full flex flex-col gap-[1cqh]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toLowerCase() === prayer.name.toLowerCase();
            return (
              <div 
                key={prayer.name} 
                className={`w-full flex items-center justify-between p-[1.2cqw] rounded-[1cqw] border transition-all duration-500 backdrop-blur-md shadow-lg ${
                  isNext 
                    ? 'border-emerald-400 bg-emerald-600/30 shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-[1.02] ml-[-1.5cqw] animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-[1.5cqw]">
                  {isNext && <div className="w-[0.4cqw] h-[5cqh] bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>}
                  <div className="flex flex-col">
                    <h4 className={`text-[1.2cqw] font-bold uppercase tracking-wider ${isNext ? 'text-emerald-300 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-300'}`}>
                      {prayer.name}
                    </h4>
                    {prayer.iqamah && (
                      <span className="text-[0.7cqw] font-medium text-gray-400 mt-[0.5cqh]">
                        Iqamah: {prayer.iqamah}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`text-[2.2cqw] font-mono font-bold tracking-tight ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-100'}`}>
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
