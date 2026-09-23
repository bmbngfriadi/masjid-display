import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import useFullscreen from '../../hooks/useFullscreen';
import useWakeLock from '../../hooks/useWakeLock';
import useDevice from '../../hooks/useDevice';
import LayoutSignature from './layouts/LayoutSignature';
import LayoutUltraWide from './layouts/LayoutUltraWide';
import LayoutSimplicity from './layouts/LayoutSimplicity';
import LayoutClassic from './layouts/LayoutClassic';
import LayoutModern from './layouts/LayoutModern';
import LayoutMinimalist from './layouts/LayoutMinimalist';
import InfoSlideScreen from './layouts/InfoSlideScreen';
import LayoutJumat from './layouts/LayoutJumat';

export default function TvDisplay() {
  const [previewFridayMode, setPreviewFridayMode] = useState(false);

  const { isFullscreen, requestFullscreen } = useFullscreen();
  const { isSupported, isActive } = useWakeLock(isFullscreen);
  const { deviceToken, pairingData, socket } = useDevice();
  const [time, setTime] = useState(new Date());

  // Automatically attempt to enter fullscreen on mount or when successfully paired
  useEffect(() => {
    if (deviceToken) {
      const attemptFullscreen = async () => {
        try {
          if (!document.fullscreenElement) {
            await requestFullscreen();
          }
        } catch (err) {
          console.warn("Auto-fullscreen requires user gesture on this browser.");
        }
      };
      
      // Try on mount
      attemptFullscreen();

      // Also try on ANY user interaction (remote control press, click, touch)
      window.addEventListener('keydown', attemptFullscreen);
      window.addEventListener('click', attemptFullscreen);
      window.addEventListener('touchstart', attemptFullscreen);

      return () => {
        window.removeEventListener('keydown', attemptFullscreen);
        window.removeEventListener('click', attemptFullscreen);
        window.removeEventListener('touchstart', attemptFullscreen);
      };
    }
  }, [deviceToken]);
  
  // State Machine
  // Modes: NORMAL, ADHAN, IQAMAH_COUNTDOWN, PRAYER
  const [displayMode, setDisplayMode] = useState('NORMAL');
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [iqamahTimeRemaining, setIqamahTimeRemaining] = useState(0);
  const [runningText, setRunningText] = useState('Selamat datang di Masjid Baitul Jannah. Luruskan dan rapatkan shaf. Matikan telepon seluler Anda selama ibadah berlangsung.');
  const [mosqueProfile, setMosqueProfile] = useState({
    name: 'Masjid Baitul Jannah',
    address: 'Batam, Kepulauan Riau',
    logoUrl: ''
  });
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '04:45', dhuhr: '12:15', asr: '15:30', maghrib: '18:20', isha: '19:35'
  });
  const [prayerConfig, setPrayerConfig] = useState(null);
  const [layoutStyle, setLayoutStyle] = useState('signature');
  const [displaySetting, setDisplaySetting] = useState(null);
  const [fridayInfo, setFridayInfo] = useState(null);

  const fetchRunningText = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const res = await fetch(`${API_BASE_URL}/running-text`);
      const data = await res.json();
      const activeTexts = data.filter(t => t.isActive).map(t => t.text);
      if (activeTexts.length > 0) {
        setRunningText(activeTexts.join(' *** '));
      } else {
        setRunningText('Selamat datang di Masjid Baitul Jannah.');
      }
    } catch (e) {
      console.error('Failed to fetch running text', e);
    }
  };

  const fetchMosqueProfile = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const res = await fetch(`${API_BASE_URL}/mosque`);
      const data = await res.json();
      if (data) {
        setMosqueProfile({
          name: data.name || 'Masjid Baitul Jannah',
          address: data.address || 'Batam, Kepulauan Riau',
          logoUrl: data.logoUrl || ''
        });
      }
    } catch (e) {
      console.error('Failed to fetch mosque profile', e);
    }
  };

  const fetchPrayerData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const [timesRes, configRes] = await Promise.all([
        fetch(`${API_BASE_URL}/prayer/today`),
        fetch(`${API_BASE_URL}/prayer-config`)
      ]);
      const timesData = await timesRes.json();
      const configData = await configRes.json();
      setPrayerTimes(timesData);
      setPrayerConfig(configData);
    } catch (e) {
      console.error('Failed to fetch prayer data', e);
    }
  };

  const fetchDisplaySetting = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const res = await fetch(`${API_BASE_URL}/display-setting`);
      const data = await res.json();
      if (data) {
        if (data.layoutStyle) setLayoutStyle(data.layoutStyle);
        setDisplaySetting(data);
      }
    } catch (e) {
      console.error('Failed to fetch display setting', e);
    }
  };

  const fetchFridayInfo = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const res = await fetch(`${API_BASE_URL}/friday`);
      const data = await res.json();
      setFridayInfo(data);
    } catch (e) {
      console.error('Failed to fetch friday info', e);
    }
  };

  useEffect(() => {
    requestFullscreen();
    fetchRunningText();
    fetchMosqueProfile();
    fetchPrayerData();
    fetchDisplaySetting();
    fetchFridayInfo();
    const timer = setInterval(() => {
      setTime(new Date());
      // Re-fetch prayer data at midnight
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        fetchPrayerData();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleModeUpdate = (data) => {
        setDisplayMode(data.mode);
        if (data.prayer) setCurrentPrayer(data.prayer);
        if (data.iqamahRemaining) setIqamahTimeRemaining(data.iqamahRemaining);
      };

      const handleContentUpdate = (data) => {
        if (data.type === 'RUNNING_TEXT') {
          fetchRunningText();
        } else if (data.type === 'MOSQUE_PROFILE') {
          fetchMosqueProfile();
        } else if (data.type === 'PRAYER_CONFIG') {
          fetchPrayerData();
        } else if (data.type === 'FRIDAY_INFO') {
          fetchFridayInfo();
        }
      };

      const handleDisplaySettingUpdate = (data) => {
        if (data) {
          if (data.layoutStyle) setLayoutStyle(data.layoutStyle);
          setDisplaySetting(data);
        }
      };

      const handlePreviewFriday = () => {
        setPreviewFridayMode(true);
        setTimeout(() => setPreviewFridayMode(false), 30000); // Preview 30 detik
      };

      socket.on('display:update_mode', handleModeUpdate);
      socket.on('content:updated', handleContentUpdate);
      socket.on('DISPLAY_SETTING_UPDATED', handleDisplaySettingUpdate);
      socket.on('preview:friday', handlePreviewFriday);
      
      return () => {
        socket.off('display:update_mode', handleModeUpdate);
        socket.off('content:updated', handleContentUpdate);
        socket.off('DISPLAY_SETTING_UPDATED', handleDisplaySettingUpdate);
        socket.off('preview:friday', handlePreviewFriday);
      };
    }
  }, [socket]);

  // Handle automatic prayer time trigger
  const lastTriggeredPrayer = useRef({ name: null, date: null });

  useEffect(() => {
    if (displayMode !== 'NORMAL' || !prayerTimes) return;
    
    const currentDateStr = format(time, 'yyyy-MM-dd');
    const currentHourMin = format(time, 'HH:mm');

    const prayers = [
      { id: 'fajr', name: 'SUBUH', time: prayerTimes.fajr },
      { id: 'dhuhr', name: 'DZUHUR', time: prayerTimes.dhuhr },
      { id: 'asr', name: 'ASHAR', time: prayerTimes.asr },
      { id: 'maghrib', name: 'MAGHRIB', time: prayerTimes.maghrib },
      { id: 'isha', name: 'ISYA', time: prayerTimes.isha }
    ];

    for (let prayer of prayers) {
      if (prayer.time && currentHourMin === prayer.time) {
        if (lastTriggeredPrayer.current.name !== prayer.name || lastTriggeredPrayer.current.date !== currentDateStr) {
          lastTriggeredPrayer.current = { name: prayer.name, date: currentDateStr };
          setDisplayMode('ADHAN');
          setCurrentPrayer(prayer.name);
          break;
        }
      }
    }
  }, [time, displayMode, prayerTimes]);

  // Handle adzan duration timeout
  useEffect(() => {
    let timeout;
    if (displayMode === 'ADHAN') {
      const durationMs = (prayerConfig?.adzanDuration || 4) * 60 * 1000;
      timeout = setTimeout(() => {
        setDisplayMode('IQAMAH_COUNTDOWN');
        
        // Find iqamah time for current prayer
        const iqamahMins = getIqamahDuration(currentPrayer);
        setIqamahTimeRemaining(iqamahMins * 60);
      }, durationMs);
    }
    return () => clearTimeout(timeout);
  }, [displayMode, currentPrayer, prayerConfig]);

  // Handle iqamah countdown
  useEffect(() => {
    let interval;
    if (displayMode === 'IQAMAH_COUNTDOWN' && iqamahTimeRemaining > 0) {
      interval = setInterval(() => {
        setIqamahTimeRemaining(prev => {
          if (prev <= 1) {
            setDisplayMode('PRAYER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [displayMode, iqamahTimeRemaining]);

  // Handle sholat duration timeout
  useEffect(() => {
    let timeout;
    if (displayMode === 'PRAYER') {
      const durationMs = (prayerConfig?.sholatDuration || 10) * 60 * 1000;
      timeout = setTimeout(() => {
        setDisplayMode('NORMAL');
      }, durationMs);
    }
    return () => clearTimeout(timeout);
  }, [displayMode, prayerConfig?.sholatDuration]);

  // Handle background slider & Info Slide
  const [currentPhase, setCurrentPhase] = useState('LAYOUT'); // 'LAYOUT' | 'SLIDESHOW' | 'INFO'
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const showInfoSlide = currentPhase === 'INFO';

  useEffect(() => {
    let timeoutId;
    
    // Only process background rotations when display is in NORMAL mode (not adzan/iqamah/sholat)
    if (displayMode !== 'NORMAL') return;

    const isBgSliderEnabled = displaySetting?.backgroundSliderEnabled !== false && displaySetting?.backgroundUrls && displaySetting.backgroundUrls.length > 0;
    const isInfoSlideEnabled = displaySetting?.infoSlideEnabled;
    const layoutDurationSec = displaySetting?.layoutDuration || 30;
    const bgIntervalSec = displaySetting?.backgroundSlideInterval || 10;
    const infoDurationSec = displaySetting?.infoSlideDuration || 10;
    
    if (currentPhase === 'LAYOUT') {
      timeoutId = setTimeout(() => {
        if (isBgSliderEnabled) {
          setCurrentPhase('SLIDESHOW');
          setCurrentBgIndex(0);
        } else if (isInfoSlideEnabled) {
          setCurrentPhase('INFO');
        } else {
          // Do nothing, just stay in LAYOUT forever
        }
      }, layoutDurationSec * 1000);
    } 
    else if (currentPhase === 'SLIDESHOW') {
      // If setting gets disabled while in this phase, force transition
      if (!isBgSliderEnabled) {
        setCurrentPhase('LAYOUT');
        return;
      }
      timeoutId = setTimeout(() => {
        if (currentBgIndex < displaySetting.backgroundUrls.length - 1) {
          setCurrentBgIndex(prev => prev + 1);
        } else {
          // Finished slideshow, go to INFO if enabled, else loop back to LAYOUT
          if (isInfoSlideEnabled) {
            setCurrentPhase('INFO');
          } else {
            setCurrentPhase('LAYOUT');
          }
        }
      }, bgIntervalSec * 1000);
    }
    else if (currentPhase === 'INFO') {
      if (!isInfoSlideEnabled) {
        setCurrentPhase('LAYOUT');
        return;
      }
      timeoutId = setTimeout(() => {
        setCurrentPhase('LAYOUT');
      }, infoDurationSec * 1000);
    }
    
    return () => clearTimeout(timeoutId);
  }, [displaySetting, currentPhase, currentBgIndex, displayMode]);

  const currentBgImage = currentPhase === 'SLIDESHOW'
    ? (displaySetting?.backgroundUrls?.[currentBgIndex] || displaySetting?.backgroundUrl || '/masjid/mosque_bg.png')
    : (displaySetting?.backgroundUrl || '/masjid/mosque_bg.png');

  // Hilangkan layar blokir "Mulai Display" agar TV tetap lanjut jalan normal saat server restart/autoreload.
  // Fullscreen bisa diaktifkan manual dengan F11 atau cukup klik di mana saja di layar.

  if (!deviceToken) {
    if (pairingData) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-primary)]">
          <h1 className="text-5xl font-extrabold mb-8 text-[var(--primary-600)] tracking-tight">MASJID DISPLAY</h1>
          <p className="text-xl mb-12 text-[var(--text-secondary)]">Menunggu Pairing dengan Admin...</p>
          
          <div className="glass-card p-10 text-center max-w-lg w-full">
            <p className="text-[var(--primary-600)] mb-4 text-sm font-bold uppercase tracking-widest">Pairing Code</p>
            <div className="text-7xl font-mono font-bold text-[var(--text-primary)] tracking-widest bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl shadow-inner">
              {pairingData.code}
            </div>
            <p className="mt-8 text-[var(--text-secondary)] font-medium">Scan QR Code atau masukkan kode ini di panel admin</p>
            <div className="bg-white p-4 rounded-xl inline-block mt-6 shadow-sm border border-slate-100">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/masjid/pair/' + pairingData.code)}`} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[var(--text-secondary)] font-medium tracking-widest uppercase">Memuat Perangkat...</p>
      </div>
    );
  }

  // Formatting date and time
  const currentTime = format(time, 'HH:mm:ss');
  const currentDate = format(time, 'EEEE, dd MMMM yyyy', { locale: id });
  const currentHijri = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(time);

  const getNextPrayer = () => {
    if (!prayerTimes) return { name: 'Menunggu...', timeStr: '--:--' };
    const currentMinutes = time.getHours() * 60 + time.getMinutes();

    const prayers = [
      { name: 'Subuh', timeStr: prayerTimes.fajr },
      { name: 'Dzuhur', timeStr: prayerTimes.dhuhr },
      { name: 'Ashar', timeStr: prayerTimes.asr },
      { name: 'Maghrib', timeStr: prayerTimes.maghrib },
      { name: 'Isya', timeStr: prayerTimes.isha }
    ];

    for (const prayer of prayers) {
      if (!prayer.timeStr) continue;
      const [h, m] = prayer.timeStr.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (currentMinutes < prayerMinutes) {
        return prayer;
      }
    }
    return { name: 'Subuh', timeStr: prayerTimes.fajr };
  };

  const nextPrayer = getNextPrayer();

  const getPrayerTimeByName = (name) => {
    if (!name || !prayerTimes) return null;
    const n = name.toLowerCase();
    if (n.includes('subuh') || n.includes('fajr')) return prayerTimes.fajr;
    if (n.includes('dzuhur') || n.includes('dhuhr') || n.includes('zuhur')) return prayerTimes.dhuhr;
    if (n.includes('ashar') || n.includes('asr')) return prayerTimes.asr;
    if (n.includes('maghrib')) return prayerTimes.maghrib;
    if (n.includes('isya') || n.includes('isha')) return prayerTimes.isha;
    return null;
  };

  const getIqamahDuration = (prayerName) => {
    let mins = 10;
    if (!prayerName) return mins;
    if (prayerName === 'SUBUH') mins = prayerConfig?.fajrIqamah;
    else if (prayerName === 'DZUHUR') mins = prayerConfig?.dhuhrIqamah;
    else if (prayerName === 'ASHAR') mins = prayerConfig?.asrIqamah;
    else if (prayerName === 'MAGHRIB') mins = prayerConfig?.maghribIqamah;
    else if (prayerName === 'ISYA') mins = prayerConfig?.ishaIqamah;
    return mins || 10;
  };

  const isFriday = time.getDay() === 5;
  const currentHour = time.getHours();
  const displayStart = prayerConfig?.jumatDisplayStart ?? 6;
  const displayEnd = prayerConfig?.jumatDisplayEnd ?? 14;
  const isFridayTime = previewFridayMode || (isFriday && currentHour >= displayStart && currentHour < displayEnd && prayerConfig?.jumatMode);

  let shouldShowRunningText = false;
  if (displayMode === 'NORMAL') {
    shouldShowRunningText = isFridayTime 
      ? (prayerConfig?.jumatRunningTextEnabled !== false)
      : (displaySetting?.runningTextEnabled !== false);
  } else if (displayMode === 'ADHAN') {
    shouldShowRunningText = displaySetting?.runningTextAdzanEnabled !== false;
  } else if (displayMode === 'IQAMAH_COUNTDOWN') {
    shouldShowRunningText = displaySetting?.runningTextIqomahEnabled !== false;
  } else if (displayMode === 'PRAYER') {
    shouldShowRunningText = displaySetting?.runningTextSholatEnabled === true;
  }

  const renderMainContent = () => {
    switch(displayMode) {
      case 'ADHAN':
        const isAnimated = prayerConfig?.adzanBackground === 'image';

        if (isAnimated) {
          return (
            <div className="flex-1 w-full h-full border-[12px] border-[#c5a059] relative overflow-hidden bg-[#0a192f] flex items-center justify-center">
              <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen blur-[2px]" alt="Background" />
              <div className="absolute right-[-10%] w-[80vw] h-[80vw] max-h-[120vh] max-w-[120vh] rounded-full bg-blue-900/20 border border-blue-400/20 shadow-[0_0_100px_rgba(59,130,246,0.2)] animate-pulse"></div>
              
              <div className="absolute bottom-16 left-16 flex flex-col items-start z-10">
                <span className="text-gray-400 text-[2.5vw] tracking-[0.4em] uppercase mb-[1vh] font-medium">WAKTU ADZAN</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] text-[12vw] font-extrabold tracking-[0.15em] leading-none mb-[2vh] drop-shadow-lg pl-[0.15em]">
                  {currentPrayer || 'ADZAN'}
                </span>
                <span className="text-white text-[6vw] font-bold font-mono tracking-[0.15em] drop-shadow-md pl-[0.15em]">
                  {getPrayerTimeByName(currentPrayer) || currentTime}
                </span>
              </div>
              
              <div className="absolute bottom-24 right-16 w-[35vw] h-2.5 bg-gray-700/80 rounded-full overflow-hidden z-10">
                <style>{`
                  @keyframes adzanProgressLine {
                    0% { width: 0%; }
                    100% { width: 100%; }
                  }
                `}</style>
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.9)]"
                  style={{ animation: `adzanProgressLine ${(prayerConfig?.adzanDuration || 4) * 60}s linear forwards` }}
                ></div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center border-[12px] border-[#c5a059] bg-black relative overflow-hidden">
            <img src={prayerConfig?.adzanBackgroundUrl || "/masjid/adzan_bg_dark.png"} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Background" />
            <style>{`
              @keyframes adzanProgress {
                0% { width: 0%; border-radius: 9999px 0 0 9999px; }
                98% { border-radius: 9999px 0 0 9999px; }
                100% { width: 100%; border-radius: 9999px; }
              }
            `}</style>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-[3vw] text-white mb-[1vh] font-medium tracking-[0.4em]">WAKTU ADZAN</h2>
              <h1 className="text-[14vw] font-extrabold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none mb-[4vh] pl-[0.15em]">
                {currentPrayer || 'ADZAN'}
              </h1>
              
              {/* Golden Pill */}
              <div className="relative w-[35vw] h-[10vh] rounded-full overflow-hidden bg-gradient-to-b from-[#e6c97a] to-[#b38531] border-[4px] border-[#f0d892] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
                {/* Progress bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
                  style={{
                    animation: `adzanProgress ${(prayerConfig?.adzanDuration || 4) * 60}s linear forwards`
                  }}
                ></div>
                
                {/* Time Text */}
                <div className="relative z-10 text-[5.5vw] font-bold font-mono tracking-[0.2em] text-[#fff19a] pl-[0.2em]" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.4)' }}>
                  {getPrayerTimeByName(currentPrayer) || currentTime}
                </div>
              </div>
            </div>
          </div>
        );
      case 'IQAMAH_COUNTDOWN':
        const minutes = Math.floor(iqamahTimeRemaining / 60);
        const seconds = iqamahTimeRemaining % 60;
        const bgOption = prayerConfig?.iqomahBackground || '1';
        const iqomahBgImg = prayerConfig?.iqomahBackgroundUrl || `/masjid/iqomah_bg_${bgOption}.png`;
        if (bgOption === '5' && !prayerConfig?.iqomahBackgroundUrl) {
          return (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center border-[12px] border-[#c5a059] bg-black relative overflow-hidden">
              <img src="/masjid/adzan_bg_dark.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Background" />
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-[4vw] text-white mb-[2vh] font-medium tracking-[0.4em]">IQAMAH</h2>
                <div className="relative w-[40vw] h-[12vh] rounded-full overflow-hidden bg-gradient-to-b from-[#e6c97a] to-[#b38531] border-[4px] border-[#f0d892] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center mb-[4vh]">
                  <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" style={{ width: `${(iqamahTimeRemaining / (getIqamahDuration(currentPrayer) * 60)) * 100}%` }}></div>
                  <div className="relative z-10 text-[6.5vw] font-bold font-mono tracking-[0.2em] text-[#fff19a] pl-[0.2em]" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.4)' }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                </div>
                <div className="bg-[#fcf8e3] text-[#785b28] border-4 border-[#d4b97a] px-[4vw] py-[1.5vh] rounded-full text-[2.5vw] font-bold shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-w-[85vw] truncate tracking-wide">
                  {prayerConfig?.iqomahMessage || "Luruskan dan rapatkan shaf untuk kesempurnaan shalat"}
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center relative w-full h-full overflow-hidden bg-black">
            <img src={iqomahBgImg} className="absolute inset-0 w-full h-full object-cover" alt="Background" />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-[#967d3e] text-[3.5vw] font-bold tracking-[0.4em] uppercase mb-[2vh] drop-shadow-md" style={{ textShadow: bgOption === '3' ? '2px 2px 5px rgba(0,0,0,0.8)' : '2px 2px 8px rgba(255,255,255,0.8)' }}>
                IQAMAH
              </h3>
              <div className={`text-[20vw] font-extrabold tracking-[0.2em] leading-none mb-[6vh] pl-[0.2em] font-mono ${bgOption === '3' ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'text-[#102a43] drop-shadow-2xl'}`} style={{ textShadow: bgOption === '3' ? '3px 3px 15px rgba(0,0,0,0.8)' : '4px 4px 15px rgba(255,255,255,0.9), -2px -2px 10px rgba(0,0,0,0.2)' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="bg-[#fcf8e3] text-[#785b28] border-4 border-[#d4b97a] px-[4vw] py-[1.5vh] rounded-full text-[2.5vw] font-bold shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-w-[85vw] truncate tracking-wide">
                {prayerConfig?.iqomahMessage || "Luruskan dan rapatkan shaf untuk kesempurnaan shalat"}
              </div>
            </div>
          </div>
        );
      case 'PRAYER': {
        const hasCustomBg = !!prayerConfig?.sholatBackgroundUrl;
        const isAnim = !hasCustomBg && prayerConfig?.adzanBackground === 'image';
        const bgImg = prayerConfig?.sholatBackgroundUrl || prayerConfig?.adzanBackgroundUrl || "/masjid/adzan_bg_dark.png";
        
        return (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center bg-black relative overflow-hidden">
            {isAnim ? (
              <>
                <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen blur-[2px] grayscale" alt="Background" />
                <div className="absolute right-[-10%] w-[80vw] h-[80vw] max-h-[120vh] max-w-[120vh] rounded-full bg-blue-900/10 border border-blue-400/10 shadow-[0_0_100px_rgba(59,130,246,0.1)]"></div>
              </>
            ) : (
              <img src={bgImg} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale" alt="Background" />
            )}
            
            <div className="relative z-10 flex flex-col items-center max-w-[90vw] px-8">
              <h2 className="text-[3vw] text-gray-500 mb-[2vh] font-medium tracking-[0.4em] uppercase drop-shadow-md">SHOLAT SEDANG BERLANGSUNG</h2>
              <h1 className="text-[14vw] font-extrabold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] opacity-90 leading-none mb-[6vh] pl-[0.2em]">
                {currentPrayer || 'SHOLAT'}
              </h1>
              
              <div className="relative w-[45vw] h-[2vh] rounded-full overflow-hidden bg-gray-800/80 border border-gray-600/50 shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-[6vh]">
                <style>{`
                  @keyframes sholatProgress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                  }
                `}</style>
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gray-500 to-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  style={{
                    animation: `sholatProgress ${(prayerConfig?.sholatDuration || 10) * 60}s linear forwards`
                  }}
                ></div>
              </div>
              
              <div className="text-[3vw] text-gray-500 font-medium tracking-[0.3em] uppercase drop-shadow-md">
                {prayerConfig?.sholatScreenMessage || 'Luruskan dan Rapatkan Shaf'}
              </div>
            </div>
          </div>
        );
      }
      default:
      case 'NORMAL':
        const commonProps = {
          time,
          mosqueProfile,
          prayerTimes,
          nextPrayer,
          currentDate,
          currentHijri,
          prayerConfig,
          displaySetting,
          currentBgImage
        };
        
        let ActiveLayout;
        
        if (isFridayTime) {
          ActiveLayout = LayoutJumat;
        } else if (layoutStyle === 'ultrawide') {
          ActiveLayout = LayoutUltraWide;
        } else if (layoutStyle === 'simplicity') {
          ActiveLayout = LayoutSimplicity;
        } else if (layoutStyle === 'classic') {
          ActiveLayout = LayoutClassic;
        } else if (layoutStyle === 'modern') {
          ActiveLayout = LayoutModern;
        } else if (layoutStyle === 'minimalist') {
          ActiveLayout = LayoutMinimalist;
        } else {
          ActiveLayout = LayoutSignature;
        }

        return (
          <main className="w-full h-full relative bg-black overflow-hidden transition-all duration-1000"
                style={{
                  backgroundImage: (showInfoSlide && displaySetting?.infoSlideItems?.length > 0) ? 'none' : `url('${currentBgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'background-image 1s ease-in-out'
                }}>
            
            {(showInfoSlide && displaySetting?.infoSlideItems?.length > 0 && !isFridayTime) ? (
              <InfoSlideScreen displaySetting={displaySetting} />
            ) : (
              <ActiveLayout {...commonProps} fridayInfo={fridayInfo} />
            )}
            
            <div className="absolute bottom-4 left-4 text-xs text-white opacity-30 flex gap-4 z-50 mix-blend-difference">
              <span>WakeLock: {isSupported ? (isActive ? 'Active' : 'Released') : 'Unsupported'}</span>
              <button onClick={() => {
                setDisplayMode('ADHAN');
                setCurrentPrayer('ASHAR');
                setTimeout(() => {
                  setDisplayMode('IQAMAH_COUNTDOWN');
                  setIqamahTimeRemaining(10);
                }, 5000);
              }} className="underline">Simulate Flow</button>
            </div>
          </main>
        );
    }
  };

  return (
    <div onDoubleClick={requestFullscreen} className="tv-display bg-black w-screen h-screen overflow-hidden font-sans flex flex-col cursor-default">
      <div className="flex-1 relative overflow-hidden">
        {renderMainContent()}
      </div>

      {shouldShowRunningText && (
        <footer className="w-full bg-black/90 text-white py-4 flex items-center z-50 border-t border-white/20 shadow-[0_-5px_15px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div 
            className="whitespace-nowrap animate-marquee font-extrabold tracking-wide text-yellow-400" 
            style={{ 
              animationDuration: `${displaySetting?.runningTextSpeed || 25}s`,
              fontSize: `${displaySetting?.runningTextSize || 64}px` 
            }}
          >
            {(isFridayTime && fridayInfo?.runningText) 
              ? (
                (() => {
                  try {
                    const texts = JSON.parse(fridayInfo.runningText);
                    return texts.length > 0 ? texts.join(' *** ') : runningText;
                  } catch(e) {
                    return runningText;
                  }
                })()
              ) 
              : runningText}
          </div>
        </footer>
      )}
    </div>
  );
}
