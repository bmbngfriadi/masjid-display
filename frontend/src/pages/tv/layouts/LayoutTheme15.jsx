import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutTheme15({ 
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
    <div className="w-full h-full flex text-white font-sans overflow-hidden bg-black/60">
      {/* Left Huge Typography Clock */}
      <div className="w-2/3 h-full p-[6vh] flex flex-col justify-between relative">
        <div className="z-10 flex items-center gap-[2vw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[12vh] h-[12vh] object-contain drop-shadow-2xl" />
          )}
          <div>
            <h1 className="text-[6vh] font-black uppercase tracking-tighter leading-none">{mosqueProfile.name}</h1>
            <p className="text-[2.5vh] text-teal-400 mt-[1vh] font-medium">{mosqueProfile.address}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center z-10">
          <div className="text-[25vh] font-black leading-[0.8] tracking-tighter drop-shadow-2xl">
            <div className="text-white">{format(time, 'HH')}</div>
            <div className="text-teal-400 flex items-baseline">
              {format(time, 'mm')}
              <span className="text-[8vh] ml-[2vw] text-white/50">{format(time, 'ss')}</span>
            </div>
          </div>
          <div className="mt-[6vh] text-[4vh] font-bold text-gray-300">
            {format(currentDate, 'EEEE, d MMMM yyyy', { locale: id })} <span className="mx-[1vw] text-teal-500">•</span> {currentHijri}
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[80vh] h-[80vh] bg-teal-600/20 rounded-full blur-[10vh] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[60vh] h-[60vh] bg-emerald-600/20 rounded-full blur-[8vh] -z-10"></div>
      </div>

      {/* Right Side Panel */}
      <div className="w-1/3 h-full bg-white/10 backdrop-blur-2xl border-l border-white/20 p-[4vh] flex flex-col justify-center">
        <div className="space-y-[3vh]">
          {prayers.map((prayer) => {
            const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
            return (
              <div 
                key={prayer.id}
                className={`relative overflow-hidden p-[3vh] rounded-[1.5vw] transition-all duration-500 flex justify-between items-center
                  ${isNext ? 'bg-teal-500 shadow-[0_1vh_3vh_rgba(20,184,166,0.4)] scale-105 border-[0.5vh] border-white' : 'bg-black/40 hover:bg-black/60'}`}
              >
                {isNext && <div className="absolute -top-[1.5vh] left-[2vw] bg-red-500 text-white text-[1.5vh] font-bold px-[1vw] py-[0.5vh] rounded-full animate-bounce shadow-lg z-20">SELANJUTNYA</div>}
                <div className="relative z-10">
                  <div className={`text-[2.5vh] font-bold tracking-wider ${isNext ? 'text-black/70' : 'text-teal-400'}`}>
                    {prayer.name}
                  </div>
                </div>
                <div className={`text-[5vh] font-black relative z-10 ${isNext ? 'text-white' : 'text-gray-100'}`}>
                  {prayer.time}
                </div>
                {isNext && <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
