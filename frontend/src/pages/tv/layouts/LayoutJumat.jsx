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
  fridayInfo,
  jumatLayoutStyle = 'jumat_1'
}) {
  const formatRupiah = (angka) => {
    try {
      let num = Number(angka);
      if (isNaN(num)) num = 0;
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(num);
    } catch (e) {
      return "Rp 0";
    }
  };

  const commonData = { time, mosqueProfile, prayerTimes, nextPrayer, currentDate, currentHijri, fridayInfo, formatRupiah };

  switch (jumatLayoutStyle) {
    case 'jumat_2': return <JumatLayout2 {...commonData} />;
    case 'jumat_3': return <JumatLayout3 {...commonData} />;
    case 'jumat_4': return <JumatLayout4 {...commonData} />;
    case 'jumat_5': return <JumatLayout5 {...commonData} />;
    case 'jumat_6': return <JumatLayout6 {...commonData} />;
    case 'jumat_7': return <JumatLayout7 {...commonData} />;
    case 'jumat_8': return <JumatLayout8 {...commonData} />;
    case 'jumat_9': return <JumatLayout9 {...commonData} />;
    case 'jumat_10': return <JumatLayout10 {...commonData} />;
    case 'jumat_1':
    default: return <JumatLayout1 {...commonData} />;
  }
}

// Reusable Logo Component
const LogoArea = ({ mosqueProfile, className = "w-[12cqh] h-[12cqh]" }) => {
  if (mosqueProfile?.logoUrl) {
    return <img src={mosqueProfile.logoUrl} alt="Logo Masjid" className={`${className} object-contain drop-shadow-xl shrink-0`} />;
  }
  return (
    <div className={`${className} bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-700)] rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 border-[0.4cqh] border-white/20 shrink-0`}>
      <svg className="w-1/2 h-1/2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    </div>
  );
};


