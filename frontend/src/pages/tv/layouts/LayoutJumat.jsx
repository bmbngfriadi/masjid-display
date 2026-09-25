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
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka || 0);
  };

  const commonData = { time, mosqueProfile, nextPrayer, currentDate, currentHijri, fridayInfo, formatRupiah };

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
const LogoArea = ({ mosqueProfile, className = "w-[12vh] h-[12vh]" }) => {
  if (mosqueProfile?.logoUrl) {
    return <img src={mosqueProfile.logoUrl} alt="Logo Masjid" className={`${className} object-contain drop-shadow-xl shrink-0`} />;
  }
  return (
    <div className={`${className} bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-700)] rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 border-[0.4vh] border-white/20 shrink-0`}>
      <svg className="w-1/2 h-1/2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    </div>
  );
};


// ================= LAYOUT 1: SIGNATURE =================
function JumatLayout1({ time, mosqueProfile, currentHijri, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[3vh] text-white relative z-10 bg-black/60 backdrop-blur-md animate-fade-in pb-[5vh] overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-[3vh] shrink-0 h-[15vh]">
        <div className="flex items-center gap-[2vw]">
          <LogoArea mosqueProfile={mosqueProfile} className="w-[12vh] h-[12vh]" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[5vh] leading-tight font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg break-words leading-tight drop-shadow-md max-w-[50vw]">
              {mosqueProfile?.name}
            </h1>
            <p className="text-[2.5vh] text-gray-300 font-medium tracking-wide break-words leading-tight drop-shadow-md max-w-[50vw]">
              {mosqueProfile?.address}
            </p>
          </div>
        </div>
        <div className="text-right bg-white/10 px-[2vw] py-[1.5vh] rounded-[2vh] border border-white/20 shadow-2xl flex flex-col justify-center">
          <div className="text-[7vh] leading-none font-bold font-mono text-white">
            {format(time, 'HH:mm')}
            <span className="text-[4vh] text-gray-400 ml-[0.5vw] animate-pulse">{format(time, 'ss')}</span>
          </div>
          <div className="text-[2.2vh] mt-[0.5vh] font-semibold text-[var(--primary-300)] uppercase">
            {format(time, 'EEEE, d MMMM yyyy', { locale: id })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-[2vw] items-stretch">
        <div className="col-span-8 flex flex-col min-h-0 bg-gradient-to-br from-[var(--primary-900)]/80 to-black/80 rounded-[3vh] p-[3vh] border border-[var(--primary-500)]/30 shadow-2xl">
          <h2 className="text-[3.5vh] font-black text-white uppercase mb-[2vh] border-b border-white/10 pb-[1.5vh] shrink-0">Petugas Jumat</h2>
          
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-[2vh]">
            <div className="bg-white/5 rounded-[2vh] p-[2vh] border border-white/10 flex items-center gap-[2vw] shrink-0">
              <div className="w-[10vh] h-[10vh] rounded-full bg-[var(--primary-600)] flex items-center justify-center shrink-0">
                <svg className="w-[5vh] h-[5vh] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-gray-400 text-[2.2vh] uppercase tracking-widest font-bold mb-[0.5vh]">Khatib</h3>
                <p className="text-[5.5vh] leading-none font-bold text-white tracking-tight break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
              </div>
            </div>
            
            <div className="flex gap-[2vw] shrink-0 h-[14vh]">
              <div className="flex-1 bg-white/5 rounded-[2vh] p-[2vh] border border-white/10 flex flex-col justify-center min-w-0">
                <h3 className="text-gray-400 text-[2vh] uppercase tracking-widest font-bold mb-[0.5vh]">Imam</h3>
                <p className="text-[4vh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-[2vh] p-[2vh] border border-white/10 flex flex-col justify-center min-w-0">
                <h3 className="text-gray-400 text-[2vh] uppercase tracking-widest font-bold mb-[0.5vh]">Muadzin</h3>
                <p className="text-[4vh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 bg-[var(--primary-600)]/30 border border-[var(--primary-500)]/50 rounded-[2vh] p-[2vh] flex flex-col items-center justify-center text-center">
              <h3 className="text-[var(--primary-200)] text-[2vh] uppercase tracking-[0.3em] font-bold mb-[1vh]">Tema Khutbah</h3>
              <p className="text-[4.5vh] font-extrabold text-white leading-tight line-clamp-2 px-[2vw]">"{fridayInfo?.theme || '-'}"</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col min-h-0 bg-black/40 rounded-[3vh] p-[3vh] border border-white/10">
          <h2 className="text-[2.8vh] font-bold text-white tracking-wider uppercase mb-[2vh] text-center bg-white/5 py-[1.5vh] rounded-[1.5vh] shrink-0">Laporan Kas</h2>
          
          <div className="flex-1 min-h-0 flex flex-col justify-around gap-[1.5vh]">
            <div className="bg-white/5 p-[2vh] rounded-[1.5vh] border border-white/10 flex-1 flex flex-col justify-center">
              <p className="text-gray-400 text-[1.8vh] uppercase mb-[0.5vh] font-bold">Saldo Awal</p>
              <p className="text-[3.5vh] leading-none font-bold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
            </div>
            <div className="bg-green-900/20 p-[2vh] rounded-[1.5vh] border border-green-500/30 flex-1 flex flex-col justify-center">
              <p className="text-green-400 text-[1.8vh] uppercase mb-[0.5vh] font-bold">Pemasukan</p>
              <p className="text-[3.5vh] leading-none font-bold font-mono text-green-300 break-words leading-tight drop-shadow-md">+{formatRupiah(fridayInfo?.pemasukan)}</p>
            </div>
            <div className="bg-red-900/20 p-[2vh] rounded-[1.5vh] border border-red-500/30 flex-1 flex flex-col justify-center">
              <p className="text-red-400 text-[1.8vh] uppercase mb-[0.5vh] font-bold">Pengeluaran</p>
              <p className="text-[3.5vh] leading-none font-bold font-mono text-red-300 break-words leading-tight drop-shadow-md">-{formatRupiah(fridayInfo?.pengeluaran)}</p>
            </div>
            <div className="bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-900)] p-[2.5vh] rounded-[2vh] border border-[var(--primary-400)] shrink-0 shadow-lg flex flex-col justify-center h-[14vh]">
              <p className="text-[var(--primary-200)] text-[1.8vh] font-bold uppercase mb-[0.5vh]">Saldo Akhir</p>
              <p className="text-[4.5vh] leading-none font-extrabold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
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
    <div className="w-full h-full flex flex-col p-[4vh] text-white relative z-10 bg-black/85 animate-fade-in overflow-hidden">
      <div className="absolute top-[4vh] left-[4vw] flex items-center gap-[2vw]">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[14vh] h-[14vh]" />
        <h1 className="text-[4.5vh] font-black text-white uppercase tracking-wider">{mosqueProfile?.name}</h1>
      </div>
      
      <div className="text-center mt-[4vh] mb-[6vh] shrink-0">
        <div className="inline-block bg-[var(--primary-500)] text-white px-[4vw] py-[1.5vh] rounded-full text-[4vh] font-bold tracking-widest uppercase shadow-lg">Shalat Jumat</div>
      </div>
      
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-[6vw] max-w-[90vw] mx-auto w-full">
        <div className="flex flex-col gap-[4vh] justify-center min-w-0">
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5vh] uppercase tracking-widest mb-[1vh] font-bold">Khatib</h3>
            <p className="text-[7.5vh] leading-tight font-black text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5vh] uppercase tracking-widest mb-[1vh] font-bold">Imam</h3>
            <p className="text-[5.5vh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[2.5vh] uppercase tracking-widest mb-[1vh] font-bold">Muadzin</h3>
            <p className="text-[5.5vh] leading-tight font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-[3vh] justify-center bg-white/5 rounded-[4vh] p-[4vh] border border-white/10 min-w-0 h-full">
          <div className="text-center mb-[2vh] border-b border-white/20 pb-[3vh] shrink-0">
            <h3 className="text-gray-400 text-[2.5vh] uppercase tracking-widest font-bold mb-[1.5vh]">Tema Khutbah</h3>
            <p className="text-[4.5vh] leading-tight font-extrabold text-[var(--primary-400)] line-clamp-3">"{fridayInfo?.theme || '-'}"</p>
          </div>
          <div className="grid grid-cols-2 gap-[3vh] flex-1 min-h-0 items-center">
            <div className="min-w-0">
              <p className="text-gray-400 text-[2vh] uppercase tracking-wider mb-[1vh] font-bold">Kas Awal</p>
              <p className="text-[4vh] leading-none font-bold font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[var(--primary-400)] text-[2vh] uppercase tracking-wider font-bold mb-[1vh]">Saldo Akhir</p>
              <p className="text-[5vh] leading-none font-black font-mono text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
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
    <div className="w-full h-full flex flex-col p-[4vh] text-yellow-50 relative z-10 bg-emerald-950/95 animate-fade-in border-[2vh] border-double border-yellow-600/50 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/masjid/pattern.png')] bg-cover mix-blend-overlay"></div>
      
      <div className="relative z-10 text-center mb-[4vh] border-b-[0.4vh] border-yellow-600/50 pb-[3vh] flex justify-center items-center gap-[2vw] shrink-0">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[15vh] h-[15vh] border-yellow-500 border-4 rounded-full p-[0.5vh] bg-white" />
        <div className="flex flex-col justify-center">
           <h1 className="text-[6vh] leading-tight font-bold text-yellow-500 font-serif tracking-wide break-words leading-tight drop-shadow-md max-w-[60vw]">{mosqueProfile?.name}</h1>
           <p className="text-[3vh] text-yellow-200 mt-[1vh] font-serif font-medium">{currentHijri}</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-2 gap-[4vw]">
        <div className="bg-black/50 border-2 border-yellow-600/50 p-[4vh] rounded-[3vh] flex flex-col justify-between items-center text-center min-w-0">
          <div className="w-full min-w-0">
            <h3 className="text-yellow-600 text-[2.5vh] uppercase tracking-[0.4em] font-bold mb-[1.5vh]">Khatib</h3>
            <p className="text-[6vh] leading-tight font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-yellow-600/80 to-transparent my-[2vh]"></div>
          <div className="w-full min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-yellow-600 text-[2.5vh] uppercase tracking-[0.4em] font-bold mb-[1.5vh]">Tema Khutbah</h3>
            <p className="text-[4vh] leading-snug font-bold text-yellow-400 italic line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
          <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-yellow-600/80 to-transparent my-[2vh]"></div>
          <div className="flex w-full justify-around shrink-0">
            <div className="min-w-0 w-[40%]">
              <h3 className="text-yellow-600 text-[2vh] uppercase tracking-[0.2em] font-bold mb-[1vh]">Imam</h3>
              <p className="text-[4vh] leading-tight font-serif text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="min-w-0 w-[40%]">
              <h3 className="text-yellow-600 text-[2vh] uppercase tracking-[0.2em] font-bold mb-[1vh]">Muadzin</h3>
              <p className="text-[4vh] leading-tight font-serif text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/50 border-2 border-yellow-600/50 p-[4vh] rounded-[3vh] flex flex-col min-h-0">
          <h2 className="text-[4vh] font-serif text-yellow-500 text-center mb-[4vh] border-b-2 border-yellow-600/50 pb-[2vh] shrink-0">Laporan Kas</h2>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-[2vh] border-b border-white/10">
              <span className="text-[3vh] text-gray-300">Saldo Awal</span>
              <span className="text-[4vh] font-mono text-white">{formatRupiah(fridayInfo?.saldoAwal)}</span>
            </div>
            <div className="flex justify-between items-center pb-[2vh] border-b border-white/10">
              <span className="text-[3vh] text-gray-300">Pemasukan</span>
              <span className="text-[4vh] font-mono text-emerald-400">+{formatRupiah(fridayInfo?.pemasukan)}</span>
            </div>
            <div className="flex justify-between items-center pb-[2vh] border-b border-white/10">
              <span className="text-[3vh] text-gray-300">Pengeluaran</span>
              <span className="text-[4vh] font-mono text-red-400">-{formatRupiah(fridayInfo?.pengeluaran)}</span>
            </div>
            <div className="flex justify-between items-center pt-[2vh] bg-yellow-900/30 p-[2vh] rounded-[2vh] mt-[2vh] border border-yellow-600/40">
              <span className="text-[3.5vh] font-bold text-yellow-500">Saldo Akhir</span>
              <span className="text-[5.5vh] font-bold font-mono text-yellow-400">{formatRupiah(fridayInfo?.saldoAkhir)}</span>
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
      <div className="w-full bg-black/60 py-[2vh] px-[4vw] flex justify-between items-center border-b-4 border-blue-500 shrink-0 h-[12vh]">
        <div className="flex items-center gap-[1.5vw] min-w-0">
           <LogoArea mosqueProfile={mosqueProfile} className="w-[8vh] h-[8vh]" />
           <h1 className="text-[4vh] font-extrabold text-blue-200 uppercase tracking-widest break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
        </div>
        <div className="text-[3vh] font-bold text-blue-300 tracking-wider shrink-0">{currentDate}</div>
      </div>
      
      <div className="flex-1 min-h-0 flex px-[4vw] py-[4vh] items-stretch justify-between gap-[4vw]">
        <div className="w-1/2 flex flex-col gap-[3vh] min-w-0">
          <div className="flex-1 min-h-0 bg-white/5 p-[4vh] rounded-[3vh] border-l-8 border-blue-500 backdrop-blur flex flex-col justify-center min-w-0">
            <h3 className="text-blue-400 text-[2.5vh] font-bold uppercase tracking-widest mb-[1vh]">Khatib</h3>
            <p className="text-[6.5vh] leading-tight font-black text-white break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="flex-1 min-h-0 bg-white/5 p-[4vh] rounded-[3vh] border-l-8 border-emerald-500 backdrop-blur flex flex-col justify-center min-w-0">
            <h3 className="text-emerald-400 text-[2.5vh] font-bold uppercase tracking-widest mb-[1vh]">Tema Khutbah</h3>
            <p className="text-[4.5vh] leading-tight font-bold text-white line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
        </div>
        
        <div className="w-1/2 grid grid-cols-2 gap-[2vh] bg-black/50 p-[4vh] rounded-[4vh] border border-white/10 h-full min-w-0">
          <div className="col-span-2 text-center flex items-center justify-center shrink-0 h-[8vh]">
            <h2 className="text-[3.5vh] text-gray-400 tracking-widest uppercase font-black">Keuangan Kas</h2>
          </div>
          <div className="bg-white/5 p-[3vh] rounded-[2vh] text-center flex flex-col justify-center min-w-0">
            <p className="text-gray-400 text-[2vh] mb-[1vh] font-bold">Saldo Awal</p>
            <p className="text-[4vh] font-mono font-bold break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</p>
          </div>
          <div className="bg-green-900/20 p-[3vh] rounded-[2vh] border border-green-500/20 text-center flex flex-col justify-center min-w-0">
            <p className="text-green-400 text-[2vh] mb-[1vh] font-bold">Infaq Jumat</p>
            <p className="text-[4vh] font-mono font-bold text-green-400 break-words leading-tight drop-shadow-md">+{formatRupiah(fridayInfo?.pemasukan)}</p>
          </div>
          <div className="bg-red-900/20 p-[3vh] rounded-[2vh] border border-red-500/20 text-center flex flex-col justify-center min-w-0">
            <p className="text-red-400 text-[2vh] mb-[1vh] font-bold">Pengeluaran</p>
            <p className="text-[4vh] font-mono font-bold text-red-400 break-words leading-tight drop-shadow-md">-{formatRupiah(fridayInfo?.pengeluaran)}</p>
          </div>
          <div className="bg-blue-900/40 p-[3vh] rounded-[2vh] border border-blue-500/50 text-center flex flex-col justify-center min-w-0">
            <p className="text-blue-300 text-[2vh] font-bold mb-[1vh] uppercase">Saldo Akhir</p>
            <p className="text-[4.5vh] font-mono font-black text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 5: SIMPLICITY =================
function JumatLayout5({ mosqueProfile, time, fridayInfo, formatRupiah }) {
  return (
    <div className="w-full h-full flex flex-col p-[6vh] text-white relative z-10 bg-black/90 animate-fade-in overflow-hidden">
      <div className="flex justify-between items-end border-b-4 border-[var(--primary-500)] pb-[3vh] mb-[6vh] shrink-0 h-[20vh]">
        <div className="flex items-center gap-[2vw] min-w-0">
          <LogoArea mosqueProfile={mosqueProfile} className="w-[14vh] h-[14vh]" />
          <div className="min-w-0">
            <h2 className="text-[3vh] text-[var(--primary-500)] font-bold tracking-widest uppercase mb-[0.5vh]">Informasi Shalat Jumat</h2>
            <h1 className="text-[6vh] leading-none font-black break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
          </div>
        </div>
        <div className="text-[10vh] leading-none font-mono font-black text-gray-200 shrink-0">
          {format(time, 'HH:mm')}
        </div>
      </div>
      
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-[6vw]">
        <div className="flex flex-col justify-between min-w-0 py-[2vh]">
          <div className="min-w-0">
            <h3 className="text-gray-400 text-[3vh] font-bold mb-[1vh] uppercase">Khatib</h3>
            <p className="text-[7.5vh] leading-none font-black break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-[2vw] min-w-0">
            <div className="min-w-0">
              <h3 className="text-gray-400 text-[2.5vh] font-bold mb-[1vh] uppercase">Imam</h3>
              <p className="text-[4.5vh] leading-tight font-bold break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="min-w-0">
              <h3 className="text-gray-400 text-[2.5vh] font-bold mb-[1vh] uppercase">Muadzin</h3>
              <p className="text-[4.5vh] leading-tight font-bold break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-[var(--primary-400)] text-[3vh] font-bold mb-[1vh] uppercase">Tema Khutbah</h3>
            <p className="text-[4.5vh] leading-tight font-bold italic line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-center min-w-0">
          <div className="bg-white/10 rounded-[4vh] p-[5vh] flex flex-col justify-between h-full">
            <h2 className="text-[4.5vh] font-black text-center border-b-2 border-white/20 pb-[2vh] shrink-0">Laporan Keuangan</h2>
            <div className="flex justify-between items-center min-w-0 py-[1.5vh]">
              <span className="text-[3vh] text-gray-300">Saldo Awal</span>
              <span className="text-[4.5vh] font-mono font-bold break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAwal)}</span>
            </div>
            <div className="flex justify-between items-center min-w-0 py-[1.5vh]">
              <span className="text-[3vh] text-gray-300">Pemasukan</span>
              <span className="text-[4.5vh] font-mono font-bold text-emerald-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.pemasukan)}</span>
            </div>
            <div className="flex justify-between items-center min-w-0 py-[1.5vh]">
              <span className="text-[3vh] text-gray-300">Pengeluaran</span>
              <span className="text-[4.5vh] font-mono font-bold text-red-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.pengeluaran)}</span>
            </div>
            <div className="flex justify-between items-center pt-[3vh] border-t-2 border-white/20 mt-auto min-w-0">
              <span className="text-[4vh] font-black text-[var(--primary-400)]">Saldo Akhir</span>
              <span className="text-[6.5vh] font-mono font-black break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</span>
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
    <div className="w-full h-full flex flex-col p-[5vh] text-white relative z-10 bg-[#0f172a] animate-fade-in overflow-hidden">
      <div className="flex items-center gap-[2vw] justify-center bg-white/10 p-[3vh] rounded-[3vh] mb-[4vh] border border-white/20 shrink-0 h-[18vh]">
        <LogoArea mosqueProfile={mosqueProfile} className="w-[12vh] h-[12vh]" />
        <h1 className="text-[6vh] font-black uppercase text-center tracking-widest text-emerald-400 drop-shadow-lg break-words leading-tight drop-shadow-md max-w-[70vw]">{mosqueProfile?.name}</h1>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col gap-[4vh]">
        <div className="flex-1 min-h-0 bg-slate-800/80 rounded-[4vh] border-4 border-slate-600 flex flex-col items-center justify-center p-[4vh] shadow-2xl min-w-0">
           <h3 className="text-[3.5vh] text-slate-400 uppercase font-black tracking-[0.3em] mb-[2vh]">Khatib Shalat Jumat</h3>
           <p className="text-[10vh] leading-none font-black text-white text-center drop-shadow-2xl break-words leading-tight drop-shadow-md w-full px-[2vw]">{fridayInfo?.khatib || '-'}</p>
        </div>
        
        <div className="h-[35%] shrink-0 grid grid-cols-2 gap-[4vw] min-min-h-0">
           <div className="bg-slate-800/80 rounded-[4vh] border-4 border-slate-600 flex flex-col items-center justify-center p-[4vh] min-w-0">
              <h3 className="text-[3vh] text-emerald-400 uppercase font-black tracking-widest mb-[2vh]">Tema Khutbah</h3>
              <p className="text-[4.5vh] font-bold text-center italic text-white leading-tight line-clamp-2 px-[2vw]">"{fridayInfo?.theme || '-'}"</p>
           </div>
           <div className="bg-emerald-900/20 rounded-[4vh] border-4 border-emerald-600/50 flex flex-col items-center justify-center p-[4vh] min-w-0">
              <h3 className="text-[3vh] text-emerald-300 uppercase font-black tracking-widest mb-[2vh]">Saldo Kas Masjid</h3>
              <p className="text-[6.5vh] leading-none font-black font-mono text-emerald-400 break-words leading-tight drop-shadow-md max-w-full px-[2vw]">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
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
      
      <div className="flex justify-between items-center w-full px-[5vw] py-[3vh] border-b-2 border-yellow-700/50 relative z-10 bg-black/60 shrink-0 h-[16vh]">
         <div className="flex items-center gap-[2vw] min-w-0">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[12vh] h-[12vh] p-[1vh] bg-yellow-900/40 rounded-full border border-yellow-600" />
            <h1 className="text-[5vh] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
         </div>
         <div className="text-[6vh] font-mono text-yellow-500 font-bold shrink-0">{format(time, 'HH:mm')}</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-[5vh] gap-[5vh] min-h-0">
         <div className="text-center w-full min-w-0">
            <h3 className="text-[3.5vh] text-yellow-600/80 uppercase font-serif tracking-[0.5em] mb-[2vh]">Khatib Jumat</h3>
            <p className="text-[8.5vh] font-serif font-bold text-yellow-100 drop-shadow-[0_0_2vh_rgba(202,138,4,0.5)] leading-none break-words leading-tight drop-shadow-md px-[4vw]">{fridayInfo?.khatib || '-'}</p>
         </div>
         <div className="w-[60vw] h-[0.2vh] bg-gradient-to-r from-transparent via-yellow-600 to-transparent shrink-0"></div>
         <div className="text-center w-full min-w-0">
            <h3 className="text-[3vh] text-yellow-600/80 uppercase font-serif tracking-[0.5em] mb-[2vh]">Tema Khutbah</h3>
            <p className="text-[5vh] font-serif font-medium text-yellow-300 italic leading-tight line-clamp-2 px-[4vw]">"{fridayInfo?.theme || '-'}"</p>
         </div>
      </div>
      
      <div className="h-[20vh] bg-gradient-to-t from-yellow-900/50 to-transparent relative z-10 flex justify-around items-center px-[4vw] shrink-0 border-t border-yellow-900/30">
         <div className="text-center min-w-0 flex-1 px-[2vw]">
            <p className="text-yellow-600 uppercase tracking-widest text-[2.5vh] mb-[1vh] font-bold">Imam</p>
            <p className="text-[4.5vh] font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
         </div>
         <div className="text-center min-w-0 flex-1 px-[2vw]">
            <p className="text-yellow-600 uppercase tracking-widest text-[2.5vh] mb-[1vh] font-bold">Muadzin</p>
            <p className="text-[4.5vh] font-serif text-white break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
         </div>
         <div className="text-center min-w-0 flex-1 px-[2vw] bg-yellow-900/30 py-[2vh] rounded-[2vh] border border-yellow-600/30">
            <p className="text-yellow-500 uppercase tracking-widest text-[2.5vh] mb-[1vh] font-bold">Saldo Akhir</p>
            <p className="text-[5vh] font-mono font-bold text-yellow-400 break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 8: MODERN SPLIT =================
function JumatLayout8({ mosqueProfile, fridayInfo, formatRupiah, time, currentDate }) {
  return (
    <div className="w-full h-full flex text-white relative z-10 bg-black animate-fade-in overflow-hidden">
      <div className="w-1/3 bg-[var(--primary-900)] flex flex-col justify-between p-[4vh] border-r-[1vw] border-[var(--primary-500)] shadow-[2vw_0_3vw_rgba(0,0,0,0.8)] z-20 min-w-0">
         <div className="flex flex-col items-center text-center gap-[3vh] mt-[4vh] min-w-0">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[18vh] h-[18vh] bg-white p-[1vh] rounded-[3vh] shadow-2xl shrink-0" />
            <h1 className="text-[4.5vh] leading-tight font-black uppercase text-white mt-[2vh]">{mosqueProfile?.name}</h1>
         </div>
         <div className="text-center mb-[4vh] shrink-0">
            <p className="text-[9vh] font-mono font-black mb-[1vh] leading-none">{format(time, 'HH:mm')}</p>
            <p className="text-[2.5vh] text-[var(--primary-200)] font-bold uppercase">{currentDate}</p>
         </div>
      </div>
      
      <div className="w-2/3 flex flex-col p-[6vh] gap-[4vh] justify-center bg-[url('/masjid/mosque_bg.png')] bg-cover bg-center relative min-w-0">
         <div className="absolute inset-0 bg-black/85"></div>
         <div className="relative z-10 bg-white/10 backdrop-blur-xl p-[5vh] rounded-[4vh] border border-white/20 shadow-2xl min-w-0">
            <h3 className="text-[3vh] text-[var(--primary-400)] uppercase font-black tracking-widest mb-[1.5vh]">Khatib Jumat</h3>
            <p className="text-[7.5vh] font-black text-white leading-none mb-[4vh] break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
            
            <h3 className="text-[2.5vh] text-[var(--primary-400)] uppercase font-black tracking-widest mb-[1.5vh]">Tema</h3>
            <p className="text-[4.5vh] font-bold text-white italic leading-tight line-clamp-2">"{fridayInfo?.theme || '-'}"</p>
         </div>
         
         <div className="relative z-10 grid grid-cols-2 gap-[3vw] h-[30vh] shrink-0">
            <div className="bg-white/10 backdrop-blur-xl p-[4vh] rounded-[3vh] border border-white/20 flex flex-col justify-center min-w-0">
               <h3 className="text-[2.5vh] text-gray-400 uppercase font-black tracking-widest mb-[1.5vh]">Imam Utama</h3>
               <p className="text-[5vh] font-bold text-white break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-xl p-[4vh] rounded-[3vh] border border-emerald-500/50 flex flex-col justify-center min-w-0">
               <h3 className="text-[2.5vh] text-emerald-400 uppercase font-black tracking-widest mb-[1.5vh]">Total Kas</h3>
               <p className="text-[5.5vh] font-mono font-black text-white break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 9: FOCUSED VIEW =================
function JumatLayout9({ mosqueProfile, fridayInfo, time }) {
  return (
    <div className="w-full h-full flex flex-col text-white relative z-10 bg-black animate-fade-in justify-center items-center p-[6vh] overflow-hidden">
      <div className="absolute top-[5vh] left-[4vw] flex items-center gap-[1.5vw] max-w-[60vw]">
         <LogoArea mosqueProfile={mosqueProfile} className="w-[10vh] h-[10vh]" />
         <h1 className="text-[3.5vh] font-bold text-gray-400 tracking-widest uppercase break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
      </div>
      <div className="absolute top-[5vh] right-[4vw] text-[6vh] font-mono font-bold text-gray-400">{format(time, 'HH:mm')}</div>
      
      <div className="text-center w-full max-w-[80vw] mt-[4vh] flex flex-col items-center min-h-0">
         <div className="inline-block border-2 border-[var(--primary-500)] text-[var(--primary-400)] px-[3vw] py-[1vh] rounded-full text-[2.5vh] font-bold tracking-[0.3em] uppercase mb-[4vh] shrink-0">
            Informasi Khutbah
         </div>
         <div className="w-full min-w-0 mb-[6vh] shrink-0">
            <h3 className="text-[3.5vh] text-gray-500 uppercase font-black tracking-[0.4em] mb-[1.5vh]">Khatib</h3>
            <p className="text-[9vh] font-black text-white leading-none drop-shadow-[0_1vh_2vh_rgba(16,185,129,0.3)] break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
         </div>
         
         <div className="bg-white/5 border border-white/10 rounded-[4vh] p-[5vh] backdrop-blur w-full max-w-[60vw] min-w-0">
            <h3 className="text-[3vh] text-[var(--primary-500)] uppercase font-black tracking-widest mb-[2vh]">Tema Khutbah</h3>
            <p className="text-[4.5vh] font-bold text-gray-200 leading-tight italic line-clamp-3">"{fridayInfo?.theme || '-'}"</p>
         </div>
      </div>
    </div>
  );
}

// ================= LAYOUT 10: PREMIUM DARK =================
function JumatLayout10({ mosqueProfile, fridayInfo, formatRupiah, currentHijri }) {
  return (
    <div className="w-full h-full flex flex-col p-[5vh] text-white relative z-10 bg-[#0a0a0a] animate-fade-in overflow-hidden">
      <div className="flex justify-between items-center mb-[6vh] shrink-0 h-[15vh]">
         <div className="flex items-center gap-[2vw] min-w-0 w-[65%]">
            <LogoArea mosqueProfile={mosqueProfile} className="w-[14vh] h-[14vh] p-[1vh] bg-white/5 rounded-[2vh] border border-white/10 shadow-2xl shrink-0" />
            <div className="min-w-0">
               <h1 className="text-[4.5vh] font-black text-white uppercase tracking-wider mb-[1vh] break-words leading-tight drop-shadow-md">{mosqueProfile?.name}</h1>
               <p className="text-[2.5vh] text-[var(--primary-500)] font-bold tracking-widest break-words leading-tight drop-shadow-md">{currentHijri}</p>
            </div>
         </div>
         <div className="px-[3vw] py-[2vh] bg-[var(--primary-600)] text-white font-black text-[3.5vh] rounded-[2vh] tracking-[0.2em] shadow-[0_0_3vh_rgba(16,185,129,0.4)] shrink-0">
            SHALAT JUMAT
         </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-[4vw]">
         <div className="col-span-7 flex flex-col justify-center gap-[6vh] min-w-0">
            <div className="min-w-0">
               <h3 className="text-gray-500 text-[3vh] font-black uppercase tracking-[0.2em] mb-[2vh]">Khatib</h3>
               <p className="text-[8.5vh] font-black text-white leading-none break-words leading-tight drop-shadow-md">{fridayInfo?.khatib || '-'}</p>
            </div>
            <div className="flex gap-[4vw] min-w-0">
               <div className="min-w-0 flex-1">
                  <h3 className="text-gray-500 text-[2.5vh] font-black uppercase tracking-[0.2em] mb-[1.5vh]">Imam</h3>
                  <p className="text-[5.5vh] font-bold text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.imam || '-'}</p>
               </div>
               <div className="min-w-0 flex-1">
                  <h3 className="text-gray-500 text-[2.5vh] font-black uppercase tracking-[0.2em] mb-[1.5vh]">Muadzin</h3>
                  <p className="text-[5.5vh] font-bold text-gray-200 break-words leading-tight drop-shadow-md">{fridayInfo?.muadzin || '-'}</p>
               </div>
            </div>
         </div>
         <div className="col-span-5 flex flex-col gap-[3vh] min-w-0">
            <div className="bg-[#111] border border-gray-800 rounded-[4vh] p-[4vh] shadow-2xl flex-1 flex flex-col justify-center min-h-0">
               <h3 className="text-[var(--primary-500)] text-[2.5vh] font-black uppercase tracking-widest mb-[2vh] shrink-0">Tema Khutbah</h3>
               <p className="text-[4.5vh] font-bold text-white italic leading-relaxed line-clamp-3 overflow-hidden">"{fridayInfo?.theme || '-'}"</p>
            </div>
            <div className="bg-gradient-to-br from-[#111] to-black border border-gray-800 rounded-[4vh] p-[4vh] shadow-2xl h-[30%] shrink-0 flex flex-col justify-center">
               <h3 className="text-gray-500 text-[2.2vh] font-black uppercase tracking-widest mb-[1.5vh] border-b border-gray-800 pb-[1.5vh]">Saldo Kas Jumat</h3>
               <p className="text-[5vh] font-mono font-black text-emerald-400 drop-shadow-[0_0_1.5vh_rgba(52,211,153,0.3)] break-words leading-tight drop-shadow-md">{formatRupiah(fridayInfo?.saldoAkhir)}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
