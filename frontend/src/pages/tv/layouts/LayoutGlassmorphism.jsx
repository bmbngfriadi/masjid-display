import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function LayoutGlassmorphism({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
  const [pulse, setPulse] = useState(false);

  // Pulse animation for the colon in the clock
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      className="flex-1 w-full h-full relative overflow-hidden text-white flex flex-col justify-between p-8 transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Header - Mosque Profile & Dates */}
      <div className="relative z-10 flex justify-between items-start">
        {/* Mosque Info (Glass) */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          {mosqueProfile.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-24 h-24 rounded-full border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)] object-cover bg-white/10 p-1" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shadow-lg backdrop-blur-md border-2 border-white/30 text-white font-bold text-4xl">
              {mosqueProfile.name?.charAt(0) || 'M'}
            </div>
          )}
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-md mb-2">{mosqueProfile.name}</h1>
            <p className="text-2xl text-gray-200 font-medium tracking-wide">{mosqueProfile.address}</p>
          </div>
        </div>

        {/* Date Info (Glass) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-end justify-center min-w-[350px]">
          <p className="text-3xl font-bold text-white tracking-wider mb-2">{currentDate}</p>
          <div className="w-full h-px bg-white/20 mb-2"></div>
          <p className="text-2xl font-semibold text-yellow-300 tracking-wide">{currentHijri}</p>
        </div>
      </div>

      {/* Center - Giant Digital Clock */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-12">
        <div className="flex items-baseline justify-center font-mono font-extrabold drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <span className="text-[22vw] leading-none tracking-tight">{format(time, 'HH')}</span>
          <span className={`text-[18vw] leading-none mx-2 pb-8 ${pulse ? 'opacity-100' : 'opacity-20'} transition-opacity duration-300 text-yellow-400`}>:</span>
          <span className="text-[22vw] leading-none tracking-tight">{format(time, 'mm')}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-10 py-3 rounded-full border border-white/10 shadow-xl mt-4">
          <span className="text-4xl font-bold tracking-[0.2em]">{format(time, 'ss')}</span>
        </div>
      </div>

      {/* Bottom - Prayer Times Horizontal Cards */}
      <div className="relative z-10 flex justify-between gap-4 mb-4">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <div 
              key={prayer.name} 
              className={`flex-1 rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden relative ${
                isNext 
                  ? 'bg-yellow-400/20 backdrop-blur-2xl border-2 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105 transform -translate-y-4' 
                  : 'bg-black/30 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-white/10'
              }`}
            >
              {/* Highlight gradient for active prayer */}
              {isNext && <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/10 to-transparent"></div>}
              
              <h3 className={`text-3xl tracking-widest uppercase z-10 ${isNext ? 'font-extrabold text-yellow-300' : 'font-semibold text-gray-300'}`}>
                {prayer.name}
              </h3>
              
              <div className={`text-6xl font-bold my-4 z-10 drop-shadow-md ${isNext ? 'text-white' : 'text-gray-100'}`}>
                {prayer.time}
              </div>
              
              <div className={`w-full py-2 rounded-xl text-center text-lg font-semibold tracking-wider z-10 ${
                isNext ? 'bg-yellow-500/30 text-yellow-100' : 'bg-white/5 text-gray-400'
              }`}>
                {prayer.iqamah ? `IQOMAH ${prayer.iqamah}` : '---'}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