// ================= LAYOUT 1: SIGNATURE =================
function JumatLayout1({ time, mosqueProfile, currentHijri, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[3cqh] text-white relative z-10 bg-black/60 backdrop-blur-md animate-fade-in pb-[5cqh] overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-[3cqh] shrink-0 h-[15cqh]">
        <div className="flex items-center gap-[2cqw]">
          <LogoArea mosqueProfile={mosqueProfile} className="w-[12cqh] h-[12cqh]" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[5cqh] leading-tight font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg break-words leading-tight drop-shadow-md max-w-[50cqw]">
              {mosqueProfile?.name}
            </h1>
            <p className="text-[2.5cqh] text-gray-300 font-medium tracking-wide break-words leading-tight drop-shadow-md max-w-[50cqw]">
              {mosqueProfile?.address}
            </p>
          </div>
        </div>
        <div className="text-right bg-white/10 px-[2cqw] py-[1.5cqh] rounded-[2cqh] border border-white/20 shadow-2xl flex flex-col justify-center">
          <div className="text-[7cqh] leading-none font-bold font-mono text-white">
            {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
            
          </div>
          <div className="text-[2.2cqh] mt-[0.5cqh] font-semibold text-[var(--primary-300)] uppercase">
            {format(time, 'EEEE, d MMMM yyyy', { locale: id })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-[2cqw] items-stretch">
        <div className="col-span-8 flex flex-col min-h-0 bg-gradient-to-br from-[var(--primary-900)]/80 to-black/80 rounded-[3cqh] p-[3cqh] border border-[var(--primary-500)]/30 shadow-2xl">
          <h2 className="text-[3.5cqh] font-black text-white uppercase mb-[2cqh] border-b border-white/10 pb-[1.5cqh] shrink-0">Petugas Jumat</h2>
          
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-[2cqh]">
            <div className="bg-white/5 rounded-[2cqh] p-[2cqh] border border-white/10 flex items-center gap-[2cqw] shrink-0">
              <div className="w-[10cqh] h-[10cqh] rounded-full bg-[var(--primary-600)] flex items-center justify-center shrink-0">
                <svg className="w-[5cqh] h-[5cqh] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-gray-400 text-[2.2cqh] uppercase tracking-widest font-bold mb-[0.5cqh]">Khatib</h3>
                <p className="text-[5.5cqh] leading-none font-bold text-white tracking-tight break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
              </div>
            </div>
            
            <div className="flex gap-[2cqw] shrink-0 h-[14cqh]">
              <div className="flex-1 bg-white/5 rounded-[2cqh] p-[2cqh] border border-white/10 flex flex-col justify-center min-w-0">
                <h3 className="text-gray-400 text-[2cqh] uppercase tracking-widest font-bold mb-[0.5cqh]">Imam</h3>
                <p className="text-[4cqh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-[2cqh] p-[2cqh] border border-white/10 flex flex-col justify-center min-w-0">
                <h3 className="text-gray-400 text-[2cqh] uppercase tracking-widest font-bold mb-[0.5cqh]">Muadzin</h3>
                <p className="text-[4cqh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 bg-[var(--primary-600)]/30 border border-[var(--primary-500)]/50 rounded-[2cqh] p-[2cqh] flex flex-col items-center justify-center text-center">
              <h3 className="text-[var(--primary-200)] text-[2cqh] uppercase tracking-[0.3em] font-bold mb-[1cqh]">Tema Khutbah</h3>
              <p className="text-[4.5cqh] font-extrabold text-white leading-tight line-clamp-2 px-[2cqw]">"{fridayInfo?.theme || '-'}"</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col min-h-0 bg-black/40 rounded-[3cqh] p-[3cqh] border border-white/10">
          <h2 className="text-[2.8cqh] font-bold text-white tracking-wider uppercase mb-[2cqh] text-center bg-white/5 py-[1.5cqh] rounded-[1.5cqh] shrink-0">Laporan Kas</h2>
          
          <div className="flex-1 min-h-0 flex flex-col justify-around gap-[1.5cqh]">
            <div className="bg-white/5 p-[2cqh] rounded-[1.5cqh] border border-white/10 flex-1 flex flex-col justify-center">
              <p className="text-gray-400 text-[1.8cqh] uppercase mb-[0.5cqh] font-bold">Saldo Awal</p>
              <p className="text-[3.5cqh] leading-none font-bold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
            </div>
            <div className="bg-green-900/20 p-[2cqh] rounded-[1.5cqh] border border-green-500/30 flex-1 flex flex-col justify-center">
              <p className="text-green-400 text-[1.8cqh] uppercase mb-[0.5cqh] font-bold">Pemasukan</p>
              <p className="text-[3.5cqh] leading-none font-bold font-mono text-green-300 break-words leading-tight drop-shadow-md">+{formatRupiah(fridayInfo?.pemasukan)}</p>
            </div>
            <div className="bg-red-900/20 p-[2cqh] rounded-[1.5cqh] border border-red-500/30 flex-1 flex flex-col justify-center">
              <p className="text-red-400 text-[1.8cqh] uppercase mb-[0.5cqh] font-bold">Pengeluaran</p>
              <p className="text-[3.5cqh] leading-none font-bold font-mono text-red-300 break-words leading-tight drop-shadow-md">-{formatRupiah(fridayInfo?.pengeluaran)}</p>
            </div>
            <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-900)] p-[2.5cqh] rounded-[2cqh] border border-[var(--primary-400)] shrink-0 shadow-lg flex flex-col justify-center h-[14cqh]">
              <p className="text-[var(--primary-200)] text-[1.8cqh] font-bold uppercase mb-[0.5cqh]">Saldo Akhir</p>
              <p className="text-[4.5cqh] leading-none font-extrabold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 2: MINIMALIST =================
function JumatLayout2({ mosqueProfile, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[4cqh] text-white relative z-10 bg-black/85 animate-fade-in overflow-hidden">
      <div className="absolute top-[4cqh] left-[4cqw] flex items-center gap-[2cqw]">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[14cqh] h-[14cqh]" />
        <h1 className="text-[4.5cqh] font-black text-white uppercase tracking-wider">{mosqueProfile?.name}</h1>
      </div>
      
      <div className="text-center mt-[4cqh] mb-[6cqh] shrink-0">
        <div className="inline-block bg-[var(--primary-500)] text-white px-[4cqw] py-[1.5cqh] rounded-full text-[4cqh] font-bold tracking-widest uppercase shadow-lg">Shalat Jumat</div>
      </div>
      
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-[6cqw] max-w-[90cqw] mx-auto w-full">
        <div className="flex flex-col gap-[4cqh] justify-center min-w-0">
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5cqh] uppercase tracking-widest mb-[1cqh] font-bold">Khatib</h3>
            <p className="text-[7.5cqh] leading-tight font-black text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5cqh] uppercase tracking-widest mb-[1cqh] font-bold">Imam</h3>
            <p className="text-[5.5cqh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5cqh] uppercase tracking-widest mb-[1cqh] font-bold">Muadzin</h3>
            <p className="text-[5.5cqh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-[3cqh] justify-center bg-white/5 rounded-[4cqh] p-[4cqh] border border-white/10 min-w-0 h-full">
          <div className="text-center mb-[2cqh] border-b border-white/20 pb-[3cqh] shrink-0">
            <h3 className="text-gray-400 text-[2.5cqh] uppercase tracking-widest font-bold mb-[1.5cqh]">Tema Khutbah</h3>
            <p className="text-[4.5cqh] leading-tight font-extrabold text-[var(--primary-400)] line-clamp-3">"{fridayInfo?.theme || '-'}"</p>
          </div>
          <div className="grid grid-cols-2 gap-[3cqh] flex-1 min-h-0 items-center">
            <div className="min-w-0">
              <p className="text-gray-400 text-[2cqh] uppercase tracking-wider mb-[1cqh] font-bold">Kas Awal</p>
              <p className="text-[4cqh] leading-none font-bold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[var(--primary-400)] text-[2cqh] uppercase tracking-wider font-bold mb-[1cqh]">Saldo Akhir</p>
              <p className="text-[5cqh] leading-none font-black font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 3: CLASSIC =================
function JumatLayout3({ mosqueProfile, currentHijri, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[4cqh] text-yellow-50 relative z-10 bg-emerald-950/95 animate-fade-in border-[2cqh] border-double border-yellow-600/50 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/masjid/pattern.png')] bg-cover mix-blend-overlay"></div>
      
      <div className="relative z-10 text-center mb-[4cqh] border-b-[0.4cqh] border-yellow-600/50 pb-[3cqh] flex justify-center items-center gap-[2cqw] shrink-0">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[15cqh] h-[15cqh] border-yellow-500 border-4 rounded-full p-[0.5cqh] bg-white" />
        <div className="flex flex-col justify-center">
           <h1 className="text-[6cqh] leading-tight font-bold text-yellow-500 font-serif tracking-wide break-words leading-tight drop-shadow-md max-w-[60cqw]">{mosqueProfile?.name}</h1>
           <p className="text-[3cqh] text-yellow-200 mt-[1cqh] font-serif font-medium">{currentHijri}</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-2 gap-[4cqw]">
        <div className="bg-black/50 border-2 border-yellow-600/50 p-[4cqh] rounded-[3cqh] flex flex-col justify-between items-center text-center min-w-0">
          <div className="w-full min-w-0">
            <h3 className="text-yellow-600 text-[2.5cqh] uppercase tracking-[0.4em] font-bold mb-[1.5cqh]">Khatib</h3>
            <p className="text-[6cqh] leading-tight font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="w-full h-[0.2cqh] bg-gradient-to-r from-transparent via-yellow-600/80 to-transparent my-[2cqh]"></div>
          <div className="w-full min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-yellow-600 text-[2.5cqh] uppercase tracking-[0.4em] font-bold mb-[1.5cqh]">Tema Khutbah</h3>
            <p className="text-[4cqh] leading-snug font-bold text-yellow-400 italic line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
          <div className="w-full h-[0.2cqh] bg-gradient-to-r from-transparent via-yellow-600/80 to-transparent my-[2cqh]"></div>
          <div className="flex w-full justify-around shrink-0">
            <div className="min-w-0 w-[40%]">
              <h3 className="text-yellow-600 text-[2cqh] uppercase tracking-[0.2em] font-bold mb-[1cqh]">Imam</h3>
              <p className="text-[4cqh] leading-tight font-serif text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="min-w-0 w-[40%]">
              <h3 className="text-yellow-600 text-[2cqh] uppercase tracking-[0.2em] font-bold mb-[1cqh]">Muadzin</h3>
              <p className="text-[4cqh] leading-tight font-serif text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/50 border-2 border-yellow-600/50 p-[4cqh] rounded-[3cqh] flex flex-col min-h-0">
          <h2 className="text-[4cqh] font-serif text-yellow-500 text-center mb-[4cqh] border-b-2 border-yellow-600/50 pb-[2cqh] shrink-0">Laporan Kas</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-[2cqh] border-b border-white/10">
              <span className="text-[3cqh] text-gray-300">Saldo Awal</span>
              <span className="text-[4cqh] font-mono text-white">{formatRupiah(fridayInfo?.saldoAwal)}</span>
            </div>
            <div className="flex justify-between items-center pb-[2cqh] border-b border-white/10">
              <span className="text-[3cqh] text-gray-300">Pemasukan</span>
              <span className="text-[4cqh] font-mono text-emerald-400">+{formatRupiah(fridayInfo?.pemasukan)}</span>
            </div>
            <div className="flex justify-between items-center pb-[2cqh] border-b border-white/10">
              <span className="text-[3cqh] text-gray-300">Pengeluaran</span>
              <span className="text-[4cqh] font-mono text-red-400">-{formatRupiah(fridayInfo?.pengeluaran)}</span>
            </div>
            <div className="flex justify-between items-center pt-[2cqh] bg-yellow-900/30 p-[2cqh] rounded-[2cqh] mt-[2cqh] border border-yellow-600/40">
              <span className="text-[3.5cqh] font-bold text-yellow-500">Saldo Akhir</span>
              <span className="text-[5.5cqh] font-bold font-mono text-yellow-400">{formatRupiah(fridayInfo?.saldoAkhir)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 4: ULTRA WIDE =================
function JumatLayout4({ mosqueProfile, currentDate, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col text-white relative z-10 bg-gradient-to-b from-blue-950 to-black animate-fade-in overflow-hidden">
      <div className="w-full bg-black/60 py-[2cqh] px-[4cqw] flex justify-between items-center border-b-4 border-blue-500 shrink-0 h-[12cqh]">
        <div className="flex items-center gap-[1.5cqw] min-w-0">
           <LogoArea mosqueProfile={mosqueProfile} className="w-[8cqh] h-[8cqh]" />
           <h1 className="text-[4cqh] font-extrabold text-blue-200 uppercase tracking-widest break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
        </div>
        <div className="text-[3cqh] font-bold text-blue-300 tracking-wider shrink-0">{currentDate}</div>
      </div>
      
      <div className="flex-1 min-h-0 flex px-[4cqw] py-[4cqh] items-stretch justify-between gap-[4cqw]">
        <div className="w-1/2 flex flex-col gap-[3cqh] min-w-0">
          <div className="flex-1 min-h-0 bg-white/5 p-[4cqh] rounded-[3cqh] border-l-8 border-blue-500 backdrop-blur flex flex-col justify-center min-w-0">
            <h3 className="text-blue-400 text-[2.5cqh] font-bold uppercase tracking-widest mb-[1cqh]">Khatib</h3>
            <p className="text-[6.5cqh] leading-tight font-black text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="flex-1 min-h-0 bg-white/5 p-[4cqh] rounded-[3cqh] border-l-8 border-emerald-500 backdrop-blur flex flex-col justify-center min-w-0">
            <h3 className="text-emerald-400 text-[2.5cqh] font-bold uppercase tracking-widest mb-[1cqh]">Tema Khutbah</h3>
            <p className="text-[4.5cqh] leading-tight font-bold text-white line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
        </div>
        
        <div className="w-1/2 grid grid-cols-2 gap-[2cqh] bg-black/50 p-[4cqh] rounded-[4cqh] border border-white/10 h-full min-w-0">
          <div className="col-span-2 text-center flex items-center justify-center shrink-0 h-[8cqh]">
            <h2 className="text-[3.5cqh] text-gray-400 tracking-widest uppercase font-black">Keuangan Kas</h2>
          </div>
          <div className="bg-white/5 p-[3cqh] rounded-[2cqh] text-center flex flex-col justify-center min-w-0">
            <p className="text-gray-400 text-[2cqh] mb-[1cqh] font-bold">Saldo Awal</p>
            <p className="text-[4cqh] font-mono font-bold break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
          </div>
          <div className="bg-green-900/20 p-[3cqh] rounded-[2cqh] border border-green-500/20 text-center flex flex-col justify-center min-w-0">
            <p className="text-green-400 text-[2cqh] mb-[1cqh] font-bold">Infaq Jumat</p>
            <p className="text-[4cqh] font-mono font-bold text-green-400 break-words leading-tight drop-shadow-md">+{formatRupiah(fridayInfo?.pemasukan)}</p>
          </div>
          <div className="bg-red-900/20 p-[3cqh] rounded-[2cqh] border border-red-500/20 text-center flex flex-col justify-center min-w-0">
            <p className="text-red-400 text-[2cqh] mb-[1cqh] font-bold">Pengeluaran</p>
            <p className="text-[4cqh] font-mono font-bold text-red-400 break-words leading-tight drop-shadow-md">-{formatRupiah(fridayInfo?.pengeluaran)}</p>
          </div>
          <div className="bg-blue-900/40 p-[3cqh] rounded-[2cqh] border border-blue-500/50 text-center flex flex-col justify-center min-w-0">
            <p className="text-blue-300 text-[2cqh] font-bold mb-[1cqh] uppercase">Saldo Akhir</p>
            <p className="text-[4.5cqh] font-mono font-black text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 5: SIMPLICITY =================
function JumatLayout5({ mosqueProfile, time, fridayInfo, formatRupiah, prayerTimes }) {
  return (
    <div className="w-full h-full flex flex-col p-[6cqh] text-white relative z-10 bg-black/90 animate-fade-in overflow-hidden">
      <div className="flex justify-between items-end border-b-4 border-[var(--primary-500)] pb-[3cqh] mb-[6cqh] shrink-0 h-[20cqh]">
        <div className="flex items-center gap-[2cqw] min-w-0">
          <LogoArea mosqueProfile={mosqueProfile} className="w-[14cqh] h-[14cqh]" />
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-[1cqw] mb-[0.5cqh]">
              <h2 className="text-[3cqh] text-[var(--primary-500)] font-bold tracking-widest uppercase">Informasi Shalat Jumat</h2>
              {prayerTimes?.dhuhr && (
                <div className="bg-[var(--primary-600)]/80 text-white px-[1cqw] py-[0.3cqh] rounded-full text-[2cqh] font-bold tracking-wider border border-[var(--primary-500)]/50">
                  Adzan: {prayerTimes.dhuhr}
                </div>
              )}
            </div>
            <h1 className="text-[6cqh] leading-none font-black break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
          </div>
        </div>
        <div className="text-[10cqh] leading-none font-mono font-black text-gray-200 shrink-0 flex items-baseline">
          {format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span>
          
        </div>
      </div>
      
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-[6cqw]">
        <div className="flex flex-col justify-between min-w-0 py-[2cqh]">
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[3cqh] font-bold mb-[1cqh] uppercase">Khatib</h3>
            <p className="text-[7.5cqh] leading-none font-black break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-[2cqw] min-w-0">
            <div className="min-w-0">
              <h3 className="text-gray-400 text-[2.5cqh] font-bold mb-[1cqh] uppercase">Imam</h3>
              <p className="text-[4.5cqh] leading-tight font-bold break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="min-w-0">
              <h3 className="text-gray-400 text-[2.5cqh] font-bold mb-[1cqh] uppercase">Muadzin</h3>
              <p className="text-[4.5cqh] leading-tight font-bold break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-[var(--primary-400)] text-[3cqh] font-bold mb-[1cqh] uppercase">Tema Khutbah</h3>
            <p className="text-[4.5cqh] leading-tight font-bold italic line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-center min-w-0">
          <div className="bg-white/10 rounded-[4cqh] p-[5cqh] flex flex-col justify-between h-full">
            <h2 className="text-[4.5cqh] font-black text-center border-b-2 border-white/20 pb-[2cqh] shrink-0">Laporan Keuangan</h2>
            <div className="flex justify-between items-center min-w-0 py-[1.5cqh]">
              <span className="text-[3cqh] text-gray-300">Saldo Awal</span>
              <span className="text-[4.5cqh] font-mono font-bold break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</span>
            </div>
            <div className="flex justify-between items-center min-w-0 py-[1.5cqh]">
              <span className="text-[3cqh] text-gray-300">Pemasukan</span>
              <span className="text-[4.5cqh] font-mono font-bold text-emerald-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.pemasukan)}</span>
            </div>
            <div className="flex justify-between items-center min-w-0 py-[1.5cqh]">
              <span className="text-[3cqh] text-gray-300">Pengeluaran</span>
              <span className="text-[4.5cqh] font-mono font-bold text-red-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.pengeluaran)}</span>
            </div>
            <div className="flex justify-between items-center pt-[3cqh] border-t-2 border-white/20 mt-auto min-w-0">
              <span className="text-[4cqh] font-black text-[var(--primary-400)]">Saldo Akhir</span>
              <span className="text-[6.5cqh] font-mono font-black break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 6: BOLD & CLEAR =================
function JumatLayout6({ mosqueProfile, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[5cqh] text-white relative z-10 bg-[#0f172a] animate-fade-in overflow-hidden">
      <div className="flex items-center gap-[2cqw] justify-center bg-white/10 p-[3cqh] rounded-[3cqh] mb-[4cqh] border border-white/20 shrink-0 h-[18cqh]">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[12cqh] h-[12cqh]" />
        <h1 className="text-[6cqh] font-black uppercase text-center tracking-widest text-emerald-400 drop-shadow-lg break-words leading-tight drop-shadow-md max-w-[70cqw]">{mosqueProfile?.name}</h1>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col gap-[4cqh]">
        <div className="flex-1 min-h-0 bg-slate-800/80 rounded-[4cqh] border-4 border-slate-600 flex flex-col items-center justify-center p-[4cqh] shadow-2xl min-w-0">
           <h3 className="text-[3.5cqh] text-slate-400 uppercase font-black tracking-[0.3em] mb-[2cqh]">Khatib Shalat Jumat</h3>
           <p className="text-[10cqh] leading-none font-black text-white text-center drop-shadow-2xl break-words leading-tight drop-shadow-md w-full px-[2cqw]">{fridayInfo?.khatib || '-'}</p>
        </div>
        
        <div className="h-[35%] shrink-0 grid grid-cols-2 gap-[4cqw] min-min-h-0">
           <div className="bg-slate-800/80 rounded-[4cqh] border-4 border-slate-600 flex flex-col items-center justify-center p-[4cqh] min-w-0">
              <h3 className="text-[3cqh] text-emerald-400 uppercase font-black tracking-widest mb-[2cqh]">Tema Khutbah</h3>
              <p className="text-[4.5cqh] font-bold text-center italic text-white leading-tight line-clamp-2 px-[2cqw]">"{fridayInfo?.theme || '-'}"</p>
           </div>
           <div className="bg-emerald-900/20 rounded-[4cqh] border-4 border-emerald-600/50 flex flex-col items-center justify-center p-[4cqh] min-w-0">
              <h3 className="text-[3cqh] text-emerald-300 uppercase font-black tracking-widest mb-[2cqh]">Saldo Kas Masjid</h3>
              <p className="text-[6.5cqh] leading-none font-black font-mono text-emerald-400 break-words leading-tight drop-shadow-md max-w-full px-[2cqw]">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 7: ELEGANT GOLD =================
function JumatLayout7({ mosqueProfile, fridayInfo, formatRupiah, time }) {
  return (
    <div className="w-full h-full flex flex-col text-white relative z-10 bg-black animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/30 to-black/90 mix-blend-screen"></div>
      
      <div className="flex justify-between items-center w-full px-[5cqw] py-[3cqh] border-b-2 border-yellow-700/50 relative z-10 bg-black/60 shrink-0 h-[16cqh]">
         <div className="flex items-center gap-[2cqw] min-w-0">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[12cqh] h-[12cqh] p-[1cqh] bg-yellow-900/40 rounded-full border border-yellow-600" />
            <h1 className="text-[5cqh] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
         </div>
         <div className="text-[6cqh] font-mono text-yellow-500 font-bold shrink-0">{format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span></div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-[5cqh] gap-[5cqh] min-h-0">
         <div className="text-center w-full min-w-0">
            <h3 className="text-[3.5cqh] text-yellow-600/80 uppercase font-serif tracking-[0.5em] mb-[2cqh]">Khatib Jumat</h3>
            <p className="text-[8.5cqh] font-serif font-bold text-yellow-100 drop-shadow-[0_0_2cqh_rgba(202,138,4,0.5)] leading-none break-words leading-tight drop-shadow-md px-[4cqw]">{fridayInfo?.khatib || '-'}</p>
         </div>
         <div className="w-[60cqw] h-[0.2cqh] bg-gradient-to-r from-transparent via-yellow-600 to-transparent shrink-0"></div>
         <div className="text-center w-full min-w-0">
            <h3 className="text-[3cqh] text-yellow-600/80 uppercase font-serif tracking-[0.5em] mb-[2cqh]">Tema Khutbah</h3>
            <p className="text-[5cqh] font-serif font-medium text-yellow-300 italic leading-tight line-clamp-2 px-[4cqw]">"{fridayInfo?.theme || '-'}"</p>
         </div>
      </div>
      
      <div className="h-[20cqh] bg-gradient-to-t from-yellow-900/50 to-transparent relative z-10 flex justify-around items-center px-[4cqw] shrink-0 border-t border-yellow-900/30">
         <div className="text-center min-w-0 flex-1 px-[2cqw]">
            <p className="text-yellow-600 uppercase tracking-widest text-[2.5cqh] mb-[1cqh] font-bold">Imam</p>
            <p className="text-[4.5cqh] font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
         </div>
         <div className="text-center min-w-0 flex-1 px-[2cqw]">
            <p className="text-yellow-600 uppercase tracking-widest text-[2.5cqh] mb-[1cqh] font-bold">Muadzin</p>
            <p className="text-[4.5cqh] font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
         </div>
         <div className="text-center min-w-0 flex-1 px-[2cqw] bg-yellow-900/30 py-[2cqh] rounded-[2cqh] border border-yellow-600/30">
            <p className="text-yellow-500 uppercase tracking-widest text-[2.5cqh] mb-[1cqh] font-bold">Saldo Akhir</p>
            <p className="text-[5cqh] font-mono font-bold text-yellow-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 8: MODERN SPLIT =================
function JumatLayout8({ mosqueProfile, fridayInfo, formatRupiah, time, currentDate }) {
  return (
    <div className="w-full h-full flex text-white relative z-10 bg-black animate-fade-in overflow-hidden">
      <div className="w-1/3 bg-[var(--primary-900)] flex flex-col justify-between p-[4cqh] border-r-[1cqw] border-[var(--primary-500)] shadow-[2cqw_0_3cqw_rgba(0,0,0,0.8)] z-20 min-w-0">
         <div className="flex flex-col items-center text-center gap-[3cqh] mt-[4cqh] min-w-0">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[18cqh] h-[18cqh] bg-white p-[1cqh] rounded-[3cqh] shadow-2xl shrink-0" />
            <h1 className="text-[4.5cqh] leading-tight font-black uppercase text-white mt-[2cqh]">{mosqueProfile?.name}</h1>
         </div>
         <div className="text-center mb-[4cqh] shrink-0">
            <p className="text-[9cqh] font-mono font-black mb-[1cqh] leading-none">{format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span></p>
            <p className="text-[2.5cqh] text-[var(--primary-200)] font-bold uppercase">{currentDate}</p>
         </div>
      </div>
      
      <div className="w-2/3 flex flex-col p-[6cqh] gap-[4cqh] justify-center bg-[url('/masjid/mosque_bg.png')] bg-cover bg-center relative min-w-0">
         <div className="absolute inset-0 bg-black/85"></div>
         <div className="relative z-10 bg-white/10 backdrop-blur-xl p-[5cqh] rounded-[4cqh] border border-white/20 shadow-2xl min-w-0">
            <h3 className="text-[3cqh] text-[var(--primary-400)] uppercase font-black tracking-widest mb-[1.5cqh]">Khatib Jumat</h3>
            <p className="text-[7.5cqh] font-black text-white leading-none mb-[4cqh] break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
            
            <h3 className="text-[2.5cqh] text-[var(--primary-400)] uppercase font-black tracking-widest mb-[1.5cqh]">Tema</h3>
            <p className="text-[4.5cqh] font-bold text-white italic leading-tight line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
         </div>
         
         <div className="relative z-10 grid grid-cols-2 gap-[3cqw] h-[30cqh] shrink-0">
            <div className="bg-white/10 backdrop-blur-xl p-[4cqh] rounded-[3cqh] border border-white/20 flex flex-col justify-center min-w-0">
               <h3 className="text-[2.5cqh] text-gray-400 uppercase font-black tracking-widest mb-[1.5cqh]">Imam Utama</h3>
               <p className="text-[5cqh] font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-xl p-[4cqh] rounded-[3cqh] border border-emerald-500/50 flex flex-col justify-center min-w-0">
               <h3 className="text-[2.5cqh] text-emerald-400 uppercase font-black tracking-widest mb-[1.5cqh]">Total Kas</h3>
               <p className="text-[5.5cqh] font-mono font-black text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 9: FOCUSED VIEW =================
function JumatLayout9({ mosqueProfile, fridayInfo, time }) {
  return (
    <div className="w-full h-full flex flex-col text-white relative z-10 bg-black animate-fade-in justify-center items-center p-[6cqh] overflow-hidden">
      <div className="absolute top-[5cqh] left-[4cqw] flex items-center gap-[1.5cqw] max-w-[60cqw]">
         <LogoArea mosqueProfile={mosqueProfile} className="w-[10cqh] h-[10cqh]" />
         <h1 className="text-[3.5cqh] font-bold text-gray-400 tracking-widest uppercase break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
      </div>
      <div className="absolute top-[5cqh] right-[4cqw] text-[6cqh] font-mono font-bold text-gray-400">{format(time, 'HH')}<span className="animate-[pulse_1s_ease-in-out_infinite] opacity-80">:</span>{format(time, 'mm')}<span className="text-[0.6em] ml-[0.5cqw] opacity-80 animate-pulse text-yellow-300">{format(time, 'ss')}</span></div>
      
      <div className="text-center w-full max-w-[80cqw] mt-[4cqh] flex flex-col items-center min-h-0">
         <div className="inline-block border-2 border-[var(--primary-500)] text-[var(--primary-400)] px-[3cqw] py-[1cqh] rounded-full text-[2.5cqh] font-bold tracking-[0.3em] uppercase mb-[4cqh] shrink-0">
            Informasi Khutbah
         </div>
         <div className="w-full min-w-0 mb-[6cqh] shrink-0">
            <h3 className="text-[3.5cqh] text-gray-500 uppercase font-black tracking-[0.4em] mb-[1.5cqh]">Khatib</h3>
            <p className="text-[9cqh] font-black text-white leading-none drop-shadow-[0_1cqh_2cqh_rgba(16,185,129,0.3)] break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
         </div>
         
         <div className="bg-white/5 border border-white/10 rounded-[4cqh] p-[5cqh] backdrop-blur w-full max-w-[60cqw] min-w-0">
            <h3 className="text-[3cqh] text-[var(--primary-500)] uppercase font-black tracking-widest mb-[2cqh]">Tema Khutbah</h3>
            <p className="text-[4.5cqh] font-bold text-gray-200 leading-tight italic line-clamp-3">"{fridayInfo?.theme || '-'}"</p>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 10: PREMIUM DARK =================
function JumatLayout10({ mosqueProfile, fridayInfo, formatRupiah, currentHijri }) {
  return (
    <div className="w-full h-full flex flex-col p-[5cqh] text-white relative z-10 bg-[#0a0a0a] animate-fade-in overflow-hidden">
      <div className="flex justify-between items-center mb-[6cqh] shrink-0 h-[15cqh]">
         <div className="flex items-center gap-[2cqw] min-w-0 w-[65%]">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[14cqh] h-[14cqh] p-[1cqh] bg-white/5 rounded-[2cqh] border border-white/10 shadow-2xl shrink-0" />
            <div className="min-w-0">
               <h1 className="text-[4.5cqh] font-black text-white uppercase tracking-wider mb-[1cqh] break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
               <p className="text-[2.5cqh] text-[var(--primary-500)] font-bold tracking-widest break-words leading-tight drop-shadow-md">{currentHijri}</p>
            </div>
         </div>
         <div className="px-[3cqw] py-[2cqh] bg-[var(--primary-600)] text-white font-black text-[3.5cqh] rounded-[2cqh] tracking-[0.2em] shadow-[0_0_3cqh_rgba(16,185,129,0.4)] shrink-0">
            SHALAT JUMAT
         </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-[4cqw]">
         <div className="col-span-7 flex flex-col justify-center gap-[6cqh] min-w-0">
            <div className="min-w-0">
               <h3 className="text-gray-500 text-[3cqh] font-black uppercase tracking-[0.2em] mb-[2cqh]">Khatib</h3>
               <p className="text-[8.5cqh] font-black text-white leading-none break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
            </div>
            <div className="flex gap-[4cqw] min-w-0">
               <div className="min-w-0 flex-1">
                  <h3 className="text-gray-500 text-[2.5cqh] font-black uppercase tracking-[0.2em] mb-[1.5cqh]">Imam</h3>
                  <p className="text-[5.5cqh] font-bold text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
               </div>
               <div className="min-w-0 flex-1">
                  <h3 className="text-gray-500 text-[2.5cqh] font-black uppercase tracking-[0.2em] mb-[1.5cqh]">Muadzin</h3>
                  <p className="text-[5.5cqh] font-bold text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
               </div>
            </div>
         </div>
         <div className="col-span-5 flex flex-col gap-[3cqh] min-w-0">
            <div className="bg-[#111] border border-gray-800 rounded-[4cqh] p-[4cqh] shadow-2xl flex-1 flex flex-col justify-center min-h-0">
               <h3 className="text-[var(--primary-500)] text-[2.5cqh] font-black uppercase tracking-widest mb-[2cqh] shrink-0">Tema Khutbah</h3>
               <p className="text-[4.5cqh] font-bold text-white italic leading-relaxed line-clamp-3 overflow-hidden">"{fridayInfo?.theme || '-'}"</p>
            </div>
            <div className="bg-gradient-to-br from-[#111] to-black border border-gray-800 rounded-[4cqh] p-[4cqh] shadow-2xl h-[30%] shrink-0 flex flex-col justify-center">
               <h3 className="text-gray-500 text-[2.2cqh] font-black uppercase tracking-widest mb-[1.5cqh] border-b border-gray-800 pb-[1.5cqh]">Saldo Kas Jumat</h3>
               <p className="text-[5cqh] font-mono font-black text-emerald-400 drop-shadow-[0_0_1.5cqh_rgba(52,211,153,0.3)] break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
