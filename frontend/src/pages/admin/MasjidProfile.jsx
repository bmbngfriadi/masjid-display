import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Save, Upload, MapPin, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

const LOGO_GALLERY = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23047857' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/%3E%3Cpath d='M19 3v4'/%3E%3Cpath d='M21 5h-4'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23047857' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2l-3 4h6z'/%3E%3Cpath d='M9 6v12'/%3E%3Cpath d='M15 6v12'/%3E%3Cpath d='M5 10v8'/%3E%3Cpath d='M19 10v8'/%3E%3Cpath d='M2 18h20'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 2h8'/%3E%3Cpath d='M12 2v4'/%3E%3Cpath d='M10 6h4l2 10H8L10 6z'/%3E%3Cpath d='M8 16h8'/%3E%3Cpath d='M12 16v4'/%3E%3Cpath d='M10 20h4'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='16' height='20' x='4' y='2' rx='2' ry='2'/%3E%3Cpath d='M9 22v-4h6v4'/%3E%3Cpath d='M8 6h.01'/%3E%3Cpath d='M16 6h.01'/%3E%3Cpath d='M12 6h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M12 14h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3Cpath d='M16 14h.01'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M8 14h.01'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23047857' d='M10,90 L90,90 L90,65 L10,65 Z' /%3E%3Cpath fill='%23fff' d='M15,90 L15,75 A10,10 0 0 1 35,75 L35,90 Z' /%3E%3Cpath fill='%23fff' d='M40,90 L40,75 A10,10 0 0 1 60,75 L60,90 Z' /%3E%3Cpath fill='%23fff' d='M65,90 L65,75 A10,10 0 0 1 85,75 L85,90 Z' /%3E%3Cpath fill='%23047857' d='M25,65 C25,35 50,20 50,20 C50,20 75,35 75,65 Z' /%3E%3Cpath fill='%23fff' d='M28,55 Q50,45 72,55 L73,58 Q50,48 27,58 Z' /%3E%3Cpath fill='%23fff' d='M33,45 Q50,37 67,45 L68,48 Q50,40 32,48 Z' /%3E%3Crect fill='%23047857' x='12' y='30' width='8' height='35' /%3E%3Crect fill='%23047857' x='10' y='45' width='12' height='4' /%3E%3Crect fill='%23047857' x='10' y='35' width='12' height='4' /%3E%3Ccircle fill='%23047857' cx='16' cy='25' r='4' /%3E%3Crect fill='%23047857' x='80' y='30' width='8' height='35' /%3E%3Crect fill='%23047857' x='78' y='45' width='12' height='4' /%3E%3Crect fill='%23047857' x='78' y='35' width='12' height='4' /%3E%3Ccircle fill='%23047857' cx='84' cy='25' r='4' /%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23047857' d='M 10 90 L 10 55 C 5 50 15 35 17.5 30 C 20 35 30 50 25 55 L 25 70 L 35 70 L 35 45 C 25 40 45 25 50 20 C 55 25 75 40 65 45 L 65 70 L 75 70 L 75 55 C 70 50 80 35 82.5 30 C 85 35 95 50 90 55 L 90 90 L 87.5 90 L 87.5 80 Q 82.5 70 77.5 80 L 77.5 90 L 60 90 L 60 75 Q 55 60 50 55 Q 45 60 40 75 L 40 90 L 22.5 90 L 22.5 80 Q 17.5 70 12.5 80 L 12.5 90 Z'/%3E%3Cpath fill='%23047857' d='M 51 6 A 6 6 0 1 1 45 12 A 5 5 0 1 0 51 6 Z'/%3E%3C/svg%3E"
];

export default function MasjidProfile() {
  const [profile, setProfile] = useState({ name: '', address: '', logoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/mosque`);
      if (res.data) {
        setProfile({
          name: res.data.name || '',
          address: res.data.address || '',
          logoUrl: res.data.logoUrl || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/mosque`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert({ title: 'Berhasil', message: 'Profil berhasil disimpan! TV akan otomatis diperbarui.', type: 'success' });
    } catch (err) {
      console.error('Failed to save profile', err);
      showAlert({ title: 'Gagal', message: 'Gagal menyimpan profil.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress the image before setting it (max 512x512 for logo)
      const compressedBase64 = await compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.9, // Higher quality for logos
        type: file.type === 'image/png' ? 'image/png' : 'image/webp' // Keep PNG for transparency
      });
      
      setProfile({ ...profile, logoUrl: compressedBase64 });
    } catch (err) {
      console.error('Compression failed:', err);
      showAlert({ title: 'Error', message: 'Gagal memproses gambar logo. Silakan coba gambar lain.', type: 'error' });
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-[var(--text-secondary)] font-medium flex items-center justify-center gap-3">
      <span className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
      Memuat profil masjid...
    </div>
  );

  return (
    <div className="w-full animate-slide-up">
      <div className="page-header">
        <div>
          <h2 className="page-title">Profil Masjid</h2>
          <p className="text-[var(--text-secondary)]">Ubah identitas visual dan informasi masjid Anda.</p>
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

      <div className="glass-card p-6 md:p-8 space-y-8">
        
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Nama Masjid</label>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Set your masjid name here, e.g: Masjid At Taqwa, etc.</p>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="form-control"
              placeholder="Contoh: Masjid Baitul Jannah"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Masjid</label>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Type your masjid address with phone information if necessary.</p>
            <textarea
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              rows="2"
              className="form-control resize-none"
              placeholder="Contoh: Jl. Masjid No. 1, Kota Baru"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)]">
          <label className="form-label mb-1">Masjid Logo Gallery</label>
          <p className="text-xs text-[var(--text-secondary)] mb-6">Pilih logo default atau unggah logo kustom masjid Anda.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
            {LOGO_GALLERY.map((url, index) => (
              <div 
                key={index}
                onClick={() => setProfile({ ...profile, logoUrl: url })}
                className={`cursor-pointer border-2 rounded-2xl aspect-square flex flex-col items-center justify-center transition-all p-3 ${
                  profile.logoUrl === url 
                    ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/5 shadow-[0_4px_12px_rgba(4,120,87,0.15)] scale-105' 
                    : 'border-transparent bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
              >
                <img 
                  src={url} 
                  alt={`Logo ${index + 1}`} 
                  className="w-full h-full object-contain transition-transform duration-300"
                  style={{ filter: profile.logoUrl === url ? 'drop-shadow(0px 4px 6px rgba(4,120,87,0.3))' : 'none' }}
                />
              </div>
            ))}
          </div>

          <div className="form-group border-t border-dashed border-[var(--border-color)] pt-6 mt-6">
            <label className="form-label">Unggah Logo Kustom</label>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Format disarankan: PNG (Transparan) atau SVG. Maksimal 2MB.</p>
            <p className="text-xs text-[var(--text-secondary)] mb-3">Sistem akan secara pintar memampatkan (compress) ukuran logo secara otomatis tanpa batasan ukuran file awal.</p>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--primary-500)] text-[var(--primary-600)] dark:text-[var(--primary-500)] font-medium hover:bg-[var(--primary-500)]/10 transition-colors">
                <ImageIcon size={18} />
                Pilih File Gambar
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
              {profile.logoUrl && !LOGO_GALLERY.includes(profile.logoUrl) && (
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                  ✓ Logo Kustom Aktif
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
