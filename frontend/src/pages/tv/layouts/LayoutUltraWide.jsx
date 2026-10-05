import React from 'react';
import { format } from 'date-fns';

export default function LayoutUltraWide({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
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
      className="flex-1 w-full h-full relative overflow-hidden bg-black text-white flex flex-col transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      {/* Top Header - Mosque Info */}
      <div className="absolute top-0 inset-x-0 p-[2cqw] flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
        {/* Left Side: Mosque Profile */}
        <div className="flex items-center gap-[1.5cqw] bg-[#004282]/80 backdrop-blur-md p-[1cqw] pr-[2cqw] rounded-full border border-blue-400/30 shadow-[0_0_20px_rgba(0,66,130,0.5)]">
          {mosqueProfile.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[4cqw] h-[4cqw] rounded-full border-2 border-white shadow-lg bg-white object-cover" />
          ) : (
            <div className="w-[4cqw] h-[4cqw] rounded-full bg-white flex items-center justify-center shadow-lg text-[#004282] font-bold text-[1.5cqw] border-2 border-gray-200">
              {mosqueProfile.name?.charAt(0) || 'M'}
            </div>
          )}
          <div>
            <h1 className="text-[2cqw] font-extrabold text-white drop-shadow-md">{mosqueProfile.name}</h1>
            <p className="text-[0.8cqw] text-blue-200 font-medium tracking-wide">{mosqueProfile.address}</p>
          </div>
        </div>

        {/* Right Side: Date & Next Prayer */}
        <div className="flex flex-col items-end gap-[0.8cqw]">
          <div className="bg-black/50 backdrop-blur-sm px-[1.5cqw] py-[0.5cqh] rounded-full border border-white/20 text-[0.8cqw] font-semibold tracking-wide flex items-center gap-[0.8cqw]">
            <span className="text-gray-300">{currentDate}</span>
            <div className="w-[0.3cqw] h-[0.3cqw] rounded-full bg-white"></div>
            <span className="text-white">{currentHijri}</span>
          </div>
          <div className="bg-blue-600/90 backdrop-blur-md px-[1.5cqw] py-[0.8cqh] rounded-full border border-blue-400/50 shadow-lg flex items-center gap-[0.8cqw]">
            <svg className="w-[1.2cqw] h-[1.2cqw] text-yellow-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-[1cqw]">{nextPrayer?.name}</span>
            <span className="font-mono font-bold bg-white/20 px-[0.5cqw] py-[0.1cqh] rounded text-white text-[1cqw]">{nextPrayer?.timeStr}</span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Bar - Prayer Times & Clock */}
      <div className="h-[25cqh] w-full bg-gradient-to-t from-[#002244] via-[#002244]/90 to-transparent relative z-10 flex items-end pb-[2cqh] px-[2cqw] border-t border-blue-500/20 backdrop-blur-sm">
        
        {/* Floating Analog Clock on the left */}
        <div className="absolute left-[2cqw] bottom-[3cqh] w-[15cqw] h-[15cqw] rounded-full border-[0.3cqw] border-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#003B73] to-[#00172D] flex items-center justify-center z-30">
            {/* Clock Ticks */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute inset-0 flex justify-center"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="w-[0.2cqw] h-[0.5cqw] bg-blue-200 rounded-full mt-[0.5cqw]"></div>
              </div>
            ))}
            
            {/* Hands */}
            <div 
              className="absolute bg-white rounded-full origin-bottom transition-transform duration-200"
              style={{ width: '0.4cqw', height: '4cqw', bottom: '50%', left: 'calc(50% - 0.2cqw)', transform: `rotate(${hourDeg}deg)` }}
            ></div>
            <div 
              className="absolute bg-blue-300 rounded-full origin-bottom transition-transform duration-200"
              style={{ width: '0.3cqw', height: '5cqw', bottom: '50%', left: 'calc(50% - 0.15cqw)', transform: `rotate(${minuteDeg}deg)` }}
            ></div>
            <div 
              className="absolute bg-red-500 rounded-full origin-bottom transition-transform duration-75"
              style={{ width: '0.15cqw', height: '6cqw', bottom: '50%', left: 'calc(50% - 0.075cqw)', transform: `rotate(${secondDeg}deg)` }}
            ></div>
            <div className="absolute w-[1cqw] h-[1cqw] bg-red-500 rounded-full shadow-md z-10 border-[0.1cqw] border-white"></div>
        </div>

        {/* Horizontal Prayer Times */}
        <div className="w-full pl-[20cqw] flex justify-between items-center pr-[1cqw] gap-[0.5cqw] lg:gap-[1.5cqw]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <div key={prayer.name} className={`flex flex-col items-center justify-center ${isNext ? 'scale-105 transform transition-transform animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : ''}`}>
                <span className={`text-[1.2cqw] uppercase tracking-widest font-bold mb-[0.5cqh] ${isNext ? 'text-yellow-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-blue-200'}`}>{prayer.name}</span>
                <span className={`text-[4cqw] leading-none font-mono font-extrabold tracking-tight ${isNext ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-white'}`}>{prayer.time}</span>
                {prayer.iqamah && (
                  <span className="text-[0.8cqw] uppercase tracking-widest text-blue-300 mt-[0.5cqh] font-bold">Iqomah {prayer.iqamah}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
