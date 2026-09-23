import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, Shield, Sun, Moon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    let mounted = true;
    
    const verify = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);
        if (mounted) {
          setStatus('success');
          setMessage(res.data.message || 'Email berhasil diverifikasi.');
          setTimeout(() => {
            if (mounted) navigate('/admin/login');
          }, 3000);
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Gagal memverifikasi email. Token tidak valid atau sudah kedaluwarsa.');
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg-color)] relative">
      
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-lg text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Left Panel (Brand / Image) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 text-white text-center relative bg-primary-gradient overflow-hidden min-h-[40vh] lg:min-h-screen">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/masjid/mosque_bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10 animate-slide-down mt-8 lg:mt-0">
          <img 
            src="/masjid/mosque-icon.svg" 
            alt="Masjid Logo" 
            className="w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-6 drop-shadow-2xl" 
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-xl">
            Verifikasi Akun
          </h1>
          <p className="text-base md:text-lg text-white/90 font-light max-w-md mx-auto drop-shadow-md">
            Sistem Informasi Masjid Baitul Jannah.
          </p>
        </div>
      </div>

      {/* Right Panel (Status) */}
      <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:justify-center p-0 lg:p-12 -mt-8 lg:mt-0 relative z-20 flex-1">
        <div className="bg-[var(--bg-card)] rounded-t-[40px] lg:rounded-3xl w-full max-w-md p-8 pt-12 lg:p-10 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] lg:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t lg:border-2 border-[var(--primary-500)]/30 animate-drawer-up lg:animate-slide-up flex-1 lg:flex-none flex flex-col justify-center">

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Status Verifikasi</h2>
            <p className="text-[var(--text-secondary)]">Sedang memproses permintaan Anda...</p>
          </div>

          {status === 'loading' && (
            <div className="mb-6 p-8 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] text-center flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-[var(--primary-500)] animate-spin" />
              <p className="text-lg font-medium text-[var(--text-primary)]">Memverifikasi Email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mb-6 p-6 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-center flex flex-col items-center gap-3 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500 mb-2" />
              <p className="text-lg font-bold text-green-700 dark:text-green-400">Verifikasi Berhasil!</p>
              <p className="text-sm font-medium text-green-600/80 dark:text-green-400/80 mb-4">{message}</p>
              <p className="text-xs text-[var(--text-secondary)]">Anda akan dialihkan ke halaman login...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center flex flex-col items-center gap-3 animate-fade-in">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-500 mb-2" />
              <p className="text-lg font-bold text-red-700 dark:text-red-400">Verifikasi Gagal</p>
              <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80 mb-4">{message}</p>
              <button
                onClick={() => navigate('/admin/login')}
                className="btn-primary w-full mt-2"
              >
                Kembali ke Login
              </button>
            </div>
          )}

          <div className="mt-auto pt-12 text-center">
            <p className="text-xs text-[var(--text-secondary)] opacity-60 font-medium">
              &copy; {new Date().getFullYear()} Takmir Masjid Baitul Jannah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
