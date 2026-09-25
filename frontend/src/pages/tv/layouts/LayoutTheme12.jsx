import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutTheme12({ 
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

  return (
    <div className="w-full h-full p-[4vh] text-white flex flex-col font-mono bg-black/60 relative">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-[4vh]">
        <div className="bg-white/10 backdrop-blur-md px-[3vw] py-[2vh] rounded-[1vw] border border-white/20">
          <h1 className="text-[3.5vh] font-bold text-cyan-400 uppercase tracking-widest">{mosqueProfile.name}</h1>
          <p className="text-[2vh] text-gray-300 mt-[0.5vh]">{mosqueProfile.address}</p>
        </div>
        <div className="text-right">
          <div className="text-[3vh] font-bold text-white">{format(currentDate, 'EEEE, dd MMM yyyy', { locale: id })}</div>
          <div className="text-[2.5vh] text-cyan-400 mt-[0.5vh]">{currentHijri}</div>
        </div>
      </div>

      {/* Center Flip Clock */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex gap-[2vw]">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-[0.5vh] border-gray-700 rounded-[2vw] p-[4vw] shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[0.5vh] bg-black/50 z-10"></div>
            <span className="text-[25vh] font-black tabular-nums leading-none text-white drop-shadow-md">
              {format(time, 'HH')}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[4vh]">
            <div className="w-[3vh] h-[3vh] bg-cyan-400 rounded-full animate-pulse shadow-[0_0_2vh_rgba(34,211,238,0.8)]"></div>
            <div className="w-[3vh] h-[3vh] bg-cyan-400 rounded-full animate-pulse shadow-[0_0_2vh_rgba(34,211,238,0.8)] delay-75"></div>
          </div>
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-[0.5vh] border-gray-700 rounded-[2vw] p-[4vw] shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[0.5vh] bg-black/50 z-10"></div>
            <span className="text-[25vh] font-black tabular-nums leading-none text-white drop-shadow-md">
              {format(time, 'mm')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-5 gap-[1.5vw] mt-[4vh]">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.id === prayer.id;
          return (
            <div 
              key={prayer.id}
              className={`flex flex-col items-center justify-center py-[3vh] rounded-[1vw] transition-all duration-300
                ${isNext ? 'bg-cyan-500 text-black shadow-[0_0_3vh_rgba(34,211,238,0.6)] scale-105' : 'bg-gray-800/80 border border-gray-700 text-gray-300'}`}
            >
              <div className={`text-[2.5vh] font-bold tracking-widest ${isNext ? 'text-black/70' : 'text-gray-400'}`}>
                {prayer.name}
              </div>
              <div className={`text-[5vh] font-black mt-[1vh] ${isNext ? 'text-black' : 'text-white'}`}>
                {prayer.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
