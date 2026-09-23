import React from 'react';
import { format } from 'date-fns';

export default function LayoutSignature({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
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
      className="flex-1 w-full h-full relative overflow-hidden bg-black text-white flex transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00172D] via-[#00172D]/80 to-transparent"></div>

      {/* Left Sidebar - Prayer Times & Clock */}
      <div className="w-[420px] h-full bg-gradient-to-b from-[#003B73]/90 to-[#00172D]/90 shadow-2xl relative z-10 flex flex-col pt-8 backdrop-blur-sm border-r border-blue-500/30">
        
        {/* Analog Clock */}
        <div className="flex justify-center mb-4">
          <div className="relative w-40 h-40 rounded-full border-[5px] border-[#005B96] shadow-[0_0_30px_rgba(0,91,150,0.6)] bg-gradient-to-br from-[#003B73] to-[#00172D] flex items-center justify-center">
            {/* Clock Ticks */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute inset-0 flex justify-center"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="w-1 h-3 bg-blue-300 rounded-full mt-2"></div>
              </div>
            ))}
            
            {/* Hands */}
            <div 
              className="absolute bg-white rounded-full origin-bottom transition-transform duration-200"
              style={{ width: '4px', height: '45px', bottom: '50%', left: 'calc(50% - 2px)', transform: `rotate(${hourDeg}deg)` }}
            ></div>
            <div 
              className="absolute bg-blue-200 rounded-full origin-bottom transition-transform duration-200"
              style={{ width: '3px', height: '60px', bottom: '50%', left: 'calc(50% - 1.5px)', transform: `rotate(${minuteDeg}deg)` }}
            ></div>
            <div 
              className="absolute bg-red-500 rounded-full origin-bottom transition-transform duration-75"
              style={{ width: '2px', height: '70px', bottom: '50%', left: 'calc(50% - 1px)', transform: `rotate(${secondDeg}deg)` }}
            ></div>
            
            {/* Center dot */}
            <div className="absolute w-3 h-3 bg-red-500 rounded-full shadow-md z-10 border-2 border-white"></div>
          </div>
        </div>

        {/* Prayer Times List */}
        <div className="flex-1 px-8 pb-6 flex flex-col justify-evenly">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <div 
                key={prayer.name} 
                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${isNext ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-l-4 border-transparent hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNext ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-blue-900/50 text-blue-200'}`}>
                    {/* Icon placeholder (Sun/Moon depending on time) */}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className={`text-2xl tracking-wider ${isNext ? 'font-bold text-yellow-400' : 'font-medium text-blue-100'}`}>{prayer.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-mono tracking-tight ${isNext ? 'font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'font-bold text-white'}`}>{prayer.time}</div>
                  {prayer.iqamah && (
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-300 mt-1">Iqomah {prayer.iqamah}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area (Right) */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Top Header - Mosque Info */}
        <div className="w-full bg-gradient-to-l from-black/80 via-black/40 to-transparent p-8 flex justify-end items-start border-b border-white/10 backdrop-blur-sm">
          <div className="text-right">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 drop-shadow-lg mb-2">{mosqueProfile.name}</h1>
            <p className="text-xl text-gray-300 font-medium">{mosqueProfile.address}</p>
          </div>
          {mosqueProfile.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-20 h-20 ml-6 rounded-full border-2 border-yellow-500/50 shadow-lg object-cover bg-white" />
          ) : (
            <div className="w-20 h-20 ml-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg text-black font-bold text-3xl border-2 border-yellow-300/50">
              {mosqueProfile.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Date Ribbon */}
        <div className="flex justify-end pr-8 mt-4">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-2 rounded-l-full shadow-lg border border-blue-500/30 flex items-center gap-4 text-sm font-semibold tracking-wide">
            <span className="text-blue-200">{currentDate}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
            <span className="text-white">{currentHijri}</span>
          </div>
        </div>

        {/* Next Prayer Widget (Bottom Right) */}
        <div className="absolute bottom-32 right-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-6 transform hover:scale-105 transition-transform">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-1">Waktu Selanjutnya</p>
            <p className="text-4xl font-extrabold text-white">
              {nextPrayer?.name} <span className="text-yellow-400 ml-2 font-mono">{nextPrayer?.timeStr}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
