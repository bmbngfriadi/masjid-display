import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Megaphone, Clock, Activity, Settings, Calendar, PlusCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Dashboard() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ name: 'Menunggu...', timeStr: '--:--' });
  const [stats, setStats] = useState({ devices: 0, announcements: 0 });
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPrayerTimes();
    fetchStats();
    updateGreeting();
    
    const timer = setInterval(() => {
      calculateNextPrayer();
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes]);

  const fetchPrayerTimes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prayer/today`);
      setPrayerTimes(res.data);
    } catch (err) {
      console.error('Failed to fetch prayer times for dashboard', err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [devicesRes, announcementsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/devices`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/running-text`)
      ]);
      setStats({
        devices: devicesRes.data?.length || 0,
        announcements: announcementsRes.data?.length || 0
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 10) setGreeting('Selamat Pagi');
    else if (hour >= 10 && hour < 15) setGreeting('Selamat Siang');
    else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Subuh', timeStr: prayerTimes.fajr },
      { name: 'Dzuhur', timeStr: prayerTimes.dhuhr },
      { name: 'Ashar', timeStr: prayerTimes.asr },
      { name: 'Maghrib', timeStr: prayerTimes.maghrib },
      { name: 'Isya', timeStr: prayerTimes.isha }
    ];

    let found = false;
    for (const prayer of prayers) {
      if (!prayer.timeStr) continue;
      const [h, m] = prayer.timeStr.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (currentMinutes < prayerMinutes) {
        setNextPrayer(prayer);
        found = true;
        break;
      }
    }
    if (!found) {
      setNextPrayer({ name: 'Subuh', timeStr: prayerTimes.fajr });
    }
  };

  const formattedDate = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full pb-12">
      <div className="page-header mb-8 bg-primary-gradient text-white p-8 -mx-4 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">{greeting}, Admin!</h2>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formattedDate}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg text-center min-w-[200px]">
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Menuju {nextPrayer.name}</p>
            <p className="text-4xl font-bold font-mono tracking-tight">{nextPrayer.timeStr}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/devices" className="glass-card p-6 flex items-center hover:scale-[1.02] transition-transform cursor-pointer group">
          <div className="stat-icon-box bg-primary-gradient mr-5 shadow-[0_4px_12px_rgba(4,120,87,0.2)] group-hover:scale-110 transition-transform">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">TV Aktif</p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">{stats.devices}</p>
          </div>
        </Link>

        <Link to="/admin/announcements" className="glass-card p-6 flex items-center hover:scale-[1.02] transition-transform cursor-pointer group">
          <div className="stat-icon-box bg-success-gradient mr-5 shadow-[0_4px_12px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">Pengumuman</p>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">{stats.announcements}</p>
          </div>
        </Link>

        <Link to="/admin/prayer-config" className="glass-card p-6 flex items-center hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-32 h-32" />
          </div>
          <div className="stat-icon-box bg-warning-gradient mr-5 shadow-[0_4px_12px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform relative z-10">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">Pengaturan Waktu</p>
            <div className="flex items-center gap-1 mt-1 text-[var(--primary-600)] font-medium">
              Atur Sekarang <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>
      
      <div className="mt-8 mb-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--primary-500)]" />
          Jadwal Sholat Hari Ini
        </h3>
        {prayerTimes ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Subuh', timeStr: prayerTimes.fajr },
              { name: 'Terbit', timeStr: prayerTimes.sunrise },
              { name: 'Dzuhur', timeStr: prayerTimes.dhuhr },
              { name: 'Ashar', timeStr: prayerTimes.asr },
              { name: 'Maghrib', timeStr: prayerTimes.maghrib },
              { name: 'Isya', timeStr: prayerTimes.isha }
            ].map((prayer, idx) => {
              const isNext = prayer.name === nextPrayer.name;
              return (
                <div 
                  key={prayer.name} 
                  className={`glass-card p-5 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                    isNext ? 'border-[var(--primary-500)] shadow-[0_10px_25px_rgba(4,120,87,0.2)] scale-105' : 'border-transparent hover:shadow-xl hover:border-[var(--primary-500)]/30'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {isNext && (
                    <div className="absolute -top-3 bg-[var(--primary-500)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-widest">
                      BERIKUTNYA
                    </div>
                  )}
                  <p className={`text-sm font-bold uppercase tracking-widest ${isNext ? 'text-[var(--primary-600)]' : 'text-[var(--text-secondary)]'}`}>
                    {prayer.name}
                  </p>
                  <p className={`text-3xl font-extrabold mt-2 font-mono ${isNext ? 'text-[var(--text-primary)] drop-shadow-md' : 'text-[var(--primary-500)]'}`}>
                    {prayer.timeStr}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-6 min-h-[200px] flex flex-col items-center justify-center text-[var(--text-secondary)]">
            <span className="w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mb-4"></span>
            <p className="font-medium">Memuat jadwal sholat...</p>
          </div>
        )}
      </div>
    </div>
  );
}
