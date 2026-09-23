import React from 'react';

export default function InfoSlideScreen({ displaySetting }) {
  const items = displaySetting?.infoSlideItems || [];
  const visibleCount = displaySetting?.infoSlideVisibleItems || 5;
  const speed = displaySetting?.infoSlideScrollSpeed || 3;
  const shouldScroll = items.length > visibleCount;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] flex flex-col p-8 md:p-12 z-50 overflow-hidden"
         style={{ animation: 'screenFadeIn 1.5s ease-out forwards' }}>
      
      {/* Animated glowing orbs for dynamic blue theme */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 opacity-10 bg-[url('/masjid/mosque_bg.png')] bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-blue-500/20">
         
         {/* Premium Blue Header */}
         <div className="bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-950/80 px-10 py-8 relative overflow-hidden flex items-center justify-between shadow-xl border-b border-blue-500/20 z-30">
           <div className="absolute inset-0 bg-[url('/masjid/mosque_bg.png')] opacity-5 mix-blend-overlay"></div>
           <div className="relative z-10 flex items-center gap-6">
             <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-blue-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: 'drop-shadow(0 0 8px rgba(103, 232, 249, 0.5))' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
               <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-widest uppercase drop-shadow-lg leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                 Pusat Informasi
               </h2>
               <p className="text-blue-200 text-lg mt-1 tracking-wider font-light">Pengumuman & Laporan Masjid Baitul Jannah</p>
             </div>
           </div>
         </div>
         
         {/* Main Content Area - Continuous Vertical Marquee */}
         <div className="flex-1 relative overflow-hidden mx-8 md:mx-12 my-6">
            {/* Fade masks for top and bottom edges */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/60 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent z-20 pointer-events-none"></div>
            
            {items.length > 0 ? (
              <div 
                className="flex flex-col gap-6 w-full"
                style={{
                  animation: shouldScroll ? `marqueeUp ${items.length * speed}s linear infinite` : 'none',
                }}
              >
                {/* First Set of Items */}
                <div className="flex flex-col gap-6">
                  {items.map((item, idx) => (
                    <div 
                      key={`set1-${idx}`} 
                      className="group relative flex items-start gap-6 bg-slate-800/40 border border-blue-500/10 rounded-3xl p-8 shadow-lg overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-80"></div>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-md">{item.title}</h3>
                        <p className="text-2xl text-blue-100/80 leading-relaxed font-light">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Second Set of Items for Seamless Infinite Loop */}
                {shouldScroll && (
                  <div className="flex flex-col gap-6">
                    {items.map((item, idx) => (
                      <div 
                        key={`set2-${idx}`} 
                        className="group relative flex items-start gap-6 bg-slate-800/40 border border-blue-500/10 rounded-3xl p-8 shadow-lg overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-80"></div>
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-md">{item.title}</h3>
                          <p className="text-2xl text-blue-100/80 leading-relaxed font-light">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-3xl text-blue-200 font-medium tracking-widest uppercase">Belum Ada Informasi</p>
              </div>
            )}
         </div>
      </div>
      <style>{`
        @keyframes screenFadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes marqueeUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 12px)); }
        }
      `}</style>
    </div>
  );
}
