import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function LayoutFuturistic({ time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, prayerConfig, displaySetting, currentBgImage }) {
  const [pulse, setPulse] = useState(false);

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
    { name: 'SUBUH', time: prayerTimes.fajr, iqamah: getIqamahTime(prayerTimes.fajr, prayerConfig?.fajrIqamah) },
    { name: 'SYURUQ', time: prayerTimes.sunrise || '--:--', iqamah: null },
    { name: 'DZUHUR', time: prayerTimes.dhuhr, iqamah: getIqamahTime(prayerTimes.dhuhr, prayerConfig?.dhuhrIqamah) },
    { name: 'ASHAR', time: prayerTimes.asr, iqamah: getIqamahTime(prayerTimes.asr, prayerConfig?.asrIqamah) },
    { name: 'MAGHRIB', time: prayerTimes.maghrib, iqamah: getIqamahTime(prayerTimes.maghrib, prayerConfig?.maghribIqamah) },
    { name: 'ISYA', time: prayerTimes.isha, iqamah: getIqamahTime(prayerTimes.isha, prayerConfig?.ishaIqamah) }
  ];

  return (
    <div 
      className="flex-1 w-full h-full relative overflow-hidden text-[#00ffcc] font-mono flex flex-col bg-black transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBgImage || '/masjid/mosque_bg.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Sci-Fi Grid & Dark Overlay */}
      <div className="absolute inset-0 bg-[#000810]/80"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Top HUD (Heads Up Display) Bar */}
      <div className="relative z-10 w-full h-[12vh] border-b border-[#00ffcc]/30 bg-black/50 backdrop-blur-md flex items-center justify-between px-[3vw] shadow-[0_5px_30px_rgba(0,255,204,0.1)]">
        <div className="flex items-center gap-[1.5vw]">
          <div className="w-[5vw] h-[5vw] relative flex items-center justify-center">
            {/* Spinning decorative border */}
            <div className="absolute inset-0 border-t-2 border-r-2 border-[#00ffcc] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-1 border-b-2 border-l-2 border-[#00ffcc]/50 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            {mosqueProfile.logoUrl ? (
              <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[3.5vw] h-[3.5vw] rounded-full object-cover z-10" />
            ) : (
              <span className="text-[1.5vw] font-bold z-10">{mosqueProfile.name?.charAt(0) || 'M'}</span>
            )}
          </div>
          <div>
            <h1 className="text-[2vw] font-black tracking-widest text-[#00ffcc] uppercase drop-shadow-[0_0_10px_#00ffcc]">{mosqueProfile.name}</h1>
            <p className="text-[0.8vw] text-[#00ffcc]/70 tracking-widest uppercase">{mosqueProfile.address}</p>
          </div>
        </div>

        {/* Cyberpunk style date display */}
        <div className="flex flex-col items-end gap-[0.5vh]">
          <div className="flex items-center gap-[1vw]">
            <span className="text-[#00ffcc]/50 text-[0.8vw] tracking-widest uppercase">SYS.DATE</span>
            <span className="text-[1.5vw] font-bold tracking-widest">{currentDate}</span>
          </div>
          <div className="h-px w-full bg-gradient-to-l from-[#00ffcc] to-transparent"></div>
          <div className="flex items-center gap-[1vw]">
            <span className="text-[#00ffcc]/50 text-[0.8vw] tracking-widest uppercase">HIJRI.CAL</span>
            <span className="text-[1.2vw] font-bold text-white tracking-widest">{currentHijri}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex">
        
        {/* Left Side - Giant Clock & Radar */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Abstract Rotating Rings (Radar) */}
          <div className="absolute w-[45vw] h-[45vw] opacity-20 pointer-events-none flex items-center justify-center">
            <div className="absolute w-full h-full border-[1px] border-[#00ffcc] rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute w-[80%] h-[80%] border-t-[4px] border-[#00ffcc] rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            <div className="absolute w-[60%] h-[60%] border-[2px] border-dashed border-[#00ffcc] rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
            <div className="absolute w-full h-[1px] bg-[#00ffcc] animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute h-full w-[1px] bg-[#00ffcc] animate-spin" style={{ animationDuration: '10s' }}></div>
          </div>

          {/* Huge Digital Clock */}
          <div className="relative z-10 flex flex-col items-center justify-center bg-black/40 p-[3vw] rounded-[2vw] backdrop-blur-md border border-[#00ffcc]/20 shadow-[0_0_50px_rgba(0,255,204,0.1)]">
            <div className="text-[0.8vw] text-[#00ffcc]/70 tracking-[0.5em] mb-[1vh] uppercase">Current Time Coordinates</div>
            <div className="flex items-center text-[14vw] font-black leading-none drop-shadow-[0_0_20px_rgba(0,255,204,0.8)]">
              <span>{format(time, 'HH')}</span>
              <span className={`mx-[1vw] ${pulse ? 'opacity-100' : 'opacity-10'}`}>:</span>
              <span>{format(time, 'mm')}</span>
            </div>
            <div className="mt-[1vh] border-t border-b border-[#00ffcc]/50 py-[1vh] px-[2vw]">
              <span className="text-[2vw] font-bold tracking-[0.5em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                {format(time, 'ss')}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side - Prayer Times Stack */}
        <div className="w-[30%] h-full flex flex-col justify-center px-[3vw] gap-[1.5vh] bg-gradient-to-l from-black/80 to-transparent border-l border-[#00ffcc]/20">
          
          {/* Header indicator */}
          <div className="flex items-center gap-[1vw] mb-[1vh]">
            <div className="h-[1vw] w-[1vw] bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]"></div>
            <span className="tracking-[0.3em] text-[1vw] font-bold">PRAYER_SCHEDULE</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffcc] to-transparent"></div>
          </div>

          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toUpperCase() === prayer.name;
            return (
              <div 
                key={prayer.name} 
                className={`relative flex items-center justify-between p-[1.5vh] transition-all duration-300 border-l-[0.2vw] ${
                  isNext 
                    ? 'bg-[#00ffcc]/20 border-[#00ffcc] shadow-[inset_20px_0_40px_rgba(0,255,204,0.1),_0_0_20px_rgba(0,255,204,0.3)] transform -translate-x-[1vw] scale-[1.02]' 
                    : 'bg-black/40 border-[#00ffcc]/20 hover:bg-[#00ffcc]/5'
                }`}
              >
                {/* Neon decorative corner */}
                <div className="absolute top-0 right-0 w-[1vw] h-[1vw] border-t-2 border-r-2 border-[#00ffcc]/50"></div>
                <div className="absolute bottom-0 left-0 w-[1vw] h-[1vw] border-b-2 border-l-2 border-[#00ffcc]/50"></div>

                <div>
                  <h3 className={`text-[1.5vw] font-black tracking-widest ${isNext ? 'text-white drop-shadow-[0_0_8px_#ffffff]' : 'text-[#00ffcc]/80'}`}>
                    {prayer.name}
                  </h3>
                  {prayer.iqamah && (
                    <div className="flex items-center gap-[0.5vw] mt-[0.5vh]">
                      <span className="w-[0.5vw] h-[0.5vw] rounded-full bg-red-500 animate-pulse"></span>
                      <p className={`text-[0.8vw] tracking-[0.2em] ${isNext ? 'text-red-400 font-bold' : 'text-[#00ffcc]/50'}`}>IQOMAH {prayer.iqamah}</p>
                    </div>
                  )}
                </div>
                <div className={`text-[2vw] font-black tracking-wider ${isNext ? 'text-[#00ffcc] drop-shadow-[0_0_15px_#00ffcc]' : 'text-white/60'}`}>
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom scanning laser effect */}
      <div className="absolute bottom-0 w-full h-[2px] bg-[#00ffcc] shadow-[0_0_20px_#00ffcc] animate-[ping_4s_ease-in-out_infinite]"></div>

    </div>
  );
}
