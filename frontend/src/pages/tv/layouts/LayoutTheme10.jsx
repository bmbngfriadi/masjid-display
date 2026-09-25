import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, MapPin, Calendar } from 'lucide-react';

export default function LayoutTheme10({ 
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
    <div className="w-full h-full flex flex-col justify-between p-[3vh] relative overflow-hidden text-white font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-[2vw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[8vw] h-[8vw] object-contain drop-shadow-2xl" />
          )}
          <div>
            <h1 className="text-[4vh] font-extrabold tracking-wider leading-none drop-shadow-lg">{mosqueProfile.name}</h1>
            <div className="flex items-center gap-2 text-[2vh] opacity-90 mt-1">
              <MapPin size="2vh" />
              <p>{mosqueProfile.address}</p>
            </div>
          </div>
        </div>
        <div className="text-right bg-black/40 backdrop-blur-md px-[3vw] py-[1.5vh] rounded-[2vw] border border-white/10 shadow-2xl">
          <div className="text-[2.5vh] font-bold text-amber-400">{currentHijri}</div>
          <div className="text-[2vh] text-white/90">{format(currentDate, 'EEEE, d MMMM yyyy', { locale: id })}</div>
        </div>
      </div>

      {/* Center Digital Clock Floating */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 animate-fade-in">
        <div className="text-center relative">
          <div className="text-[20vh] font-black tracking-tighter leading-none drop-shadow-[0_1vh_2vh_rgba(0,0,0,0.8)] tabular-nums">
            {format(time, 'HH:mm')}
            <span className="text-[10vh] text-emerald-400 ml-2 animate-pulse">{format(time, 'ss')}</span>
          </div>
          <div className="absolute -inset-[5vw] bg-emerald-500/10 blur-[5vw] rounded-full -z-10 mix-blend-screen"></div>
        </div>
        {nextPrayer && (
          <div className="mt-[2vh] bg-emerald-500/80 backdrop-blur-md px-[4vw] py-[1vh] rounded-full text-[3vh] font-bold shadow-lg flex items-center gap-[1vw]">
            <Clock size="3vh" /> Menuju {nextPrayer.name.toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Horizontal Prayer Times */}
      <div className="w-full bg-black/50 backdrop-blur-xl p-[2vh] rounded-[2vw] border border-white/10 shadow-2xl z-10 flex justify-between">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.id === prayer.id;
          return (
            <div 
              key={prayer.id} 
              className={`flex-1 flex flex-col items-center justify-center py-[2vh] mx-[0.5vw] rounded-[1.5vw] transition-all duration-700
                ${isNext ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 scale-105 shadow-[0_0_2vw_rgba(16,185,129,0.5)]' : 'bg-white/5'}`}
            >
              <span className={`text-[2.5vh] font-medium tracking-widest ${isNext ? 'text-white' : 'text-gray-300'}`}>{prayer.name}</span>
              <span className={`text-[4.5vh] font-bold mt-[0.5vh] ${isNext ? 'text-white' : 'text-emerald-400'}`}>{prayer.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
