import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LayoutJumat({ 
  time, 
  mosqueProfile, 
  prayerTimes, 
  nextPrayer, 
  currentDate, 
  currentHijri,
  fridayInfo
}) {
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 xl:p-8 text-white relative z-10 bg-black/60 backdrop-blur-sm animate-fade-in pb-10">
      
      {/* Header: Nama & Logo Masjid, Jam & Kalender */}
      <div className="flex justify-between items-start mb-6 xl:mb-8 shrink-0">
        <div className="flex items-center gap-6">
          {mosqueProfile?.logoUrl ? (
            <img src={mosqueProfile.logoUrl} alt="Logo Masjid" className="w-24 h-24 object-contain drop-shadow-xl" />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-700)] rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 border-4 border-white/20">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          )}
          <div>
            <h1 className="text-3xl xl:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
              {mosqueProfile?.name}
            </h1>
            <p className="text-lg xl:text-xl text-gray-300 mt-1 xl:mt-2 font-medium tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4 xl:w-5 xl:h-5 text-[var(--primary-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {mosqueProfile?.address}
            </p>
          </div>
        </div>

        <div className="text-right bg-white/10 backdrop-blur-md px-6 py-3 xl:px-8 xl:py-4 rounded-3xl border border-white/20 shadow-2xl">
          <div className="text-5xl xl:text-7xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-md">
            {format(time, 'HH:mm')}
            <span className="text-3xl xl:text-4xl text-gray-400 ml-2 animate-pulse">{format(time, 'ss')}</span>
          </div>
          <div className="text-lg xl:text-xl mt-2 xl:mt-3 font-semibold text-[var(--primary-300)] uppercase tracking-widest">
            {format(time, 'EEEE, d MMMM yyyy', { locale: id })}
          </div>
          <div className="text-base xl:text-lg text-gray-300 mt-1 font-medium tracking-wide">
            {currentHijri}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 xl:gap-8 items-stretch pb-4">
        
        {/* Konten Utama Kiri: Petugas Jumat */}
        <div className="col-span-8 flex flex-col h-full min-h-0">
          <div className="bg-gradient-to-br from-[var(--primary-900)]/80 to-black/80 backdrop-blur-md rounded-3xl p-5 xl:p-8 border border-[var(--primary-500)]/30 shadow-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-2 xl:mb-4 border-b border-white/10 pb-2 xl:pb-4 shrink-0">
              <h2 className="text-xl xl:text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                <svg className="w-6 h-6 xl:w-8 xl:h-8 text-[var(--primary-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Info Shalat Jumat
              </h2>
              {nextPrayer?.name === 'DZUHUR' && (
                <div className="bg-white/10 px-3 py-2 xl:px-4 xl:py-2 rounded-2xl border border-white/10">
                  <span className="text-gray-400 text-[10px] xl:text-xs uppercase tracking-wider block mb-0.5">Menuju Waktu Jumat</span>
                  <span className="text-xl xl:text-2xl font-mono font-bold text-[var(--primary-300)]">{nextPrayer.timeStr}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-around gap-2 xl:gap-4 my-1 xl:my-2 pr-2">
              <div className="bg-white/5 rounded-xl p-3 xl:p-5 border border-white/10 flex items-center gap-3 xl:gap-6 shrink-0">
                <div className="w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-[var(--primary-600)] flex items-center justify-center shrink-0 shadow-lg">
                  <svg className="w-6 h-6 xl:w-8 xl:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-gray-400 text-xs xl:text-sm uppercase tracking-widest font-semibold mb-0.5">Khatib</h3>
                  <p className="text-2xl xl:text-4xl font-bold text-white tracking-tight truncate">{fridayInfo?.khatib || 'Menunggu Data'}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 xl:p-5 border border-white/10 flex items-center gap-3 xl:gap-6 shrink-0">
                <div className="w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-blue-600/80 flex items-center justify-center shrink-0 shadow-lg">
                  <svg className="w-6 h-6 xl:w-8 xl:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-gray-400 text-xs xl:text-sm uppercase tracking-widest font-semibold mb-0.5">Imam</h3>
                  <p className="text-xl xl:text-3xl font-bold text-white tracking-tight truncate">{fridayInfo?.imam || 'Menunggu Data'}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 xl:p-5 border border-white/10 flex items-center gap-3 xl:gap-6 shrink-0">
                <div className="w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-orange-600/80 flex items-center justify-center shrink-0 shadow-lg">
                  <svg className="w-6 h-6 xl:w-8 xl:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-gray-400 text-xs xl:text-sm uppercase tracking-widest font-semibold mb-0.5">Muadzin</h3>
                  <p className="text-xl xl:text-3xl font-bold text-white tracking-tight truncate">{fridayInfo?.muadzin || 'Menunggu Data'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-1 xl:mt-2 bg-[var(--primary-600)]/30 border border-[var(--primary-500)]/50 rounded-xl p-3 xl:p-4 flex flex-col items-center justify-center text-center shrink-0">
              <h3 className="text-[var(--primary-200)] text-[10px] xl:text-xs uppercase tracking-[0.3em] font-bold mb-1">Tema Khutbah</h3>
              <p className="text-lg xl:text-2xl font-extrabold text-white leading-tight">"{fridayInfo?.theme || 'Menunggu Data'}"</p>
            </div>
          </div>
        </div>

        {/* Konten Kanan: Kas Masjid & Waktu Sholat */}
        <div className="col-span-4 flex flex-col h-full min-h-0">
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 xl:p-6 border border-white/10 flex flex-col h-full min-h-0 overflow-hidden">
            <h2 className="text-base xl:text-xl font-bold text-white tracking-wider uppercase mb-3 xl:mb-5 flex items-center justify-center gap-2 bg-white/5 py-2 xl:py-3 rounded-xl shrink-0">
              <svg className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Laporan Keuangan
            </h2>
            
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-around gap-2 pr-2">
              <div className="bg-white/5 p-2 xl:p-4 rounded-xl border border-white/10 shrink-0">
                <p className="text-gray-400 text-[10px] xl:text-xs font-semibold uppercase tracking-wider mb-1">Saldo Awal</p>
                <p className="text-xl xl:text-2xl font-bold font-mono text-white truncate">{formatRupiah(fridayInfo?.saldoAwal)}</p>
              </div>
              
              <div className="bg-green-900/20 p-2 xl:p-4 rounded-xl border border-green-500/30 shrink-0">
                <p className="text-green-400 text-[10px] xl:text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 xl:w-4 xl:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Pemasukan / Infaq
                </p>
                <p className="text-xl xl:text-2xl font-bold font-mono text-green-300 truncate">+{formatRupiah(fridayInfo?.pemasukan)}</p>
              </div>
              
              <div className="bg-red-900/20 p-2 xl:p-4 rounded-xl border border-red-500/30 shrink-0">
                <p className="text-red-400 text-[10px] xl:text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 xl:w-4 xl:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  Pengeluaran
                </p>
                <p className="text-xl xl:text-2xl font-bold font-mono text-red-300 truncate">-{formatRupiah(fridayInfo?.pengeluaran)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-900)] p-3 xl:p-5 rounded-xl border border-[var(--primary-400)] shadow-[0_0_20px_rgba(4,120,87,0.4)] mt-1 shrink-0">
                <p className="text-[var(--primary-200)] text-[10px] xl:text-xs font-bold uppercase tracking-widest mb-1">Total Saldo Akhir</p>
                <p className="text-2xl xl:text-3xl font-extrabold font-mono text-white truncate">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
