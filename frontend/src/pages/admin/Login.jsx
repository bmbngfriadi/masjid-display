import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, KeyRound, Loader2, User, Sun, Moon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

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
            Masjid System
          </h1>
          <p className="text-base md:text-lg text-white/90 font-light max-w-md mx-auto drop-shadow-md">
            Sistem Informasi Masjid Baitul Jannah.
          </p>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:justify-center p-0 lg:p-12 -mt-8 lg:mt-0 relative z-20 flex-1">
        <div className="bg-[var(--bg-card)] rounded-t-[40px] lg:rounded-3xl w-full max-w-md p-8 pt-12 lg:p-10 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] lg:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t lg:border-2 border-[var(--primary-500)]/30 animate-drawer-up lg:animate-slide-up flex-1 lg:flex-none flex flex-col justify-center">

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Login</h2>
            <p className="text-[var(--text-secondary)]">Silahkan login untuk melanjutkan</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3 animate-shake">
              <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <User size={18} />
                </div>
                <input
                  className="form-control pl-11 bg-[var(--bg-color)]"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <KeyRound size={18} />
                </div>
                <input
                  className="form-control pl-11 bg-[var(--bg-color)]"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="btn-primary w-full mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access System'
              )}
            </button>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/forgot-password')}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors font-medium"
              >
                Lupa Password?
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/register')}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors font-medium"
              >
                Belum punya akun? <span className="text-[var(--primary-500)]">Daftar</span>
              </button>
            </div>
          </form>

          <div className="mt-auto pt-12 text-center">
            <p className="text-xs text-[var(--text-secondary)] opacity-60 font-medium">
              &copy; {new Date().getFullYear()} Masjid Baitul Jannah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
