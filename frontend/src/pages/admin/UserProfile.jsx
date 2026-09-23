import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, Mail, ShieldAlert } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function UserProfile() {
  const [profile, setProfile] = useState({ username: '', email: '', role: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setError('Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/users/${profile.id}`, 
        {
          username: profile.username,
          email: profile.email,
          password: password,
          role: profile.role,
          canManageDevices: profile.canManageDevices,
          canManageText: profile.canManageText,
          canManageProfile: profile.canManageProfile,
          canManageUsers: profile.canManageUsers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profil berhasil diperbarui!');
      setPassword('');
    } catch (err) {
      console.error('Failed to update profile', err);
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-[var(--text-secondary)] font-medium flex items-center justify-center gap-3">
      <span className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
      Memuat profil...
    </div>
  );

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Profil Saya</h2>
          <p className="text-[var(--text-secondary)]">Kelola informasi akun Anda.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mt-4 md:mt-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-8 max-w-3xl">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{success}</p>
          </div>
        )}

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <User size={18} />
              </div>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="form-control pl-11"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="form-control pl-11"
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Password Baru (Opsional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />
        </div>



      </div>
    </div>
  );
}
