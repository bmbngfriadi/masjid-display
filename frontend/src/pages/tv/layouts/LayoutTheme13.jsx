import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutTheme13({ 
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
    <div className="w-full h-full flex flex-col p-[4vh] text-white font-sans bg-black/40">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-xl px-[3vw] py-[2vh] rounded-br-[3vw] absolute top-0 left-0 border-r border-b border-indigo-500/30 flex items-center gap-[1.5vw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[7vh] h-[7vh] object-contain drop-shadow-lg" />
          )}
          <div>
            <h1 className="text-[4vh] font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{mosqueProfile.name}</h1>
            <p className="text-[2vh] text-indigo-200 mt-[0.5vh]">{mosqueProfile.address}</p>
          </div>
        </div>
        
        <div className="bg-black/60 backdrop-blur-xl px-[3vw] py-[2vh] rounded-bl-[3vw] absolute top-0 right-0 text-right border-l border-b border-indigo-500/30">
          <div className="text-[2.5vh] font-bold text-white">{format(currentDate, 'EEEE, dd MMMM yyyy', { locale: id })}</div>
          <div className="text-[2vh] text-indigo-300 mt-[0.5vh]">{currentHijri}</div>
        </div>
      </div>

      {/* Center Clock */}
      <div className="flex-1 flex flex-col justify-center items-center mt-[8vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[10vh] rounded-full"></div>
          <div className="text-[22vh] font-light tracking-tighter leading-none relative z-10 flex items-baseline">
            {format(time, 'HH')}
            <span className="text-[15vh] mx-[1vw] animate-pulse text-indigo-400">:</span>
            {format(time, 'mm')}
            <span className="text-[8vh] ml-[1.5vw] text-purple-400 font-bold">{format(time, 'ss')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="flex justify-center mb-[2vh]">
        <div className="flex bg-black/70 backdrop-blur-2xl rounded-[3vw] p-[1vh] border border-white/10 shadow-[0_2vh_5vh_rgba(0,0,0,0.5)]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
            return (
              <div 
                key={prayer.id}
                className={`relative flex flex-col items-center justify-center w-[15vw] py-[2vh] rounded-[2.5vw] transition-all duration-500 mx-[0.5vw]
                  ${isNext ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_3vh_rgba(99,102,241,0.6)] scale-110 -translate-y-[2vh] border-[0.5vh] border-white' : 'hover:bg-white/5'}`}
              >
                {isNext && <div className="absolute -top-[1.5vh] bg-red-500 text-white text-[1.5vh] font-bold px-[1vw] py-[0.5vh] rounded-full animate-bounce shadow-lg z-10">SELANJUTNYA</div>}
                <div className={`text-[2vh] font-bold uppercase tracking-widest ${isNext ? 'text-white/80' : 'text-gray-400'}`}>
                  {prayer.name}
                </div>
                <div className={`text-[4vh] font-bold mt-[0.5vh] ${isNext ? 'text-white' : 'text-gray-200'}`}>
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
