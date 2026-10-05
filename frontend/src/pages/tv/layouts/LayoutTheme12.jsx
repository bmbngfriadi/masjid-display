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
    <div className="w-full h-full p-[4cqh] text-white flex flex-col font-mono bg-black/60 relative">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-[4cqh]">
        <div className="bg-white/10 backdrop-blur-md px-[3cqw] py-[2cqh] rounded-[1cqw] border border-white/20 flex items-center gap-[2cqw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[8cqh] h-[8cqh] object-contain drop-shadow-lg" />
          )}
          <div>
            <h1 className="text-[3.5cqh] font-bold text-cyan-400 uppercase tracking-widest">{mosqueProfile.name}</h1>
            <p className="text-[2cqh] text-gray-300 mt-[0.5cqh]">{mosqueProfile.address}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[3cqh] font-bold text-white">{format(time, 'EEEE, dd MMM yyyy', { locale: id })}</div>
          <div className="text-[2.5cqh] text-cyan-400 mt-[0.5cqh]">{currentHijri}</div>
        </div>
      </div>

      {/* Center Flip Clock */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex gap-[2cqw]">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-[0.5cqh] border-gray-700 rounded-[2cqw] p-[4cqw] shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[0.5cqh] bg-black/50 z-10"></div>
            <span className="text-[25cqh] font-black tabular-nums leading-none text-white drop-shadow-md">
              {format(time, 'HH')}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[4cqh]">
            <div className="w-[3cqh] h-[3cqh] bg-cyan-400 rounded-full animate-pulse shadow-[0_0_2cqh_rgba(34,211,238,0.8)]"></div>
            <div className="w-[3cqh] h-[3cqh] bg-cyan-400 rounded-full animate-pulse shadow-[0_0_2cqh_rgba(34,211,238,0.8)] delay-75"></div>
          </div>
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-[0.5cqh] border-gray-700 rounded-[2cqw] p-[4cqw] shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[0.5cqh] bg-black/50 z-10"></div>
            <span className="text-[25cqh] font-black tabular-nums leading-none text-white drop-shadow-md">
              {format(time, 'mm')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-5 gap-[1.5cqw] mt-[4cqh]">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
          return (
            <div 
              key={prayer.id}
              className={`relative flex flex-col items-center justify-center py-[3cqh] rounded-[1cqw] transition-all duration-300
                ${isNext ? 'bg-cyan-500 text-black shadow-[0_0_3cqh_rgba(34,211,238,0.6)] scale-105 border-[0.5cqh] border-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-gray-800/80 border border-gray-700 text-gray-300'}`}
            >
              {isNext && <div className="absolute -top-[2cqh] bg-red-500 text-white text-[1.8cqh] font-bold px-[1cqw] py-[0.5cqh] rounded-full animate-bounce shadow-lg z-10">SELANJUTNYA</div>}
              <div className={`text-[2.5cqh] font-bold tracking-widest ${isNext ? 'text-black/70 animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-400'}`}>
                {prayer.name}
              </div>
              <div className={`text-[5cqh] font-black mt-[1cqh] ${isNext ? 'text-black animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-white'}`}>
                {prayer.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
