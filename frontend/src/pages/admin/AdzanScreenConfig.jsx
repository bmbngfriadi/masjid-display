import { useState, useEffect, useRef } from 'react';
import { compressImage } from '../../utils/imageCompression';
import { MonitorPlay } from 'lucide-react';
import { useDialog } from '../../contexts/DialogContext';

export default function AdzanScreenConfig() {
  const { showAlert } = useDialog();
  const [config, setConfig] = useState({
    adzanDuration: 4,
    adzanBackground: 'black',
    adzanAudio: 'adzan-makkah.mp3',
    adzanAlarmEnabled: false,
    adzanAlarmSound: 'beep',
    adzanAlarmTime: 10,
    adzanAlarmEnd: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      
      setConfig(prev => ({ ...prev, adzanBackgroundUrl: compressedBase64 }));
      setImagePreview(compressedBase64);
      // Auto switch to black mode so the custom image can be seen
      if (config.adzanBackground !== 'black') {
        setConfig(prev => ({ ...prev, adzanBackground: 'black' }));
      }
    } catch (err) {
      console.error('Compression failed:', err);
      showAlert({ title: 'Gagal', message: 'Gagal memproses gambar. Silakan coba gambar lain.', type: 'error' });
    }
  };

  const removeBackground = () => {
    setConfig(prev => ({ ...prev, adzanBackgroundUrl: null }));
    setImagePreview(null);
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
      
      setMessage({ text: 'Konfigurasi Adzan berhasil disimpan!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(`${API_BASE_URL}/prayer-config/preview-adzan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to trigger preview');
      
      showAlert({ title: 'Preview Aktif', message: 'Layar TV sekarang menampilkan preview Adzan selama 30 detik.', type: 'success' });
    } catch (error) {
      showAlert({ title: 'Gagal', message: 'Gagal memicu preview di TV', type: 'error' });
    }
  };

  const handlePreviewFullFlow = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(`${API_BASE_URL}/prayer-config/preview-full-flow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error('Failed to trigger full flow preview');
      
      showAlert({ title: 'Simulasi Penuh Aktif', message: 'Layar TV sekarang memutar simulasi penuh dari Adzan (15s) -> Iqomah (15s) -> Sholat (15s).', type: 'success' });
    } catch (error) {
      showAlert({ title: 'Gagal', message: 'Gagal memicu simulasi penuh di TV', type: 'error' });
    }
  };

  const handlePreviewAlarm = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(`${API_BASE_URL}/prayer-config/preview-adzan-alarm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config) // Send current form state to preview
      });

      if (!res.ok) throw new Error('Failed to trigger preview alarm');
      
      showAlert({ title: 'Preview Alarm Aktif', message: 'Layar TV sekarang mensimulasikan peringatan Adzan selama 15 detik.', type: 'success' });
    } catch (error) {
      showAlert({ title: 'Gagal', message: 'Gagal memicu preview alarm di TV', type: 'error' });
    }
  };

  const playAlarmPreview = (sound) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const playTone = (freq, type, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(1, startTime + 0.05);
        gain.gain.setValueAtTime(1, startTime + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      if (sound === 'beep') {
        playTone(800, 'sine', now, 0.4);
      } else if (sound === 'beep-long') {
        playTone(800, 'sine', now, 1.5);
      } else if (sound === 'alarm1') {
        for (let i = 0; i < 5; i++) {
          playTone(1000, 'square', now + i * 0.2, 0.1);
        }
      } else if (sound === 'alarm2') {
        for (let i = 0; i < 4; i++) {
          playTone(600, 'triangle', now + i * 0.2, 0.1);
          playTone(800, 'triangle', now + i * 0.2 + 0.1, 0.1);
        }
      } else if (sound === 'alarm3') {
        playTone(523.25, 'sine', now, 0.5);
        playTone(659.25, 'sine', now + 0.5, 1.5);
      } else if (sound === 'alarm4') {
        playTone(900, 'sine', now, 0.15);
        playTone(900, 'sine', now + 0.3, 0.15);
      } else if (sound === 'alarm5') {
        playTone(1200, 'triangle', now, 0.2);
        playTone(1000, 'triangle', now + 0.2, 0.2);
        playTone(800, 'triangle', now + 0.4, 0.2);
      } else if (sound === 'alarm6') {
        playTone(1500, 'sine', now, 0.1);
        playTone(1500, 'sine', now + 0.3, 0.05);
        playTone(1500, 'sine', now + 0.5, 0.02);
      } else if (sound === 'alarm7') {
        for (let i = 0; i < 3; i++) {
          playTone(400, 'sawtooth', now + i * 0.3, 0.15);
        }
      } else if (sound === 'alarm8') {
        playTone(300, 'sine', now, 1.5);
        playTone(302, 'sine', now, 1.5);
      }
      
      // Auto close context after 2 seconds
      setTimeout(() => ctx.close(), 2000);
    } catch (e) {
      console.error("Audio API error:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <div className="page-header sticky top-4 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-b border-[var(--border-color)] mb-8">
        <div>
          <h2 className="page-title">Adzan Screen</h2>
          <p className="text-[var(--text-secondary)]">Atur tampilan dan audio layar TV saat waktu adzan tiba.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreviewAlarm}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-all border border-red-200 dark:border-red-800"
              title="Preview Peringatan Overlay di TV"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Test Preview Alarm (15s)
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60 transition-all border border-emerald-200 dark:border-emerald-800"
            >
              <MonitorPlay size={18} />
              Test Preview TV (30s)
            </button>
            <button
              type="button"
              onClick={handlePreviewFullFlow}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/60 transition-all border border-blue-200 dark:border-blue-800"
              title="Simulasi 45 detik: Adzan -> Iqomah -> Sholat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Simulasi Full Flow
            </button>
          </div>
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
                <span>Simpan Pengaturan</span>
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

      <div className="mt-4">
        <div>
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section: Layout Tampilan */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 mb-5">
                Pengaturan Tampilan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Durasi Adzan (Menit)</label>
                  <p className="text-xs text-[var(--text-secondary)]/80 mb-2">Lama waktu layar emas Adzan ditampilkan sebelum beralih ke hitung mundur Iqomah.</p>
                  <input
                    type="number"
                    name="adzanDuration"
                    value={config.adzanDuration}
                    onChange={handleChange}
                    min="1"
                    max="15"
                    className="form-control"
                  />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">Pilih Tampilan (Layout) Screen Adzan</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Option 1: Progress */}
                    <div 
                      onClick={() => handleChange({ target: { name: 'adzanBackground', value: 'black', type: 'text' }})}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-[4px] transition-all duration-300 relative group ${config.adzanBackground === 'black' ? 'border-[var(--primary-500)] shadow-xl scale-[1.02]' : 'border-transparent shadow-md hover:shadow-lg hover:border-[var(--primary-500)]/50'}`}
                    >
                      <div className="aspect-video bg-black flex flex-col items-center justify-center border-[8px] border-[#c5a059] relative">
                        <img src={imagePreview || config.adzanBackgroundUrl || "/masjid/adzan_bg_dark.png"} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Dark Mosque" />
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-white text-sm mb-2 drop-shadow-md">WAKTU ADZAN</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] text-6xl font-extrabold tracking-widest leading-none mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">MAGHRIB</span>
                          <div className="w-64 h-12 bg-gradient-to-b from-[#e6c97a] to-[#b38531] rounded-full border-[3px] border-[#f0d892] flex items-center justify-center relative overflow-hidden shadow-lg">
                            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500 rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                            <span className="relative z-10 text-white font-bold text-2xl font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">18:19</span>
                          </div>
                        </div>
                      </div>

                      {config.adzanBackground === 'black' && (
                        <div className="absolute top-4 right-4 bg-[var(--primary-500)] text-white p-1.5 rounded-full shadow-lg">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>

                    {/* Option 2: Animated */}
                    <div 
                      onClick={() => handleChange({ target: { name: 'adzanBackground', value: 'image', type: 'text' }})}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-[4px] transition-all duration-300 relative group ${config.adzanBackground === 'image' ? 'border-[var(--primary-500)] shadow-xl scale-[1.02]' : 'border-transparent shadow-md hover:shadow-lg hover:border-[var(--primary-500)]/50'}`}
                    >
                      <div className="aspect-video bg-[#0a192f] border-[8px] border-[#c5a059] relative overflow-hidden flex items-center justify-center">
                        <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen blur-[2px]" alt="Globe" />
                        <div className="absolute w-[80%] h-[80%] right-[-10%] rounded-full bg-blue-900/30 border border-blue-400/20 shadow-[0_0_50px_rgba(59,130,246,0.3)]"></div>
                        <div className="absolute bottom-8 left-8 flex flex-col items-start">
                          <span className="text-gray-400 text-xs tracking-widest uppercase mb-1">WAKTU ADZAN</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] text-5xl font-extrabold tracking-widest leading-none mb-2">MAGHRIB</span>
                          <span className="text-white text-3xl font-bold font-mono">18:19</span>
                        </div>
                        <div className="absolute bottom-10 right-8 w-1/3 h-1.5 bg-gray-700/80 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        </div>
                      </div>

                      {config.adzanBackground === 'image' && (
                        <div className="absolute top-4 right-4 bg-[var(--primary-500)] text-white p-1.5 rounded-full shadow-lg">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Background Section */}
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Custom Background (Opsi PROGRESS)</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Ganti gambar latar Adzan *default* dengan foto masjid Anda sendiri.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-[var(--border-color)] flex items-center justify-center relative group">
                  {config.adzanBackgroundUrl || imagePreview ? (
                    <>
                      <img src={imagePreview || config.adzanBackgroundUrl} alt="Custom Background" className="w-full h-full object-cover opacity-60 mix-blend-luminosity bg-black" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={removeBackground} type="button" className="bg-red-500 text-white px-4 py-3 md:px-3 md:py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                          Hapus Foto
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <MonitorPlay className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
                      <span className="text-sm text-[var(--text-secondary)]">Gunakan Gambar Default</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="btn-primary cursor-pointer inline-flex items-center gap-2 mb-2">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Foto
                  </label>
                  <p className="text-xs text-[var(--text-secondary)]">Sistem akan secara pintar memampatkan (compress) ukuran foto secara otomatis.</p>
                  {config.adzanBackgroundUrl && <p className="text-sm text-emerald-500 font-medium mt-4">✓ Custom background aktif. Pastikan Anda telah memilih tema PROGRESS di atas.</p>}
                </div>
              </div>
            </div>



            {/* Section: Pengingat Suara Adzan */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 mb-5">
                Pengingat Suara Adzan
              </h2>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Aktifkan Suara Alarm</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Mainkan suara sebelum waktu adzan tiba</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="adzanAlarmEnabled"
                    checked={config.adzanAlarmEnabled || false}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-500)]"></div>
                </label>
              </div>

              {config.adzanAlarmEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Suara Alarm</label>
                    <div className="flex gap-2">
                      <select
                        name="adzanAlarmSound"
                        value={config.adzanAlarmSound || 'beep'}
                        onChange={handleChange}
                        className="form-control flex-1"
                      >
                        <option value="beep">Beep Pendek</option>
                        <option value="beep-long">Beep Panjang</option>
                        <option value="alarm1">Digital Alarm</option>
                        <option value="alarm2">Classic Bell</option>
                        <option value="alarm3">Chime</option>
                        <option value="alarm4">Rapid Beep</option>
                        <option value="alarm5">Descending Tone</option>
                        <option value="alarm6">Echo Ping</option>
                        <option value="alarm7">Warning Siren</option>
                        <option value="alarm8">Deep Gong</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => playAlarmPreview(config.adzanAlarmSound || 'beep')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
                        title="Mainkan Suara"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Mulai Bunyi (Sisa Detik)</label>
                    <input
                      type="number"
                      name="adzanAlarmTime"
                      value={config.adzanAlarmTime !== undefined ? config.adzanAlarmTime : 10}
                      onChange={handleChange}
                      min="1"
                      className="form-control"
                    />
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Alarm mulai sebelum waktu adzan tiba</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Selesai Bunyi (Sisa Detik)</label>
                    <input
                      type="number"
                      name="adzanAlarmEnd"
                      value={config.adzanAlarmEnd !== undefined ? config.adzanAlarmEnd : 0}
                      onChange={handleChange}
                      min="0"
                      className="form-control"
                    />
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Alarm berhenti sebelum waktu adzan tiba</p>
                  </div>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
      
    </div>
  );
}
