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
    if (nextPrayer && nextPrayer.time) {
      const now = new Date();
      // Ensure the time format is valid before parsing
      if (typeof nextPrayer.time === 'string' && nextPrayer.time.includes(':')) {
        const nextTime = parse(nextPrayer.time, 'HH:mm', new Date());
        
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
    <div className="w-full h-full p-[4vh] text-white flex justify-between bg-black/70">
      {/* Left side: Dual Clock & Info */}
      <div className="w-[40%] flex flex-col justify-between">
        <div className="flex items-center gap-[1.5vw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[10vh] h-[10vh] object-contain drop-shadow-lg" />
          )}
          <div>
            <h1 className="text-[4.5vh] font-black text-rose-500 uppercase leading-tight drop-shadow-lg">{mosqueProfile.name}</h1>
            <p className="text-[2vh] text-gray-300 mt-[1vh] font-medium">{mosqueProfile.address}</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-start mt-[4vh]">
          <div className="text-[12vh] font-bold tabular-nums leading-none flex items-baseline">
            {format(time, 'HH:mm')}
            <span className="text-[5vh] text-rose-500 ml-[1vw] animate-pulse">{format(time, 'ss')}</span>
          </div>
          
          <div className="mt-[6vh] relative w-[25vh] h-[25vh] rounded-full border-[0.5vh] border-rose-900/50 bg-black/50 backdrop-blur-sm shadow-[0_0_5vh_rgba(225,29,72,0.3)]">
             {/* Analog Hands */}
             <div className="absolute w-full h-full z-10" style={{ transform: `rotate(${hourDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[30%] w-[20%] h-[0.8vh] bg-white rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-full h-full z-20" style={{ transform: `rotate(${minsDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[20%] w-[30%] h-[0.5vh] bg-rose-200 rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-full h-full z-30" style={{ transform: `rotate(${secondsDegrees}deg)` }}>
              <div className="absolute top-1/2 left-[15%] w-[35%] h-[0.2vh] bg-rose-500 rounded-full -translate-y-1/2 origin-right"></div>
            </div>
            <div className="absolute w-[1.5vh] h-[1.5vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white z-40 shadow-lg"></div>
          </div>
        </div>

        <div>
          <div className="text-[3.5vh] font-bold">{format(currentDate, 'EEEE, dd MMMM yyyy', { locale: id })}</div>
          <div className="text-[2.5vh] text-rose-400 mt-[0.5vh]">{currentHijri}</div>
        </div>
      </div>

      {/* Right side: Circular Progress and Prayers */}
      <div className="w-[55%] flex items-center justify-center relative">
        <div className="absolute w-[85vh] h-[85vh] rounded-full border-[2vh] border-white/5 flex items-center justify-center overflow-hidden bg-black/30 backdrop-blur-md">
           <svg className="w-full h-full -rotate-90 absolute">
             <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2vh" className="text-rose-500/80" strokeDasharray="300%" strokeDashoffset={`${300 - (progress * 3)}%`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
           </svg>
           
           <div className="grid grid-cols-2 gap-y-[4vh] gap-x-[6vw] p-[8vh] z-10">
             {prayers.map((prayer, index) => {
               const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
               return (
                 <div key={prayer.id} className={`flex flex-col relative ${index === 4 ? 'col-span-2 items-center' : ''} ${isNext ? 'scale-110 transition-transform duration-500' : ''}`}>
                   {isNext && <div className="absolute -top-[3vh] left-1/2 -translate-x-1/2 bg-red-500 text-white text-[1.5vh] font-bold px-[1vw] py-[0.5vh] rounded-full animate-bounce shadow-lg whitespace-nowrap">SELANJUTNYA</div>}
                   <div className={`text-[2.5vh] font-bold tracking-widest ${isNext ? 'text-rose-400' : 'text-gray-400'}`}>{prayer.name}</div>
                   <div className={`text-[6vh] font-black leading-none mt-[1vh] ${isNext ? 'text-white drop-shadow-[0_0_2vh_rgba(244,63,94,1)]' : 'text-gray-200'}`}>{prayer.time}</div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
