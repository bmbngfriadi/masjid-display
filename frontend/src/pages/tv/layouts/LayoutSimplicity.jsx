import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutSimplicity({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
  const timeStr = format(time, 'HH:mm:ss');
  
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
      {/* Light dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Left Vertical Bar */}
      <div className="w-[28cqw] h-full bg-[#18395B]/90 shadow-[20px_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10 flex flex-col items-center py-[4cqh] px-[2cqw]">
        {/* Large Digital Clock */}
        <div className="text-center mb-[2cqh] w-full pb-[3cqh] border-b border-white/20">
          <h1 className="text-[min(7cqw,10.5cqh)] leading-none font-extrabold font-mono tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-[1cqh]">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
          </h1>
          <p className="text-[1.2cqw] text-blue-200 font-medium tracking-wider">{currentDate}</p>
          <p className="text-[1cqw] text-yellow-400 font-semibold mt-[0.5cqh]">{currentHijri}</p>
        </div>

        {/* Vertical Prayer Times */}
        <div className="w-full flex-1 flex flex-col justify-evenly gap-[1cqh] mt-[2cqh]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <div key={prayer.name} className="flex items-center justify-between w-full relative">
                {isNext && (
                  <div className="absolute -left-[1.5cqw] w-[0.5cqw] h-[6cqh] bg-yellow-400 rounded-r-full shadow-[0_0_15px_rgba(250,204,21,0.8)]"></div>
                )}
                <div className="flex items-center gap-[1cqw]">
                  <div className={`p-[0.5cqw] rounded-[0.8cqw] ${isNext ? 'bg-yellow-400/20 text-yellow-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-blue-900/30 text-blue-200'}`}>
                    <svg className="w-[1.2cqw] h-[1.2cqw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className={`text-[1.5cqw] uppercase tracking-widest ${isNext ? 'font-bold text-yellow-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'font-semibold text-white/90'}`}>{prayer.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-[2.2cqw] font-mono tracking-tight ${isNext ? 'font-bold text-yellow-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'font-bold text-white'}`}>{prayer.time}</div>
                  {prayer.iqamah && (
                    <div className="text-[0.7cqw] font-semibold uppercase tracking-widest text-blue-300 mt-[0.5cqh]">Iqomah {prayer.iqamah}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Area (Right) */}
      <div className="flex-1 relative z-10 flex flex-col justify-between p-[4cqw] items-end">
        
        {/* Top Right: Mosque Profile (Elegant) */}
        <div className="flex items-center gap-[1.5cqw] bg-black/40 backdrop-blur-md p-[1.5cqw] rounded-[2cqw] border border-white/10 shadow-xl">
          <div className="text-right">
            <h1 className="text-[3cqw] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 drop-shadow-md mb-[1cqh]">{mosqueProfile.name}</h1>
            <p className="text-[1cqw] text-gray-200 font-medium">{mosqueProfile.address}</p>
          </div>
          {mosqueProfile.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[7cqw] h-[7cqw] rounded-full border-[0.2cqw] border-yellow-500 shadow-xl object-cover bg-white" />
          ) : (
            <div className="w-[7cqw] h-[7cqw] rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-xl text-black font-bold text-[2.5cqw] border-[0.2cqw] border-yellow-300/50">
              {mosqueProfile.name?.charAt(0) || 'M'}
            </div>
          )}
        </div>

        {/* Bottom Right: Next Prayer Pill */}
        <div className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-md px-[2.5cqw] py-[1.5cqh] rounded-[2cqw] border border-blue-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-[1.5cqw]">
          <div className="flex flex-col items-end">
            <span className="text-blue-200 text-[0.8cqw] font-bold uppercase tracking-widest mb-[0.5cqh]">Waktu Selanjutnya</span>
            <span className="text-[2cqw] font-extrabold text-white">{nextPrayer?.name}</span>
          </div>
          <div className="w-[0.1cqw] h-[5cqh] bg-blue-500/50"></div>
          <div className="text-[3cqw] font-mono font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            {nextPrayer?.timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
