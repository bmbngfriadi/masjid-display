import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function LayoutDynamic({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

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
      }}
    >
      {/* Dynamic Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-black/70 to-indigo-900/90 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-60 animate-pulse" style={{ animationDuration: '4s' }}></div>

      {/* Left Panel - Prayers */}
      <div className="w-[35%] h-full relative z-10 flex flex-col pt-[3vh] pb-[2vh] px-[3vw] border-r-[0.2vw] border-white/10 bg-black/40 backdrop-blur-md shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Mosque Profile */}
        <div className="flex items-center gap-[1.5vw] mb-[3vh]">
          {mosqueProfile.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[6vw] h-[6vw] rounded-[1vw] shadow-lg object-cover bg-white p-[0.2vw]" />
          ) : (
            <div className="w-[6vw] h-[6vw] rounded-[1vw] bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg text-white font-bold text-[2vw]">
              {mosqueProfile.name?.charAt(0) || 'M'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-[2vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 uppercase tracking-tighter leading-none mb-[0.5vh]">{mosqueProfile.name}</h1>
            <p className="text-[1vw] text-blue-300 font-semibold leading-tight line-clamp-2">{mosqueProfile.address}</p>
          </div>
        </div>

        {/* Prayers List */}
        <div className="flex-1 flex flex-col justify-between">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <div 
                key={prayer.name} 
                className={`relative overflow-hidden flex items-center justify-between p-[1.5vh] rounded-[1vw] transition-all duration-300 ${
                  isNext 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-[0_10px_30px_rgba(6,182,212,0.5)] transform scale-[1.02]' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/5'
                }`}
              >
                {/* Shine effect for next prayer */}
                {isNext && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>}
                
                <div>
                  <h3 className={`text-[1.5vw] font-bold tracking-wider ${isNext ? 'text-white' : 'text-gray-400'}`}>{prayer.name}</h3>
                  {prayer.iqamah && (
                    <p className={`text-[0.8vw] font-semibold mt-[0.5vh] ${isNext ? 'text-cyan-100' : 'text-gray-500'}`}>IQOMAH {prayer.iqamah}</p>
                  )}
                </div>
                <div className={`text-[2.5vw] font-black font-mono tracking-tighter ${isNext ? 'text-white drop-shadow-md' : 'text-white/80'}`}>
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Clock & Dates */}
      <div className="flex-1 relative z-10 flex flex-col p-[4vh]">
        {/* Date Headers */}
        <div className="flex justify-end gap-[1.5vw] mb-auto">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-[1vw] p-[1.5vw] text-right shadow-2xl">
            <h2 className="text-[2vw] font-black text-white mb-[0.5vh] tracking-wide">{currentDate}</h2>
            <h2 className="text-[1.5vw] font-bold text-cyan-400 tracking-wider">{currentHijri}</h2>
          </div>
        </div>

        {/* Giant Dynamic Clock */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-[6vh]">
          
          {/* Circular Progress / Analog Hybrid */}
          <div className="relative w-[20vw] h-[20vw] rounded-full mb-[3vh] flex items-center justify-center">
            {/* SVG Progress Ring for Seconds */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle 
                cx="50" cy="50" r="48" 
                fill="none" 
                stroke="#22d3ee" // cyan-400
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray={`${(seconds / 60) * 301.59} 301.59`} // 2 * PI * 48 = 301.59
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            {/* Analog Hands inside */}
            <div className="relative w-[15vw] h-[15vw] rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-inner">
               {/* Center Dot */}
               <div className="absolute w-[1vw] h-[1vw] bg-cyan-400 rounded-full z-20 shadow-[0_0_15px_#22d3ee]"></div>
               {/* Hour Hand */}
               <div className="absolute w-[0.5vw] h-[4vw] bg-white rounded-full origin-bottom bottom-1/2 transition-transform duration-200 z-10" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
               {/* Minute Hand */}
               <div className="absolute w-[0.4vw] h-[6vw] bg-gray-300 rounded-full origin-bottom bottom-1/2 transition-transform duration-200 z-10" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
               {/* Second Hand */}
               <div className="absolute w-[0.3vw] h-[7vw] bg-cyan-400 rounded-full origin-bottom bottom-1/2 transition-transform duration-75 z-10" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
            </div>
          </div>

          {/* Digital Time Text */}
          <div className="flex items-center gap-[1vw] text-[12vw] font-black font-mono leading-none tracking-tighter drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            <span className="text-white">{format(time, 'HH')}</span>
            <span className={`text-cyan-400 ${pulse ? 'opacity-100' : 'opacity-20'} transition-opacity duration-300 -translate-y-[1vh]`}>:</span>
            <span className="text-white">{format(time, 'mm')}</span>
          </div>

        </div>

        {/* Next Prayer Floating Action Box */}
        <div className="absolute bottom-[4vh] right-[3vw] flex items-center gap-[1.5vw]">
          <div className="text-right">
            <p className="text-gray-400 text-[1vw] font-bold tracking-widest uppercase mb-[0.5vh]">Selanjutnya</p>
            <p className="text-[2.5vw] font-black text-white">{nextPrayer?.name} <span className="text-cyan-400">{nextPrayer?.timeStr}</span></p>
          </div>
          <div className="w-[5vw] h-[5vw] rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-bounce">
            <svg className="w-[2.5vw] h-[2.5vw] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
