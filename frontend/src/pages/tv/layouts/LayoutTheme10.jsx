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
    <div className="w-full h-full flex flex-col justify-between p-[3cqh] relative overflow-hidden text-white font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-[2cqw]">
          {mosqueProfile.logoUrl && (
            <img src={mosqueProfile.logoUrl} alt="Logo" className="w-[8cqw] h-[8cqw] object-contain drop-shadow-2xl" />
          )}
          <div>
            <h1 className="text-[4cqh] font-extrabold tracking-wider leading-none drop-shadow-lg">{mosqueProfile.name}</h1>
            <div className="flex items-center gap-2 text-[2cqh] opacity-90 mt-1">
              <MapPin size="2cqh" />
              <p>{mosqueProfile.address}</p>
            </div>
          </div>
        </div>
        <div className="text-right bg-black/40 backdrop-blur-md px-[3cqw] py-[1.5cqh] rounded-[2cqw] border border-white/10 shadow-2xl">
          <div className="text-[2.5cqh] font-bold text-amber-400">{currentHijri}</div>
          <div className="text-[2cqh] text-white/90">{currentDate}</div>
        </div>
      </div>

      {/* Center Digital Clock Floating */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 animate-fade-in">
        <div className="text-center relative">
          <div className="text-[20cqh] font-black tracking-tighter leading-none drop-shadow-[0_1cqh_2cqh_rgba(0,0,0,0.8)] tabular-nums">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
            
          </div>
          <div className="absolute -inset-[5cqw] bg-emerald-500/10 blur-[5cqw] rounded-full -z-10 mix-blend-screen"></div>
        </div>
        {nextPrayer && (
          <div className="mt-[2cqh] bg-emerald-500/80 backdrop-blur-md px-[4cqw] py-[1cqh] rounded-full text-[3cqh] font-bold shadow-lg flex items-center gap-[1cqw]">
            <Clock size="3cqh" /> Menuju {nextPrayer.name.toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Horizontal Prayer Times */}
      <div className="w-full bg-black/50 backdrop-blur-xl p-[2cqh] rounded-[2cqw] border border-white/10 shadow-2xl z-10 flex justify-between">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.name?.toUpperCase() === prayer.name.toUpperCase();
          return (
              <div 
              key={prayer.id} 
              className={`relative flex-1 flex flex-col items-center justify-center py-[2cqh] mx-[0.5cqw] rounded-[1.5cqw] transition-all duration-700
                ${isNext ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 scale-105 shadow-[0_0_2cqw_rgba(16,185,129,0.5)] border-t-[0.5cqh] border-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'bg-white/5'}`}
            >
              {isNext && <div className="absolute -top-[2cqh] bg-red-500 text-white text-[1.8cqh] font-bold px-[1cqw] py-[0.5cqh] rounded-full animate-bounce shadow-lg z-10">SELANJUTNYA</div>}
              <span className={`text-[2.5cqh] font-medium tracking-widest ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-gray-300'}`}>{prayer.name}</span>
              <span className={`text-[4.5cqh] font-bold mt-[0.5cqh] ${isNext ? 'text-white animate-pulse transform scale-105 shadow-xl shadow-yellow-500/20 ' : 'text-emerald-400'}`}>{prayer.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
