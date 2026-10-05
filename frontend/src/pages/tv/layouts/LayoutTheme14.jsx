import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutTheme14({ 
  time, 
  mosqueProfile, 
  prayerTimes, 
  nextPrayer, 
  currentDate, 
  currentHijri 
}) {
  const prayers = [
    { id: 'fajr', name: 'SUBUH', time: prayerTimes.fajr },
    { id: 'dhuhr', name: 'DZUHUR', time: prayerTimes.dhuhr },
    { id: 'asr', name: 'ASHAR', time: prayerTimes.asr },
    { id: 'maghrib', name: 'MAGHRIB', time: prayerTimes.maghrib },
    { id: 'isha', name: 'ISYA', time: prayerTimes.isha },
  ];

  // Calculate circular progress safely
  let progress = 0;
  try {
    if (nextPrayer && nextPrayer.timeStr) {
      const now = new Date();
      // Ensure the time format is valid before parsing
      if (typeof nextPrayer.timeStr === 'string' && nextPrayer.timeStr.includes(':')) {
        const nextTime = parse(nextPrayer.timeStr, 'HH:mm', new Date());
        
        let prevPrayerIndex = prayers.findIndex(p => p.id === nextPrayer.id) - 1;
        if (prevPrayerIndex < 0) prevPrayerIndex = 4;
        
        if (typeof prayers[prevPrayerIndex].time === 'string' && prayers[prevPrayerIndex].time.includes(':')) {
          let prevTime = parse(prayers[prevPrayerIndex].time, 'HH:mm', new Date());
          
          if (prevPrayerIndex === 4 && nextPrayer.id === 'fajr') {
            prevTime.setDate(prevTime.getDate() - 1);
          }
          if (now > nextTime) {
            nextTime.setDate(nextTime.getDate() + 1);
          }
          
          const totalDuration = nextTime.getTime() - prevTime.getTime();
          const elapsed = now.getTime() - prevTime.getTime();
          if (totalDuration > 0) {
            progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
          }
        }
      }
    }
  } catch (err) {
    console.error('Error calculating progress:', err);
    progress = 0; // Fallback
  }

  const secondsDegrees = ((time.getSeconds() / 60) * 360) + 90;
  const minsDegrees = ((time.getMinutes() / 60) * 360) + ((time.getSeconds()/60)*6) + 90;
  const hourDegrees = ((time.getHours() / 12) * 360) + ((time.getMinutes()/60)*30) + 90;

  return (
    <div className="w-full h-full p-[4cqh] text-white flex justify-between bg-black/70">
      {/* Left side: Dual Clock & Info */}
      <div className="w-[40%] flex flex-col justify-between">
        <div className="flex items-center gap-[1.5cqw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[10cqh] h-[10cqh] object-contain drop-shadow-lg" />
          )}
          <div>
            <h1 className="text-[4.5cqh] font-black text-rose-500 uppercase leading-tight drop-shadow-lg">{mosqueProfile.name}</h1>
            <p className="text-[2cqh] text-gray-300 mt-[1cqh] font-medium">{mosqueProfile.address}</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-start mt-[4cqh]">
          <div className="text-[12cqh] font-bold tabular-nums leading-none flex items-baseline">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
            
          </div>
          
          <div className="mt-[6cqh] relative w-[25cqh] h-[25cqh] rounded-full border-[0.5cqh] border-rose-900/50 bg-black/50 backdrop-blur-sm shadow-[0_0_5cqh_rgba(225,29,72,0.3)]">
             {/* Analog Hands */}
             <div className="absolute w-full h-full z-10" style={{ transform: `rotate(${hourDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[30%] w-[20%] h-[0.8cqh] bg-white rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-full h-full z-20" style={{ transform: `rotate(${minsDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[20%] w-[30%] h-[0.5cqh] bg-rose-200 rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-full h-full z-30" style={{ transform: `rotate(${secondsDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[15%] w-[35%] h-[0.2cqh] bg-rose-500 rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-[1.5cqh] h-[1.5cqh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white z-40 shadow-lg"></div>
          </div>
        </div>

        <div>
          <div className="text-[3.5cqh] font-bold">{format(time, 'EEEE, dd MMMM yyyy', { locale: id })}</div>
          <div className="text-[2.5cqh] text-rose-400 mt-[0.5cqh]">{currentHijri}</div>
        </div>
      </div>

      {/* Right side: Circular Progress and Prayers */}
      <div className="w-[55%] flex items-center justify-center relative">
        <div className="absolute w-[85cqh] h-[85cqh] rounded-full border-[2cqh] border-white/5 flex items-center justify-center overflow-hidden bg-black/30 backdrop-blur-md">
           <svg className="w-full h-full -rotate-90 absolute">
             <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2cqh" className="text-rose-500/80" strokeDasharray="300%" strokeDashoffset={`${300 - (progress * 3)}%`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
           </svg>
           
           <div className="grid grid-cols-2 gap-y-[4cqh] gap-x-[6cqw] p-[8cqh] z-10">
             {prayers.map((prayer, index) => {
               const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
               return (
                 <div key={prayer.id} className={`flex flex-col relative ${index === 4 ? 'col-span-2 items-center' : ''} ${isNext ? 'scale-110 transition-transform duration-500 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : ''}`}>
                   {isNext && <div className="absolute -top-[3cqh] left-1/2 -translate-x-1/2 bg-red-500 text-white text-[1.5cqh] font-bold px-[1cqw] py-[0.5cqh] rounded-full animate-bounce shadow-lg whitespace-nowrap">SELANJUTNYA</div>}
                   <div className={`text-[2.5cqh] font-bold tracking-widest ${isNext ? 'text-rose-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-400'}`}>{prayer.name}</div>
                   <div className={`text-[6cqh] font-black leading-none mt-[1cqh] ${isNext ? 'text-white drop-shadow-[0_0_2cqh_rgba(244,63,94,1)] animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-200'}`}>{prayer.time}</div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
