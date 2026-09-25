import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, CheckCircle, XCircle, Timer, Trash2, Smartphone, MonitorPlay, Clock } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { useDialog } from '../../contexts/DialogContext';

export default function IqomahScreenConfig() {
  const { showAlert } = useDialog();
  const [config, setConfig] = useState({
    iqomahBackground: '1',
    iqomahMessage: 'Luruskan dan rapatkan shaf untuk kesempurnaan shalat',
    iqomahAlarmEnabled: false,
    iqomahAlarmSound: 'beep',
    iqomahAlarmTime: 10,
    iqomahAlarmEnd: 0,
    fajrIqamah: 10,
    dhuhrIqamah: 10,
    asrIqamah: 10,
    maghribIqamah: 5,
    ishaIqamah: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const res = await fetch(`${API_BASE_URL}/prayer-config`);
      const data = await res.json();
      if (data) {
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch config', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8
      });
      
      setConfig(prev => ({ ...prev, iqomahBackgroundUrl: compressedBase64 }));
      setImagePreview(compressedBase64);
    } catch (err) {
      console.error('Compression failed:', err);
      showAlert({ title: 'Gagal', message: 'Gagal memproses gambar. Silakan coba gambar lain.', type: 'error' });
    }
  };

  const removeBackground = () => {
    setConfig(prev => ({ ...prev, iqomahBackgroundUrl: null }));
    setImagePreview(null);
  };

  const handlePreview = async (e) => {
    if (e) e.preventDefault();
    try {
      setPreviewing(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const token = localStorage.getItem('admin_token');
      
      // Save config first so TV gets the updated alarm time before preview starts
      await fetch(`${API_BASE_URL}/prayer-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      await fetch(`${API_BASE_URL}/prayer-config/preview-iqomah`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTimeout(() => setPreviewing(false), 15000);
    } catch (error) {
      console.error('Failed to trigger preview', error);
      setPreviewing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(`${API_BASE_URL}/prayer-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error('Failed to save configuration');
      
      setMessage({ text: 'Tampilan Layar Iqomah berhasil disimpan!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)]"></div>
      </div>
    );
  }

  // Pre-defined visual options mapped to 1-5
  const backgrounds = [
    { id: '1', name: 'Preview Background 1', image: '/masjid/iqomah_bg_1.png', label: 'Emas Elegan' },
    { id: '2', name: 'Preview Background 2', image: '/masjid/iqomah_bg_2.png', label: 'Perak Mewah' },
    { id: '3', name: 'Preview Background 3', image: '/masjid/iqomah_bg_3.png', label: 'Biru Navy' },
    { id: '4', name: 'Preview Background 4', image: '/masjid/iqomah_bg_4.png', label: 'Putih Corak' },
    { id: '5', name: 'Preview Layout Adzan', image: '/masjid/adzan_bg_dark.png', label: 'Adzan Layout (Pill)' },
  ];

  return (
    <div className="w-full pb-12">
      <div className="page-header sticky top-4 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-b border-[var(--border-color)] mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="page-title">Tampilan Layar Iqomah</h2>
          <p className="text-[var(--text-secondary)]">Atur tampilan background dan pesan saat hitung mundur Iqomah.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={handlePreview}
            disabled={previewing}
            className={`btn-secondary flex items-center justify-center relative overflow-hidden group ${previewing ? 'bg-[var(--primary-100)] text-[var(--primary-600)] dark:bg-primary-900/30' : ''}`}
            title="Lihat hasil di layar utama"
          >
            {previewing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
                <span>Previewing...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Preview di TV</span>
              </span>
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary shadow-lg shadow-[var(--primary-500)]/30"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex-1 font-medium">{message.text}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <Clock className="text-[var(--primary-500)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Iqamah Duration</h3>
              <p className="text-sm text-[var(--text-secondary)]">Adjust iqamah countdown duration for each prayer time (in minutes).</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(prayer => (
              <div key={prayer} className="form-group">
                <label className="form-label capitalize">{prayer}</label>
                <input
                  type="number"
                  min="0"
                  name={`${prayer}Iqamah`}
                  value={config[`${prayer}Iqamah`] !== undefined ? config[`${prayer}Iqamah`] : 10}
                  onChange={(e) => handleChange({ target: { name: e.target.name, value: parseInt(e.target.value) }})}
                  className="form-control"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <label className="form-label font-bold text-[var(--text-primary)]">Pesan Tengah Layar</label>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Kalimat ini akan muncul tepat di bawah angka hitung mundur Iqomah.</p>
          <input 
            type="text" 
            name="iqomahMessage" 
            value={config.iqomahMessage} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="Contoh: Luruskan dan rapatkan shaf..." 
          />
        </div>

        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Pilih Tema Background</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {backgrounds.map((bg) => (
            <div 
              key={bg.id}
              onClick={() => handleChange({ target: { name: 'iqomahBackground', value: bg.id }})}
              className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 relative group flex flex-col bg-[var(--bg-card)] ${
                config.iqomahBackground === bg.id 
                  ? 'border-[var(--primary-500)] shadow-2xl scale-[1.02]' 
                  : 'border-transparent shadow-md hover:shadow-xl hover:border-[var(--primary-500)]/50'
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center p-6 border-b border-[var(--border-color)]">
                <img src={bg.image} alt={bg.label} className="absolute inset-0 w-full h-full object-cover" />
                
                {/* Foreground Overlay for Preview */}
                {bg.id === '5' ? (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center scale-75 origin-center">
                    <h3 className="text-white text-xl font-medium tracking-wide mb-1 drop-shadow-md">IQAMAH</h3>
                    <div className="relative w-[18rem] h-12 rounded-full overflow-hidden bg-gradient-to-b from-[#e6c97a] to-[#b38531] border-[2px] border-[#f0d892] shadow-lg flex items-center justify-center mb-3">
                      <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-blue-400 w-1/3"></div>
                      <div className="relative z-10 text-3xl font-bold font-mono tracking-widest text-[#fff19a] drop-shadow-md">03:58</div>
                    </div>
                    <div className="text-white font-bold text-[10px] tracking-widest uppercase drop-shadow-md bg-black/40 px-3 py-1 rounded-full border border-white/20 max-w-[90%] truncate">
                      {config.iqomahMessage || "Luruskan dan rapatkan shaf untuk kesempurnaan shalat"}
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                    <h3 className="text-[#967d3e] text-lg font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">IQAMAH</h3>
                    <div className={`text-7xl font-extrabold tracking-tighter leading-none mb-4 drop-shadow-lg font-mono ${bg.id === '3' ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-[#102a43]'}`}>03:58</div>
                    <div className="bg-[#fcf8e3] text-[#785b28] border-2 border-[#d4b97a] px-6 py-1.5 rounded-full text-[10px] font-bold shadow-md max-w-[80%] truncate text-center">
                      {config.iqomahMessage || "Luruskan dan rapatkan shaf untuk kesempurnaan shalat"}
                    </div>
                  </div>
                )}

                {config.iqomahBackground === bg.id && (
                  <div className="absolute top-4 right-4 bg-[var(--primary-500)] text-white p-2 rounded-full shadow-lg z-20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>

        {/* Setting Suara Alarm Pengingat Iqomah */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Pengingat Suara Iqomah</h3>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-[var(--border-color)]">
              <div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1">Aktifkan Suara Alarm</h4>
                <p className="text-sm text-[var(--text-secondary)]">Mainkan suara saat waktu iqomah hampir habis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="iqomahAlarmEnabled"
                  checked={config.iqomahAlarmEnabled || false}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-500)]"></div>
              </label>
            </div>

            {config.iqomahAlarmEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Suara Alarm</label>
                  <select 
                    name="iqomahAlarmSound"
                    value={config.iqomahAlarmSound || 'beep'}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="beep">Beep Pendek</option>
                    <option value="beep-long">Beep Panjang</option>
                    <option value="alarm1">Digital Alarm</option>
                    <option value="alarm2">Classic Bell</option>
                    <option value="alarm3">Soft Chime</option>
                    <option value="alarm4">Rapid Double Beep</option>
                    <option value="alarm5">Descending Tone</option>
                    <option value="alarm6">Echo Ping</option>
                    <option value="alarm7">Warning Siren</option>
                    <option value="alarm8">Deep Gong</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Mulai Bunyi (Sisa Detik)</label>
                  <input 
                    type="number" 
                    name="iqomahAlarmTime"
                    min="1" max="60"
                    value={config.iqomahAlarmTime || 10} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Alarm mulai saat sisa waktu</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Selesai Bunyi (Sisa Detik)</label>
                  <input 
                    type="number" 
                    name="iqomahAlarmEnd"
                    min="0" max="59"
                    value={config.iqomahAlarmEnd || 0} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Alarm berhenti saat waktu ini</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Custom Background (Opsional)</h3>
              <p className="text-sm text-[var(--text-secondary)]">Ganti gambar tema default dengan foto masjid Anda sendiri untuk layar Iqomah.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-[var(--border-color)] flex items-center justify-center relative group">
              {config.iqomahBackgroundUrl || imagePreview ? (
                <>
                  <img src={imagePreview || config.iqomahBackgroundUrl} alt="Custom Background" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={removeBackground} className="bg-red-500 text-white px-4 py-3 md:px-3 md:py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                      Hapus Foto
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <MonitorPlay className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
                  <span className="text-sm text-[var(--text-secondary)]">Gunakan Tema Default</span>
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <label className="btn-primary cursor-pointer inline-flex items-center justify-center gap-2 mb-4 w-full md:w-auto">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Foto Latar
              </label>
              
              <div className="bg-slate-50 dark:bg-black/30 p-4 rounded-xl border border-[var(--border-color)]">
                <h4 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Catatan
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Jika Anda mengunggah <strong>Custom Background</strong>, sistem akan menggunakan gambar ini untuk layar Iqomah dan mengabaikan pilihan "Tema Background" di atas. Layout jam, hitung mundur, dan teks iqomah akan tetap sama persis seperti tampilan default.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
