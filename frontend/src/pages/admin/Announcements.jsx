import { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Plus, Trash2, Edit2, PlayCircle } from 'lucide-react';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Announcements() {
  const { showAlert, showConfirm, showPrompt } = useDialog();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displaySetting, setDisplaySetting] = useState({ runningTextSpeed: 25 });

  const fetchDisplaySetting = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/display-setting`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisplaySetting(res.data);
    } catch (error) {
      console.error('Failed fetching display setting', error);
    }
  };

  const updateSpeed = async (newSpeed) => {
    try {
      setDisplaySetting(prev => ({ ...prev, runningTextSpeed: newSpeed }));
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/display-setting`, { runningTextSpeed: newSpeed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Failed updating speed', e);
    }
  };

  const updateSize = async (newSize) => {
    try {
      setDisplaySetting(prev => ({ ...prev, runningTextSize: newSize }));
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/display-setting`, { runningTextSize: newSize }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Failed updating size', e);
    }
  };

  const fetchRunningTexts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/running-text`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
    } catch (error) {
      console.error('Failed fetching texts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRunningTexts();
    fetchDisplaySetting();
  }, []);

  const handleAdd = async () => {
    const text = await showPrompt({
      title: 'Tambah Teks',
      message: 'Masukkan teks berjalan yang baru:',
    });
    if (!text) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/running-text`, { text, isActive: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRunningTexts();
    } catch (e) {
      showAlert({ title: 'Gagal', message: 'Gagal menambah teks', type: 'error' });
    }
  };

  const handleEdit = async (id, oldText) => {
    const newText = await showPrompt({
      title: 'Ubah Teks',
      message: 'Ubah teks berjalan:',
      defaultValue: oldText
    });
    if (!newText || newText === oldText) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/running-text/${id}`, { text: newText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRunningTexts();
    } catch (e) {
      showAlert({ title: 'Gagal', message: 'Gagal mengubah teks', type: 'error' });
    }
  };

  const updateDisplaySettingField = async (field, value) => {
    try {
      setDisplaySetting(prev => ({ ...prev, [field]: value }));
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/display-setting`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(`Failed updating ${field}`, e);
    }
  };

  const handleToggleActive = async (id, text, currentStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/running-text/${id}`, { text, isActive: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRunningTexts();
    } catch (e) {
      showAlert({ title: 'Gagal', message: 'Gagal mengubah status', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: 'Hapus Teks',
      message: 'Apakah Anda yakin ingin menghapus teks ini?',
      type: 'warning',
      confirmText: 'Hapus'
    });
    if (!isConfirmed) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_BASE_URL}/running-text/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRunningTexts();
    } catch (e) {
      showAlert({ title: 'Gagal', message: 'Gagal menghapus teks', type: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Pengumuman & Running Text</h2>
          <p className="text-[var(--text-secondary)]">Kelola pesan dan teks yang berjalan di layar TV.</p>
        </div>
        <button onClick={handleAdd} className="btn-primary mt-4 md:mt-0">
          <Plus size={18} />
          Tambah Baru
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-[var(--primary-500)]">
          <div className="flex items-center text-[var(--text-primary)] mb-4">
            <PlayCircle className="w-6 h-6 mr-3 text-[var(--primary-500)]" />
            <h3 className="font-extrabold text-lg tracking-tight">Preview Running Text Aktif</h3>
          </div>
            <div className="bg-[#0a0a0a] text-white p-4 rounded-xl overflow-hidden flex items-center h-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-500)]/10 to-transparent"></div>
              <div 
                className="whitespace-nowrap animate-marquee font-bold relative z-10 text-white drop-shadow-md" 
                style={{ 
                  animationDuration: `${displaySetting.runningTextSpeed || 25}s`,
                  fontSize: `${(displaySetting.runningTextSize || 64) * 0.4}px` // Scale down for preview
                }}
              >
                {announcements.filter(a => a.isActive).map(a => a.text).join(' • ')}
              </div>
            </div>

          <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors" onClick={() => updateDisplaySettingField('runningTextEnabled', !displaySetting.runningTextEnabled)}>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Status Teks Berjalan (Layar Normal)</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Tampilkan atau sembunyikan teks berjalan di layar utama TV.</p>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${displaySetting.runningTextEnabled !== false ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${displaySetting.runningTextEnabled !== false ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors" onClick={() => updateDisplaySettingField('runningTextAdzanEnabled', !displaySetting.runningTextAdzanEnabled)}>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Teks Berjalan Saat Adzan</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Tampilkan atau sembunyikan saat layar waktu Adzan.</p>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${displaySetting.runningTextAdzanEnabled !== false ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${displaySetting.runningTextAdzanEnabled !== false ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors" onClick={() => updateDisplaySettingField('runningTextIqomahEnabled', !displaySetting.runningTextIqomahEnabled)}>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Teks Berjalan Saat Iqomah</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Tampilkan atau sembunyikan saat hitung mundur Iqomah.</p>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${displaySetting.runningTextIqomahEnabled !== false ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${displaySetting.runningTextIqomahEnabled !== false ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors" onClick={() => updateDisplaySettingField('runningTextSholatEnabled', !displaySetting.runningTextSholatEnabled)}>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Teks Berjalan Saat Sholat</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Tampilkan atau sembunyikan teks saat Sholat berlangsung.</p>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${displaySetting.runningTextSholatEnabled ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${displaySetting.runningTextSholatEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-[var(--text-primary)]">Kecepatan Teks Berjalan</label>
              <span className="text-xs font-mono bg-[var(--primary-500)]/10 text-[var(--primary-600)] dark:text-[var(--primary-500)] px-2 py-1 rounded">
                {displaySetting.runningTextSpeed} detik
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">Semakin kecil angkanya, semakin cepat teks berjalan.</p>
            <input 
              type="range" 
              min="5" 
              max="60" 
              value={displaySetting.runningTextSpeed || 25} 
              onChange={(e) => updateSpeed(parseInt(e.target.value))}
              className="w-full accent-[var(--primary-500)]" 
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>Sangat Cepat</span>
              <span>Lambat</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-[var(--text-primary)]">Ukuran Teks Berjalan</label>
              <span className="text-xs font-mono bg-[var(--primary-500)]/10 text-[var(--primary-600)] dark:text-[var(--primary-500)] px-2 py-1 rounded">
                {displaySetting.runningTextSize || 64} px
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">Ubah ukuran tulisan running text pada layar TV.</p>
            <input 
              type="range" 
              min="32" 
              max="120" 
              value={displaySetting.runningTextSize || 64} 
              onChange={(e) => updateSize(parseInt(e.target.value))}
              className="w-full accent-[var(--primary-500)]" 
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>Kecil</span>
              <span>Besar</span>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20">
            <h3 className="font-bold text-[var(--text-primary)]">Daftar Konten</h3>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <div className="p-8 text-center text-[var(--text-secondary)] font-medium flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
                Memuat konten...
              </div>
            ) : announcements.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">Belum ada teks berjalan. Silakan tambah baru.</div>
            ) : announcements.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--primary-500)]/10 text-[var(--primary-600)] dark:text-[var(--primary-500)]">
                      RUNNING TEXT
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">ID: {item.id.substring(0,6)}...</span>
                  </div>
                  <p className="text-[var(--text-primary)] leading-relaxed">{item.text}</p>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4 pt-4 md:pt-0 border-t border-[var(--border-color)] md:border-0 justify-between md:justify-end">
                  <label className="flex items-center cursor-pointer mr-2 md:mr-4">
                    <div className="relative" onClick={() => handleToggleActive(item.id, item.text, item.isActive)}>
                      <div className={`w-12 h-6 rounded-full transition-colors ${item.isActive ? 'bg-[var(--primary-500)] shadow-[0_0_8px_rgba(4,120,87,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${item.isActive ? 'transform translate-x-6' : ''} shadow-sm`}></div>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-[var(--text-secondary)] hidden md:block">
                      {item.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </label>
                  
                  <button onClick={() => handleEdit(item.id, item.text)} className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
