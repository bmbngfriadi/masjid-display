import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, LayoutTemplate, Clock, Image as ImageIcon, MapPin, Eye, Upload, Trash2, Plus, Monitor, MonitorPlay } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function LayoutConfig() {
  const { showAlert } = useDialog();
  const [layoutStyle, setLayoutStyle] = useState('signature');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [backgroundUrls, setBackgroundUrls] = useState([]);
  const [backgroundSlideInterval, setBackgroundSlideInterval] = useState(10);
  const [backgroundSliderEnabled, setBackgroundSliderEnabled] = useState(true);
  const [infoSlideEnabled, setInfoSlideEnabled] = useState(false);
  const [infoSlideVisibleItems, setInfoSlideVisibleItems] = useState(5);
  const [infoSlideScrollSpeed, setInfoSlideScrollSpeed] = useState(3);
  const [infoSlideDuration, setInfoSlideDuration] = useState(10);
  const [infoSlideItems, setInfoSlideItems] = useState([]);
  const [layoutDuration, setLayoutDuration] = useState(30);
  const [showDebugTools, setShowDebugTools] = useState(true);

  const layouts = [
    {
      id: 'signature',
      name: 'Signature (Theme 1)',
      desc: 'Jam analog di kiri dengan panel jadwal yang elegan.'
    },
    {
      id: 'ultrawide',
      name: 'Ultra Wide (Theme 2)',
      desc: 'Jam di pojok kiri bawah, cocok untuk TV layar lebar.'
    },
    {
      id: 'simplicity',
      name: 'Simplicity (Theme 3)',
      desc: 'Informasi tersusun vertikal di sisi kiri, bersih dan modern.'
    },
    {
      id: 'classic',
      name: 'Classic Grid (Theme 4)',
      desc: 'Gaya grid terstruktur di bagian bawah dengan jam besar di tengah.'
    },
    {
      id: 'modern',
      name: 'Modern Cards (Theme 5)',
      desc: 'Kartu jadwal mengambang berjejer rapi di sisi kanan dengan gaya kekinian.'
    },
    {
      id: 'minimalist',
      name: 'Minimalist (Theme 6)',
      desc: 'Jadwal di satu baris paling bawah, memaksimalkan keindahan gambar masjid.'
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism (Theme 7)',
      desc: 'Desain ultra modern dengan panel kaca buram (frosted glass) dan jam digital berdenyut.'
    },
    {
      id: 'dynamic',
      name: 'Dynamic Motion (Theme 8)',
      desc: 'Gaya visual dinamis, animasi lingkaran waktu, dan indikator aktif bercahaya.'
    },
    {
      id: 'futuristic',
      name: 'Futuristic Sci-Fi (Theme 9)',
      desc: 'Tema masa depan beraksen garis neon cybernetic dan cincin radar abstrak.'
    }
  ];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/display-setting`);
      if (res.data) {
        if (res.data.layoutStyle) setLayoutStyle(res.data.layoutStyle);
        if (res.data.backgroundUrl) setBackgroundUrl(res.data.backgroundUrl);
        if (res.data.backgroundUrls) setBackgroundUrls(res.data.backgroundUrls);
        if (res.data.backgroundSlideInterval) setBackgroundSlideInterval(res.data.backgroundSlideInterval);
        if (res.data.backgroundSliderEnabled !== undefined) setBackgroundSliderEnabled(res.data.backgroundSliderEnabled);
        if (res.data.infoSlideEnabled !== undefined) setInfoSlideEnabled(res.data.infoSlideEnabled);
        if (res.data.infoSlideVisibleItems) setInfoSlideVisibleItems(res.data.infoSlideVisibleItems);
        if (res.data.infoSlideScrollSpeed) setInfoSlideScrollSpeed(res.data.infoSlideScrollSpeed);
        if (res.data.infoSlideDuration) setInfoSlideDuration(res.data.infoSlideDuration);
        if (res.data.infoSlideItems) setInfoSlideItems(res.data.infoSlideItems);
        if (res.data.layoutDuration) setLayoutDuration(res.data.layoutDuration);
        if (res.data.showDebugTools !== undefined) setShowDebugTools(res.data.showDebugTools);
      }
    } catch (err) {
      console.error('Failed to fetch display setting', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/display-setting`, { 
        layoutStyle, 
        backgroundUrl,
        backgroundUrls,
        backgroundSlideInterval,
        backgroundSliderEnabled,
        infoSlideEnabled,
        infoSlideVisibleItems,
        infoSlideScrollSpeed,
        infoSlideDuration,
        infoSlideItems,
        layoutDuration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Layout style berhasil disimpan! TV akan otomatis diperbarui.');
    } catch (err) {
      console.error('Failed to save', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress the image before setting it (max 1920x1080 for background)
      const compressedBase64 = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8
      });
      
      setBackgroundUrl(compressedBase64);
      setImagePreview(compressedBase64);
    } catch (err) {
      console.error('Compression failed:', err);
      showAlert({ title: 'Gagal', message: 'Gagal memproses gambar. Silakan coba gambar lain.', type: 'error' });
    }
  };

  const removeBackground = () => {
    setBackgroundUrl('');
    setImagePreview(null);
  };

  const handleSliderFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    try {
      const compressedImages = await Promise.all(files.map(file => 
        compressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.8 })
      ));
      
      setBackgroundUrls(prev => [...prev, ...compressedImages]);
    } catch (err) {
      console.error('Slider compression failed:', err);
      showAlert({ title: 'Gagal', message: 'Gagal memproses beberapa gambar slider.', type: 'error' });
    }
  };

  const removeSliderImage = (index) => {
    const newUrls = backgroundUrls.filter((_, i) => i !== index);
    setBackgroundUrls(newUrls);
  };

  const addInfoSlideRow = () => {
    setInfoSlideItems([...infoSlideItems, { title: '', description: '' }]);
  };

  const updateInfoSlideRow = (index, field, value) => {
    const newItems = [...infoSlideItems];
    newItems[index][field] = value;
    setInfoSlideItems(newItems);
  };

  const removeInfoSlideRow = (index) => {
    const newItems = infoSlideItems.filter((_, i) => i !== index);
    setInfoSlideItems(newItems);
  };

  if (loading) return <div className="p-8 text-center text-[var(--text-secondary)]">Memuat...</div>;

  return (
    <div className="w-full pb-12">
      <div className="page-header sticky top-4 z-40 bg-[var(--bg-color)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-b border-[var(--border-color)]">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <LayoutTemplate className="text-[var(--primary-500)]" />
            Layout Style
          </h2>
          <p className="text-[var(--text-secondary)]">Pilih tata letak (tema) yang akan ditampilkan di TV Masjid.</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary shadow-lg shadow-[var(--primary-500)]/30"
          >
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Layout'}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {layouts.map(layout => (
          <div 
            key={layout.id}
            onClick={() => setLayoutStyle(layout.id)}
            className={`glass-card p-6 cursor-pointer transition-all duration-300 border-2 ${layoutStyle === layout.id ? 'border-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/20 scale-[1.02]' : 'border-transparent hover:border-[var(--primary-500)]/50 hover:-translate-y-1'}`}
          >
            <div className="w-full aspect-video rounded-xl bg-slate-900 mb-6 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
              
              {layout.id === 'signature' && (
                <div className="w-full h-full relative flex text-[8px]">
                  <div className="w-1/3 h-full bg-gradient-to-b from-[#003B73] to-[#00172D] border-r border-blue-500/30 flex flex-col items-center pt-2 px-1 relative z-10">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-400 mb-2 bg-[#00172D]"></div>
                    <div className="w-full space-y-1 mt-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-1 rounded">
                          <div className="w-4 h-1.5 bg-blue-200/50 rounded"></div>
                          <div className="w-4 h-1.5 bg-white rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00172D]/80 to-transparent"></div>
                  </div>
                </div>
              )}

              {layout.id === 'ultrawide' && (
                <div className="w-full h-full relative flex flex-col text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="w-full h-1/5 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start px-2 pt-1 relative z-10">
                    <div className="w-1/3 h-3 bg-blue-900/80 rounded-full border border-blue-400/30"></div>
                    <div className="w-1/4 h-2 bg-blue-600/90 rounded-full"></div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="w-full h-[35%] bg-gradient-to-t from-[#002244] to-[#002244]/80 relative z-10 flex items-end pb-1 px-2 border-t border-blue-500/20">
                    <div className="absolute left-3 -top-3 w-8 h-8 rounded-full border-[2px] border-white bg-blue-900 shadow-md"></div>
                    <div className="ml-10 flex-1 flex justify-between gap-1 items-center pb-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="w-4 h-1 bg-blue-300/60 rounded mb-0.5"></div>
                          <div className="w-6 h-2 bg-yellow-400/80 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {layout.id === 'simplicity' && (
                <div className="w-full h-full relative flex text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="w-[35%] h-full bg-[#18395B]/90 flex flex-col items-center pt-2 px-1.5 relative z-10 shadow-lg">
                    <div className="w-10 h-3 bg-white/80 rounded mb-1"></div>
                    <div className="w-12 h-1 bg-blue-200/50 rounded mb-2"></div>
                    <div className="w-full space-y-1.5 mt-1 flex-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-white/20 rounded"></div>
                            <div className="w-4 h-1.5 bg-white/70 rounded"></div>
                          </div>
                          <div className="w-4 h-1.5 bg-white rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 relative z-10 flex flex-col justify-between p-2 items-end">
                    <div className="w-1/2 h-5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-end px-1 gap-1">
                      <div className="w-10 h-1 bg-yellow-400 rounded"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                    </div>
                    <div className="w-1/2 h-4 bg-blue-900/90 rounded-full border border-blue-400/30 flex items-center px-2">
                       <div className="w-full flex justify-between">
                         <div className="w-6 h-1 bg-blue-200 rounded"></div>
                         <div className="w-6 h-2 bg-white rounded"></div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {layout.id === 'classic' && (
                <div className="w-full h-full relative flex flex-col text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="w-full h-[30%] flex justify-center items-end relative z-10">
                    <div className="w-24 h-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col justify-center items-center">
                      <div className="w-16 h-4 bg-white/90 rounded mb-1"></div>
                      <div className="w-12 h-2 bg-yellow-400/90 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="w-full h-[40%] bg-black/60 backdrop-blur-sm relative z-10 p-2 grid grid-cols-6 gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white/10 rounded-lg flex flex-col items-center justify-center p-1 border border-white/5">
                        <div className="w-4 h-1 bg-gray-300 rounded mb-1"></div>
                        <div className="w-6 h-2 bg-white rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout.id === 'modern' && (
                <div className="w-full h-full relative flex text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/70"></div>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 h-full relative z-10 flex flex-col justify-center items-end pr-2 space-y-1">
                    <div className="w-[80%] h-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between px-2 mb-2">
                      <div className="w-12 h-3 bg-white rounded"></div>
                      <div className="w-8 h-2 bg-yellow-400 rounded"></div>
                    </div>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-[70%] h-5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-between px-2">
                        <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                        <div className="w-6 h-2 bg-white rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout.id === 'minimalist' && (
                <div className="w-full h-full relative flex flex-col text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="w-full h-1/5 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start px-2 pt-1 relative z-10">
                    <div className="w-1/4 h-2 bg-white/80 rounded"></div>
                    <div className="w-10 h-3 bg-white rounded"></div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="w-full h-[15%] bg-white/90 relative z-10 flex items-center justify-between px-2 shadow-lg">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-4 h-1.5 bg-gray-500 rounded"></div>
                        <div className="w-5 h-2 bg-emerald-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout.id === 'glassmorphism' && (
                <div className="w-full h-full relative flex flex-col justify-between p-2 text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="w-full relative z-10 flex justify-between">
                    <div className="w-16 h-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"></div>
                    <div className="w-12 h-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="w-24 h-10 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 flex items-center justify-center gap-1">
                      <div className="w-6 h-4 bg-white/90 rounded-sm"></div>
                      <div className="w-1 h-3 bg-yellow-400 rounded-sm"></div>
                      <div className="w-6 h-4 bg-white/90 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="w-full relative z-10 flex justify-between gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`flex-1 h-6 rounded-md border flex flex-col items-center justify-center ${i === 2 ? 'bg-yellow-400/30 border-yellow-300' : 'bg-black/40 border-white/10'}`}>
                        <div className={`w-3 h-1 rounded-sm mb-1 ${i === 2 ? 'bg-yellow-300' : 'bg-white/50'}`}></div>
                        <div className={`w-4 h-2 rounded-sm ${i === 2 ? 'bg-white' : 'bg-white/80'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {layout.id === 'dynamic' && (
                <div className="w-full h-full relative flex text-[8px]">
                  <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover" alt="bg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 mix-blend-multiply"></div>
                  <div className="w-[35%] h-full bg-black/50 backdrop-blur-sm border-r border-white/10 relative z-10 flex flex-col px-2 py-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 mb-2"></div>
                    <div className="flex-1 flex flex-col justify-between gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-full h-3 rounded flex justify-between items-center px-1 ${i === 3 ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-white/10'}`}>
                           <div className="w-4 h-1 bg-white/70 rounded-sm"></div>
                           <div className="w-6 h-1.5 bg-white rounded-sm"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 relative z-10 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-white/20"></div>
                    </div>
                    <div className="w-16 h-4 bg-white/20 rounded-md"></div>
                  </div>
                </div>
              )}

              {layout.id === 'futuristic' && (
                <div className="w-full h-full relative flex flex-col bg-black text-[8px]">
                  <div className="absolute inset-0 border-[0.5px] border-[#00ffcc]/10 bg-[size:10px_10px]" style={{ backgroundImage: 'linear-gradient(rgba(0,255,204,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.1) 1px, transparent 1px)' }}></div>
                  <div className="w-full h-[15%] border-b border-[#00ffcc]/30 bg-black/80 relative z-10 flex items-center justify-between px-2">
                    <div className="w-4 h-4 rounded-full border border-[#00ffcc]"></div>
                    <div className="w-10 h-2 bg-[#00ffcc]/50 rounded-sm"></div>
                  </div>
                  <div className="flex-1 relative z-10 flex">
                    <div className="flex-1 flex items-center justify-center">
                       <div className="w-20 h-10 border border-[#00ffcc]/40 bg-black/60 rounded-xl flex items-center justify-center gap-1">
                          <div className="w-5 h-4 bg-white rounded-sm"></div>
                          <div className="w-1 h-3 bg-[#00ffcc] rounded-sm"></div>
                          <div className="w-5 h-4 bg-white rounded-sm"></div>
                       </div>
                    </div>
                    <div className="w-[30%] h-full bg-gradient-to-l from-black to-transparent border-l border-[#00ffcc]/20 flex flex-col justify-center gap-1 px-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-full h-4 border-l-2 flex justify-between items-center px-1 bg-black/50 ${i === 4 ? 'border-[#00ffcc] bg-[#00ffcc]/20' : 'border-[#00ffcc]/30'}`}>
                          <div className="w-4 h-1 bg-[#00ffcc]/70 rounded-sm"></div>
                          <div className="w-6 h-2 bg-white rounded-sm"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{layout.name}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${layoutStyle === layout.id ? 'border-[var(--primary-500)] bg-[var(--primary-500)]' : 'border-[var(--text-secondary)]'}`}>
                {layoutStyle === layout.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{layout.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Pengaturan Debug Tools */}
      <div className="mt-8 glass-card p-6 border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Tampilkan Debug Tools (Layar TV)</h3>
            <p className="text-sm text-[var(--text-secondary)]">Menampilkan informasi status Wakelock dan tombol Simulate Flow di layar utama TV.</p>
          </div>
          <button 
            onClick={async () => {
              try {
                const token = localStorage.getItem('admin_token');
                await axios.put(`${API_BASE_URL}/display-setting`, { showDebugTools: !showDebugTools }, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setShowDebugTools(!showDebugTools);
                setSuccess('Pengaturan Debug Tools berhasil disimpan!');
              } catch (err) {
                console.error('Failed to update debug tools', err);
                showAlert({ title: 'Gagal', message: 'Gagal mengubah pengaturan debug', type: 'error' });
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 ${showDebugTools ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showDebugTools ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Custom Background Section */}
      <div className="mt-8 glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Custom Background (Opsional)</h3>
            <p className="text-sm text-[var(--text-secondary)]">Ganti gambar masjid *default* dengan foto masjid Anda sendiri.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-[var(--border-color)] flex items-center justify-center relative group">
            {backgroundUrl || imagePreview ? (
              <>
                <img src={imagePreview || backgroundUrl} alt="Custom Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={removeBackground} className="bg-red-500 text-white px-4 py-3 md:px-3 md:py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
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
              Upload Foto Masjid
            </label>
            <p className="text-xs text-[var(--text-secondary)]">Sistem akan secara pintar memampatkan (compress) ukuran foto yang Anda unggah secara otomatis.</p>
            {backgroundUrl && <p className="text-sm text-emerald-500 font-medium mt-4">✓ Custom background aktif. Jangan lupa klik tombol "Simpan Layout" di atas.</p>}
          </div>
        </div>
      </div>

      {/* Pengaturan Durasi Layout Utama */}
      <div className="mt-8 glass-card p-6 border-l-4 border-l-[var(--primary-500)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Durasi Tampilan Utama (Layout)</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Berapa lama tampilan utama (jam dan jadwal) dengan <b>background tunggal</b> bertahan sebelum layar berpindah ke <b>Background Slider</b> atau <b>Info Slide</b>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="number" 
            min="5" 
            max="3600"
            value={layoutDuration} 
            onChange={(e) => setLayoutDuration(parseInt(e.target.value))} 
            className="form-control max-w-[150px] font-bold text-lg" 
          />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Detik</span>
        </div>
      </div>

      {/* Background Slider Section */}
      <div className="mt-8 glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Background Slider (Slideshow)</h3>
            <p className="text-sm text-[var(--text-secondary)]">Unggah beberapa foto untuk ditampilkan secara bergantian. (Jika ada foto di sini, fitur "Custom Background" tunggal di atas akan diabaikan).</p>
          </div>
        </div>
        
        <div className="mb-6 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-4">
            <div>
              <label className="form-label font-bold text-[var(--text-primary)] block">Slider Aktif?</label>
              <span className="text-xs text-[var(--text-secondary)]">Menyalakan atau mematikan fitur slideshow gambar latar belakang</span>
            </div>
            <button 
              onClick={() => setBackgroundSliderEnabled(!backgroundSliderEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 ${backgroundSliderEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${backgroundSliderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <label className="form-label font-bold text-[var(--text-primary)] mb-2 block">Durasi Tampil Per Gambar (Detik)</label>
          <input 
            type="number" 
            min="3" 
            max="3600"
            value={backgroundSlideInterval} 
            onChange={(e) => setBackgroundSlideInterval(parseInt(e.target.value))} 
            className="form-control max-w-[200px]" 
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {backgroundUrls.map((imgUrl, index) => (
            <div key={index} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-[var(--border-color)] relative group shadow-sm">
              <img src={imgUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeSliderImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-3 md:p-2 rounded-lg hover:bg-red-600 transition-colors shadow-md z-20 opacity-0 group-hover:opacity-100" title="Hapus Slide">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">#{index + 1}</div>
            </div>
          ))}
          
          <label className="aspect-video bg-slate-100 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--primary-400)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center text-[var(--text-secondary)]">
            <input type="file" accept="image/*" multiple onChange={handleSliderFileUpload} className="hidden" />
            <svg className="w-8 h-8 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span className="text-sm font-medium">Tambah Gambar</span>
          </label>
        </div>
      </div>

      {/* Info Slide Section */}
      <div className="mt-8 glass-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Aktifkan Info Slide</h3>
            <p className="text-sm text-[var(--text-secondary)]">Slide dengan format tabel yang berisi judul dan deskripsi di setiap baris. Digunakan untuk menampilkan informasi acara masjid, laporan donasi, dsb.</p>
          </div>
          <button 
            onClick={() => setInfoSlideEnabled(!infoSlideEnabled)}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 ${infoSlideEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className="sr-only">Enable Info Slide</span>
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${infoSlideEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {infoSlideEnabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)]">
                <label className="form-label font-bold text-[var(--text-primary)] mb-2 block">Visibilitas Informasi</label>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Jumlah baris informasi yang tampil bersamaan.</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="10" value={infoSlideVisibleItems} onChange={(e) => setInfoSlideVisibleItems(parseInt(e.target.value))} className="flex-1" />
                  <input type="number" min="1" max="10" value={infoSlideVisibleItems} onChange={(e) => setInfoSlideVisibleItems(parseInt(e.target.value))} className="form-control w-16 text-center" />
                </div>
              </div>
              
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)]">
                <label className="form-label font-bold text-[var(--text-primary)] mb-2 block">Kecepatan Pengguliran</label>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Kecepatan autoscroll per baris informasi (detik).</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="10" value={infoSlideScrollSpeed} onChange={(e) => setInfoSlideScrollSpeed(parseInt(e.target.value))} className="flex-1" />
                  <input type="number" min="1" max="10" value={infoSlideScrollSpeed} onChange={(e) => setInfoSlideScrollSpeed(parseInt(e.target.value))} className="form-control w-16 text-center" />
                </div>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)]">
                <label className="form-label font-bold text-[var(--text-primary)] mb-2 block">Durasi Slide Info</label>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Total durasi tabel info tampil di layar (detik).</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="5" max="60" value={infoSlideDuration} onChange={(e) => setInfoSlideDuration(parseInt(e.target.value))} className="flex-1" />
                  <input type="number" min="5" max="60" value={infoSlideDuration} onChange={(e) => setInfoSlideDuration(parseInt(e.target.value))} className="form-control w-16 text-center" />
                </div>
              </div>
            </div>

            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-color)]">
              <div className="mb-4">
                <label className="form-label font-bold text-[var(--text-primary)] mb-0">Tabel Informasi</label>
              </div>
              
              <div className="space-y-4">
                {infoSlideItems.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] relative shadow-sm">
                    <div className="flex items-center justify-center w-8 text-slate-400 font-bold">{index + 1}</div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-sm font-medium text-[var(--text-secondary)]">Judul</span>
                        <input 
                          type="text" 
                          value={item.title} 
                          onChange={(e) => updateInfoSlideRow(index, 'title', e.target.value)} 
                          className="form-control flex-1" 
                          placeholder="Contoh: [This Week] Jumu'ah Khutbah"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-24 text-sm font-medium text-[var(--text-secondary)] pt-2">Keterangan</span>
                        <textarea 
                          value={item.description} 
                          onChange={(e) => updateInfoSlideRow(index, 'description', e.target.value)} 
                          className="form-control flex-1 min-h-[60px]" 
                          placeholder="Isi keterangan di sini..."
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeInfoSlideRow(index)} 
                      className="bg-red-500 text-white p-3 md:p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      title="Hapus Slide"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
                
                {infoSlideItems.length === 0 && (
                  <div className="text-center py-8 text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-color)] rounded-lg">
                    Belum ada informasi. Klik tombol "Tambah Info" di bawah untuk membuat baris pertama.
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <button 
                  onClick={addInfoSlideRow} 
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 md:p-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center shadow-sm"
                  title="Tambah Slide Baru"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Tambah Info Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
