import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutTheme11({ 
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

  const secondsDegrees = ((time.getSeconds() / 60) * 360) + 90;
  const minsDegrees = ((time.getMinutes() / 60) * 360) + ((time.getSeconds()/60)*6) + 90;
  const hourDegrees = ((time.getHours() / 12) * 360) + ((time.getMinutes()/60)*30) + 90;

  return (
    <div className="w-full h-full flex p-[4cqh] text-white font-serif relative overflow-hidden bg-gradient-to-br from-black/80 to-black/40">
      {/* Left Panel: Analog Clock & Mosque Info */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center border-r border-white/20 pr-[4cqh]">
        <div className="relative w-[40cqh] h-[40cqh] rounded-full border-[1cqh] border-amber-500/50 shadow-[0_0_5cqh_rgba(245,158,11,0.3)] bg-black/50 backdrop-blur-md flex items-center justify-center">
          {/* Clock numbers */}
          {[12, 3, 6, 9].map((num, i) => (
            <div key={num} className={`absolute text-[3cqh] font-bold text-amber-400
              ${num === 12 ? 'top-[2cqh]' : ''}
              ${num === 3 ? 'right-[2cqh]' : ''}
              ${num === 6 ? 'bottom-[2cqh]' : ''}
              ${num === 9 ? 'left-[2cqh]' : ''}
            `}>{num}</div>
          ))}
          
          {/* Hands */}
          <div className="absolute w-full h-full z-10" style={{ transform: `rotate(${hourDegrees}deg)` }}>
            <div className="absolute top-1/2 left-[30%] w-[20%] h-[1cqh] bg-white rounded-full -translate-y-1/2 origin-right shadow-lg"></div>
          </div>
          <div className="absolute w-full h-full z-20" style={{ transform: `rotate(${minsDegrees}deg)` }}>
            <div className="absolute top-1/2 left-[20%] w-[30%] h-[0.6cqh] bg-gray-300 rounded-full -translate-y-1/2 origin-right shadow-lg"></div>
          </div>
          <div className="absolute w-full h-full z-30" style={{ transform: `rotate(${secondsDegrees}deg)` }}>
            <div className="absolute top-1/2 left-[15%] w-[35%] h-[0.3cqh] bg-red-500 rounded-full -translate-y-1/2 origin-right shadow-lg"></div>
          </div>
          <div className="absolute w-[2cqh] h-[2cqh] rounded-full bg-amber-400 z-40 shadow-lg"></div>
        </div>

        <div className="mt-[6cqh] text-center flex flex-col items-center">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[12cqh] h-[12cqh] object-contain mb-[2cqh] drop-shadow-lg" />
          )}
          <h1 className="text-[5cqh] font-bold text-amber-400 drop-shadow-lg">{mosqueProfile.name}</h1>
          <p className="text-[2.5cqh] text-gray-300 mt-[1cqh]">{mosqueProfile.address}</p>
        </div>
      </div>

      {/* Right Panel: Vertical Timetable */}
      <div className="w-1/2 h-full flex flex-col justify-center pl-[6cqh]">
        <div className="text-right mb-[4cqh]">
          <h2 className="text-[4cqh] font-bold text-white drop-shadow-md">{format(time, 'EEEE, d MMMM yyyy', { locale: id })}</h2>
          <h3 className="text-[3cqh] text-amber-400 font-medium mt-[1cqh]">{currentHijri}</h3>
        </div>

        <div className="space-y-[2.5cqh]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
            return (
              <div 
                key={prayer.id}
                className={`relative flex justify-between items-center px-[4cqw] py-[2.5cqh] rounded-[1cqw] backdrop-blur-md transition-all duration-500 border
                  ${isNext ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_3cqh_rgba(245,158,11,0.2)] border-l-[1cqh] animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-black/40 border-white/10'}`}
              >
                <div className="flex items-center gap-[2cqw]">
                  <span className={`text-[3.5cqh] font-bold tracking-wider ${isNext ? 'text-amber-400 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-300'}`}>
                    {prayer.name}
                  </span>
                  {isNext && <span className="text-[2cqh] bg-red-500 text-white px-[1cqw] py-[0.5cqh] rounded-full font-bold animate-bounce shadow-lg">SELANJUTNYA</span>}
                </div>
                <span className={`text-[4.5cqh] font-black ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-200'}`}>
                  {prayer.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
