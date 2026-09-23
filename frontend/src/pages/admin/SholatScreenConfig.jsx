import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, CheckCircle, XCircle, Moon, Smartphone, MonitorPlay } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { useDialog } from '../../contexts/DialogContext';

export default function SholatScreenConfig() {
  const { showAlert } = useDialog();
  const [config, setConfig] = useState({
    sholatDuration: 10,
    sholatScreenMessage: 'Luruskan dan Rapatkan Shaf'
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
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
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
      
      setConfig(prev => ({ ...prev, sholatBackgroundUrl: compressedBase64 }));
      setImagePreview(compressedBase64);
    } catch (err) {
      console.error('Compression failed:', err);
      showAlert({ title: 'Gagal', message: 'Gagal memproses gambar. Silakan coba gambar lain.', type: 'error' });
    }
  };

  const removeBackground = () => {
    setConfig(prev => ({ ...prev, sholatBackgroundUrl: null }));
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
      
      setMessage({ text: 'Tampilan Layar Sholat berhasil disimpan!', type: 'success' });
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

  const hasCustomBg = !!config.sholatBackgroundUrl;
  const isAnim = !hasCustomBg && config.adzanBackground === 'image';
  const bgImg = config.sholatBackgroundUrl || config.adzanBackgroundUrl || "/masjid/adzan_bg_dark.png";

  return (
    <div className="w-full pb-12">
      <div className="page-header sticky top-4 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-b border-[var(--border-color)] mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="page-title">Sholat Screen</h2>
          <p className="text-[var(--text-secondary)]">Atur durasi dan pesan yang tampil saat sholat sedang berlangsung.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary mt-4 md:mt-0 shadow-lg shadow-[var(--primary-500)]/30"
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
              <span>Simpan Tampilan</span>
            </>
          )}
        </button>
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

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="form-label font-bold text-[var(--text-primary)]">Pesan Layar Sholat</label>
              <p className="text-sm text-[var(--text-secondary)] mb-3">Teks ini tampil di bawah indikator progress saat mode sholat sedang berlangsung.</p>
              <input 
                type="text" 
                name="sholatScreenMessage" 
                value={config.sholatScreenMessage} 
                onChange={handleChange} 
                className="form-control mb-6" 
                placeholder="Contoh: Luruskan dan Rapatkan Shaf" 
              />
              
              <label className="form-label font-bold text-[var(--text-primary)]">Durasi Layar Sholat (Menit)</label>
              <p className="text-sm text-[var(--text-secondary)] mb-3">Lama layar sholat gelap ditampilkan sebelum kembali ke mode normal.</p>
              <input 
                type="number" 
                name="sholatDuration" 
                value={config.sholatDuration} 
                onChange={handleChange} 
                className="form-control" 
                min="1"
                max="60"
              />
            </div>
            
            <div className="bg-slate-50 dark:bg-black/30 p-4 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Custom Background (Opsional)</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Ganti gambar background khusus untuk layar Sholat.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-[var(--border-color)] flex items-center justify-center relative group">
                  {config.sholatBackgroundUrl || imagePreview ? (
                    <>
                      <img src={imagePreview || config.sholatBackgroundUrl} alt="Custom Background" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={removeBackground} className="bg-red-500 text-white px-4 py-3 md:px-3 md:py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                          Hapus Foto
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <MonitorPlay className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
                      <span className="text-xs text-[var(--text-secondary)]">Mengikuti Waktu Adzan</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="btn-primary cursor-pointer flex justify-center items-center gap-2 w-full text-sm py-2">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Foto
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Preview Tampilan</h3>
      
      <div className="rounded-2xl overflow-hidden border-4 border-transparent shadow-xl relative aspect-video flex flex-col bg-black">
        {isAnim ? (
          <>
            <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen blur-[2px] grayscale" alt="Background" />
            <div className="absolute right-[-10%] w-[80%] h-[80%] max-h-full rounded-full bg-blue-900/10 border border-blue-400/10 shadow-[0_0_50px_rgba(59,130,246,0.1)]"></div>
          </>
        ) : (
          <img src={bgImg} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale" alt="Background" />
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4 scale-50 md:scale-75 lg:scale-100 origin-center">
          <h2 className="text-2xl text-gray-500 mb-2 font-medium tracking-[0.3em] uppercase drop-shadow-md">SHOLAT SEDANG BERLANGSUNG</h2>
          <h1 className="text-[5rem] font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] opacity-90 leading-none mb-6">
            SUBUH
          </h1>
          
          <div className="relative w-[16rem] h-2 rounded-full overflow-hidden bg-gray-800/80 border border-gray-600/50 shadow-[0_2px_5px_rgba(0,0,0,0.5)] mb-4">
            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gray-500 to-gray-400 shadow-[0_0_5px_rgba(255,255,255,0.2)] w-1/3"></div>
          </div>
          
          <div className="text-xl text-gray-500 font-medium tracking-[0.2em] uppercase drop-shadow-md">
            {config.sholatScreenMessage || 'Luruskan dan Rapatkan Shaf'}
          </div>
        </div>
      </div>
    </div>
  );
}
