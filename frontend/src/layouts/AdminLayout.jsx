import { useState, useEffect } from 'react';
import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MonitorSmartphone, MessageSquare, Building2, LogOut, Moon, Sun, Users, User, Clock, CalendarDays, FileText } from 'lucide-react';
import { useDialog } from '../contexts/DialogContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function AdminLayout() {
  const token = localStorage.getItem('admin_token');
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirm } = useDialog();

  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (token) {
      axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCurrentUser(res.data))
      .catch(err => {
        console.error('Error fetching user:', err);
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
        <div className="w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    const isConfirmed = await showConfirm({
      title: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari aplikasi? Anda harus masuk kembali untuk melanjutkan.',
      confirmText: 'Ya, Keluar',
      type: 'logout'
    });
    
    if (isConfirmed) {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Profil Masjid', path: '/admin/profile', icon: Building2, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageProfile },
    { name: 'Waktu Sholat', path: '/admin/prayer-config', icon: Clock, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManagePrayerTimes },
    { name: 'Shalat Jumat', path: '/admin/friday', icon: CalendarDays, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageFridaySchedule },
    { name: 'Adzan Screen', path: '/admin/adzan-screen', icon: MonitorSmartphone, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageAdzanScreen },
    { name: 'Iqomah Screen', path: '/admin/iqomah-screen', icon: MonitorSmartphone, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageIqomahScreen },
    { name: 'Sholat Screen', path: '/admin/sholat-screen', icon: MonitorSmartphone, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageSholatScreen },
    { name: 'Devices', path: '/admin/devices', icon: MonitorSmartphone, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageDevices },
    { name: 'Running Text', path: '/admin/announcements', icon: MessageSquare, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageText },
    { name: 'Layout Style', path: '/admin/layout', icon: MonitorSmartphone, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageLayout },
    { name: 'Pengguna', path: '/admin/users', icon: Users, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageUsers },
    { name: 'Audit Log', path: '/admin/audit-logs', icon: FileText, show: currentUser?.role === 'SUPER_ADMIN' || currentUser?.canManageLogs }
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] lg:flex">
      {/* Desktop Sidebar (Sticky) */}
      <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 mx-4 my-4 bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-color)] shadow-sm overflow-hidden z-20">
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient shadow-md flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Masjid System</h2>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-[var(--primary-500)] text-white shadow-[0_4px_12px_rgba(4,120,87,0.25)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-color)] hover:translate-x-1 hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-current'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <Link 
            to="/admin/my-profile"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-500)] font-medium hover:bg-[var(--bg-color)] dark:hover:bg-[var(--bg-color)] rounded-xl transition-colors mb-2"
          >
            <User size={18} />
            Profil Saya
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pb-24 lg:pb-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-6 py-5 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center shadow-md">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/admin/my-profile"
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--bg-color)] transition-colors"
            >
              <User size={22} />
            </Link>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-color)] transition-colors"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-red-500 p-2.5">
              <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 lg:p-8 flex-1 overflow-x-hidden">
          <div key={location.pathname} className="max-w-7xl mx-auto w-full animate-slide-up pb-32 lg:pb-8">
            <Outlet />
          </div>
        </div>
        
        {/* Desktop Fixed Theme Toggle & Logout (Top Right) */}
        <div className="hidden lg:flex fixed top-6 right-8 gap-4 z-30">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-sm text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border-color)] pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[24px]">
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-3 gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className="flex flex-col items-center justify-center gap-1.5 min-w-[5.5rem] min-h-[4.5rem] px-2 snap-center rounded-xl active:scale-95 transition-transform"
              >
                <div className={`p-3 rounded-full transition-colors shadow-sm ${
                  isActive ? 'bg-[var(--primary-500)]/15 text-[var(--primary-500)] shadow-inner' : 'text-[var(--text-secondary)] bg-[var(--bg-color)]'
                }`}>
                  <Icon size={24} className={isActive ? 'fill-[var(--primary-500)]/20' : ''} />
                </div>
                <span className={`text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
