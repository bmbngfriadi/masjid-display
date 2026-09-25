import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Plus, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';
import { useDialog } from '../../contexts/DialogContext';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function FridaySchedule() {
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewingAdzan, setPreviewingAdzan] = useState(false);
  const [previewingIqomah, setPreviewingIqomah] = useState(false);
  const [jumatMode, setJumatMode] = useState(true);
  const [jumatTimeStart, setJumatTimeStart] = useState("06:00");
  const [jumatTimeEnd, setJumatTimeEnd] = useState("14:00");
  const [jumatRunningTextEnabled, setJumatRunningTextEnabled] = useState(true);
  const [jumatLayoutStyle, setJumatLayoutStyle] = useState('jumat_1');

  // Jumat Adzan & Iqomah Screen settings
  const [jumatAdzanBackground, setJumatAdzanBackground] = useState('black');
  const [jumatAdzanBackgroundUrl, setJumatAdzanBackgroundUrl] = useState('');
  const [jumatAdzanAudio, setJumatAdzanAudio] = useState('adzan-makkah.mp3');
  const [jumatAdzanDuration, setJumatAdzanDuration] = useState(4);
  const [jumatIqomahBackground, setJumatIqomahBackground] = useState('1');
  const [jumatIqomahBackgroundUrl, setJumatIqomahBackgroundUrl] = useState('');
  const [jumatIqomahMessage, setJumatIqomahMessage] = useState('Luruskan dan rapatkan shaf untuk shalat Jumat');
  const [jumatIqomahDuration, setJumatIqomahDuration] = useState(10);
  
  
  const [formData, setFormData] = useState({
    khatib: '',
    imam: '',
    muadzin: '',
    theme: '',
    saldoAwal: 0,
    pemasukan: 0,
    pengeluaran: 0,
    saldoAkhir: 0,
    runningText: []
  });

  const [displaySetting, setDisplaySetting] = useState({ runningTextSpeed: 25, runningTextSize: 64 });
  const [newRunningText, setNewRunningText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [resFriday, resPrayer, resSetting] = await Promise.all([
        axios.get(`${API_BASE_URL}/friday`),
        axios.get(`${API_BASE_URL}/prayer-config`),
        axios.get(`${API_BASE_URL}/display-setting`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const res = resFriday;
      setJumatMode(resPrayer.data.jumatMode);
      setJumatTimeStart(resPrayer.data.jumatTimeStart || "06:00");
      setJumatTimeEnd(resPrayer.data.jumatTimeEnd || "14:00");
      setJumatRunningTextEnabled(resPrayer.data.jumatRunningTextEnabled !== false);
      setJumatLayoutStyle(resPrayer.data.jumatLayoutStyle || 'jumat_1');
      
      setJumatAdzanBackground(resPrayer.data.jumatAdzanBackground || 'black');
      setJumatAdzanBackgroundUrl(resPrayer.data.jumatAdzanBackgroundUrl || '');
      setJumatAdzanAudio(resPrayer.data.jumatAdzanAudio || 'adzan-makkah.mp3');
      setJumatAdzanDuration(resPrayer.data.jumatAdzanDuration ?? 4);
      
      setJumatIqomahBackground(resPrayer.data.jumatIqomahBackground || '1');
      setJumatIqomahBackgroundUrl(resPrayer.data.jumatIqomahBackgroundUrl || '');
      setJumatIqomahMessage(resPrayer.data.jumatIqomahMessage || 'Luruskan dan rapatkan shaf untuk shalat Jumat');
      setJumatIqomahDuration(resPrayer.data.jumatIqomahDuration ?? 10);
      
      setDisplaySetting(resSetting.data);
      let parsedRunningText = [];
      try {
        parsedRunningText = JSON.parse(res.data.runningText || '[]');
      } catch (e) {
        parsedRunningText = [];
      }
      
      setFormData({
        khatib: res.data.khatib || '',
        imam: res.data.imam || '',
        muadzin: res.data.muadzin || '',
        theme: res.data.theme || '',
        saldoAwal: res.data.saldoAwal || 0,
        pemasukan: res.data.pemasukan || 0,
        pengeluaran: res.data.pengeluaran || 0,
        saldoAkhir: res.data.saldoAkhir || 0,
        runningText: parsedRunningText
      });
    } catch (err) {
      console.error('Failed to fetch data', err);
      showAlert({ title: 'Gagal', message: 'Gagal mengambil data jadwal Jumat', type: 'error' });
    } finally {
      setLoading(false);
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

  const updateColor = async (newColor) => {
    try {
      setDisplaySetting(prev => ({ ...prev, runningTextColor: newColor }));
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/display-setting`, { runningTextColor: newColor }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Failed updating color', e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatRupiah = (number) => {
    if (number === undefined || number === null || number === '') return '';
    return 'Rp. ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: rawValue ? parseInt(rawValue, 10) : ''
    }));
  };

  useEffect(() => {
    // Automatically calculate saldoAkhir when finances change
    const awal = parseFloat(formData.saldoAwal) || 0;
    const masuk = parseFloat(formData.pemasukan) || 0;
    const keluar = parseFloat(formData.pengeluaran) || 0;
    const akhir = awal + masuk - keluar;
    
    if (formData.saldoAkhir !== akhir) {
      setFormData(prev => ({
        ...prev,
        saldoAkhir: akhir
      }));
    }
  }, [formData.saldoAwal, formData.pemasukan, formData.pengeluaran]);

  const addRunningText = () => {
    if (!newRunningText.trim()) return;
    setFormData(prev => ({
      ...prev,
      runningText: [...prev.runningText, newRunningText.trim()]
    }));
    setNewRunningText('');
  };

  const removeRunningText = (index) => {
    setFormData(prev => ({
      ...prev,
      runningText: prev.runningText.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await Promise.all([
        axios.put(`${API_BASE_URL}/friday`, {
          ...formData,
          runningText: JSON.stringify(formData.runningText)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.put(`${API_BASE_URL}/prayer-config`, {
          jumatMode,
          jumatTimeStart,
          jumatTimeEnd,
          jumatRunningTextEnabled,
          jumatLayoutStyle,
          jumatAdzanBackground,
          jumatAdzanBackgroundUrl,
          jumatAdzanAudio,
          jumatAdzanDuration,
          jumatIqomahBackground,
          jumatIqomahBackgroundUrl,
          jumatIqomahMessage,
          jumatIqomahDuration
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      showAlert({ title: 'Berhasil', message: 'Data Jumat berhasil disimpan', type: 'success' });
    } catch (err) {
      showAlert({ title: 'Gagal', message: 'Gagal menyimpan data', type: 'error' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/friday/preview`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert({ title: 'Preview Berjalan', message: 'Preview Shalat Jumat sedang ditampilkan di TV selama 30 detik.', type: 'info' });
    } catch (err) {
      showAlert({ title: 'Gagal', message: 'Gagal mengirim perintah preview ke TV.', type: 'error' });
      console.error(err);
    } finally {
      setPreviewing(false);
    }
  };

  const handlePreviewAdzan = async () => {
    setPreviewingAdzan(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/friday/preview-adzan`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert({ title: 'Preview Aktif', message: 'Tampilan Adzan Jumat ditampilkan di TV selama 15 detik.', type: 'success' });
    } catch (error) {
      showAlert({ title: 'Error', message: 'Gagal mengaktifkan preview', type: 'error' });
    } finally {
      setPreviewingAdzan(false);
    }
  };

  const handlePreviewIqomah = async () => {
    setPreviewingIqomah(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/friday/preview-iqomah`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert({ title: 'Preview Aktif', message: 'Tampilan Iqomah Jumat ditampilkan di TV selama 15 detik.', type: 'success' });
    } catch (error) {
      showAlert({ title: 'Error', message: 'Gagal mengaktifkan preview', type: 'error' });
    } finally {
      setPreviewingIqomah(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Pengaturan Shalat Jumat</h1>
          <p className="text-[var(--text-secondary)] mt-1">Kelola petugas, keuangan, dan informasi khusus untuk hari Jumat.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handlePreview} 
            disabled={previewing || saving}
            className="btn-outline w-full md:w-auto"
          >
            {previewing ? (
              <div className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Preview di TV (30 Detik)'
            )}
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={saving || previewing}
            className="btn-primary w-full md:w-auto h-14 md:h-auto px-6 shadow-lg shadow-primary-500/30 flex items-center justify-center"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Petugas & Khutbah */}
        <div className="space-y-6">
          {/* Status Shalat Jumat */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors" onClick={() => setJumatMode(!jumatMode)}>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Status Shalat Jumat</h3>
                <p className="text-sm text-[var(--text-secondary)]">Aktifkan mode Layout Khusus Shalat Jumat.</p>
              </div>
              <div className={`w-12 h-6 shrink-0 rounded-full p-1 transition-colors duration-300 ${jumatMode ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${jumatMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">Mulai Tampil (Jam)</label>
                <input 
                  type="time" 
                  value={jumatTimeStart} 
                  onChange={(e) => setJumatTimeStart(e.target.value)} 
                  className="form-control" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">Selesai Tampil (Jam)</label>
                <input 
                  type="time" 
                  value={jumatTimeEnd} 
                  onChange={(e) => setJumatTimeEnd(e.target.value)} 
                  className="form-control" 
                />
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Pilih rentang jam untuk mode khusus Jumat.</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Pilih Tampilan (Layout) Shalat Jumat</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'jumat_1', name: 'Signature (Default)', desc: 'Desain elegan bawaan dengan ornamen khas.' },
                { id: 'jumat_2', name: 'Minimalis Modern', desc: 'Bersih, teks besar, mudah dibaca dari jauh.' },
                { id: 'jumat_3', name: 'Klasik Arab', desc: 'Nuansa tradisional dengan frame islami klasik.' },
                { id: 'jumat_4', name: 'Ultra Wide', desc: 'Memaksimalkan ruang horizontal TV.' },
                { id: 'jumat_5', name: 'Simplicity', desc: 'Sangat sederhana, fokus pada informasi inti.' },
                { id: 'jumat_6', name: 'Bold & Clear', desc: 'Tulisan super besar, sangat jelas terbaca oleh jamaah di belakang.' },
                { id: 'jumat_7', name: 'Elegant Gold', desc: 'Nuansa emas mewah dengan teks ukuran ekstra besar.' },
                { id: 'jumat_8', name: 'Modern Split', desc: 'Layar terbagi dua dengan proporsi dinamis dan teks maksimal.' },
                { id: 'jumat_9', name: 'Focused View', desc: 'Fokus penuh pada petugas Jumat, teks sangat menonjol.' },
                { id: 'jumat_10', name: 'Premium Dark', desc: 'Gelap elegan dengan kontras teks tinggi untuk keterbacaan maksimal.' }
              ].map(layout => (
                <div 
                  key={layout.id}
                  onClick={() => setJumatLayoutStyle(layout.id)}
                  className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    jumatLayoutStyle === layout.id 
                      ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10 shadow-lg shadow-[var(--primary-500)]/20' 
                      : 'border-[var(--border-color)] hover:border-[var(--primary-500)]/50 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold ${jumatLayoutStyle === layout.id ? 'text-[var(--primary-500)]' : 'text-[var(--text-primary)]'}`}>
                      {layout.name}
                    </h4>
                    {jumatLayoutStyle === layout.id && (
                      <span className="bg-[var(--primary-500)] text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  
                  {/* Miniature Previews for each layout */}
                  <div className="w-full h-24 mb-3 rounded-lg overflow-hidden relative bg-slate-900 border border-white/10 flex flex-col p-2">
                    <div className="text-white/30 text-[10px] absolute top-1 right-2 uppercase">{layout.id}</div>
                    <div className="flex gap-2 h-full">
                       {/* Abstract Representation */}
                       {layout.id === 'jumat_1' && (
                          <div className="w-full flex">
                             <div className="w-1/3 h-full border-r border-white/20 flex flex-col gap-1 pr-2 pt-2">
                                <div className="w-full h-2 bg-yellow-500/50 rounded"></div>
                                <div className="w-2/3 h-2 bg-white/20 rounded"></div>
                             </div>
                             <div className="w-2/3 h-full pl-2 pt-4 flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
                                   <div className="w-10 h-1 bg-white/50 rounded"></div>
                                </div>
                             </div>
                          </div>
                       )}
                       {layout.id === 'jumat_2' && (
                          <div className="w-full flex flex-col items-center justify-center gap-2">
                             <div className="w-32 h-4 bg-white/70 rounded"></div>
                             <div className="w-24 h-2 bg-emerald-500/70 rounded"></div>
                             <div className="w-40 h-8 bg-white/10 rounded-xl mt-2 flex gap-2 p-1">
                                <div className="flex-1 bg-emerald-500/20 rounded"></div>
                                <div className="flex-1 bg-emerald-500/20 rounded"></div>
                             </div>
                          </div>
                       )}
                       {layout.id === 'jumat_3' && (
                          <div className="w-full h-full border-4 border-double border-yellow-600/50 p-2 flex flex-col items-center justify-center gap-1 bg-[url('/masjid/pattern.png')] bg-cover">
                             <div className="w-10 h-3 bg-yellow-500/80 rounded-t-lg"></div>
                             <div className="w-20 h-2 bg-white/50 rounded"></div>
                             <div className="flex gap-4 mt-2">
                                <div className="w-8 h-8 rounded border border-yellow-500/30"></div>
                                <div className="w-8 h-8 rounded border border-yellow-500/30"></div>
                             </div>
                          </div>
                       )}
                       {layout.id === 'jumat_4' && (
                          <div className="w-full h-full flex flex-col">
                             <div className="w-full h-4 bg-emerald-900/50 flex justify-between px-2 items-center">
                               <div className="w-12 h-1 bg-white/50 rounded"></div>
                               <div className="w-12 h-1 bg-yellow-500/50 rounded"></div>
                             </div>
                             <div className="flex-1 flex px-4 items-center justify-center gap-6">
                               <div className="w-12 h-12 rounded bg-white/10"></div>
                               <div className="w-16 h-4 bg-white/30 rounded"></div>
                               <div className="w-12 h-12 rounded bg-white/10"></div>
                             </div>
                          </div>
                       )}
                       {layout.id === 'jumat_5' && (
                          <div className="w-full h-full flex flex-col p-2">
                             <div className="text-[10px] text-emerald-400 font-bold border-b border-white/20 pb-1 mb-2">SHALAT JUMAT</div>
                             <div className="flex gap-2">
                                <div className="w-1/2 flex flex-col gap-1">
                                   <div className="w-full h-4 bg-white/20 rounded"></div>
                                   <div className="w-2/3 h-2 bg-emerald-500/50 rounded"></div>
                                </div>
                                <div className="w-1/2 flex flex-col gap-1">
                                   <div className="w-full h-4 bg-white/20 rounded"></div>
                                   <div className="w-2/3 h-2 bg-emerald-500/50 rounded"></div>
                                </div>
                             </div>
                          </div>
                       )}
                       {['jumat_6', 'jumat_7', 'jumat_8', 'jumat_9', 'jumat_10'].includes(layout.id) && (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-white/50 text-[10px] bg-white/5 border border-white/10 rounded">
                             Preview {layout.id}
                          </div>
                       )}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">{layout.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
              <Calendar className="w-5 h-5 text-[var(--primary-500)]" />
              <h2 className="text-lg font-bold">Data Petugas</h2>
            </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Nama Khatib</label>
              <input 
                type="text" 
                name="khatib" 
                value={formData.khatib} 
                onChange={handleInputChange} 
                placeholder="Cth: Ustadz H. Abdul Somad, Lc., D.E.S.A."
                className="form-control" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tema Khutbah</label>
              <input 
                type="text" 
                name="theme" 
                value={formData.theme} 
                onChange={handleInputChange} 
                placeholder="Cth: Menjaga Ukhuwah Islamiyah"
                className="form-control" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Imam Shalat</label>
                <input 
                  type="text" 
                  name="imam" 
                  value={formData.imam} 
                  onChange={handleInputChange} 
                  className="form-control" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Muadzin</label>
                <input 
                  type="text" 
                  name="muadzin" 
                  value={formData.muadzin} 
                  onChange={handleInputChange} 
                  className="form-control" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Setting Adzan dan Iqomah Jumat */}
        <div className="glass-card p-6 mt-6">
          <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
            <h2 className="text-lg font-bold">Layar Adzan & Iqomah (Khusus Jumat)</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">Tema Adzan Jumat</label>
                <button
                  type="button"
                  onClick={handlePreviewAdzan}
                  disabled={previewingAdzan}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {previewingAdzan ? (
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                  Preview di TV
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Progress */}
                <div 
                  onClick={() => setJumatAdzanBackground('black')}
                  className={`cursor-pointer rounded-xl overflow-hidden border-[3px] transition-all duration-300 relative group ${jumatAdzanBackground === 'black' ? 'border-[var(--primary-500)] shadow-lg' : 'border-transparent shadow hover:border-[var(--primary-500)]/50'}`}
                >
                  <div className="aspect-video bg-black flex flex-col items-center justify-center border-4 border-[#c5a059] relative">
                    <img src={jumatAdzanBackgroundUrl || "/masjid/adzan_bg_dark.png"} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Dark Mosque" />
                    <div className="relative z-10 flex flex-col items-center scale-75 origin-center">
                      <span className="text-white text-xs mb-1">WAKTU ADZAN</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] text-4xl font-extrabold tracking-widest leading-none mb-4">SHALAT JUMAT</span>
                      <div className="w-48 h-8 bg-gradient-to-b from-[#e6c97a] to-[#b38531] rounded-full border-2 border-[#f0d892] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500 rounded-l-full"></div>
                        <span className="relative z-10 text-white font-bold text-lg font-mono">11:58</span>
                      </div>
                    </div>
                  </div>
                  {jumatAdzanBackground === 'black' && (
                    <div className="absolute top-2 right-2 bg-[var(--primary-500)] text-white p-1 rounded-full shadow-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>

                {/* Option 2: Animated */}
                <div 
                  onClick={() => setJumatAdzanBackground('image')}
                  className={`cursor-pointer rounded-xl overflow-hidden border-[3px] transition-all duration-300 relative group ${jumatAdzanBackground === 'image' ? 'border-[var(--primary-500)] shadow-lg' : 'border-transparent shadow hover:border-[var(--primary-500)]/50'}`}
                >
                  <div className="aspect-video bg-[#0a192f] border-4 border-[#c5a059] relative overflow-hidden flex items-center justify-center">
                    <img src="/masjid/mosque_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen blur-[1px]" alt="Globe" />
                    <div className="absolute w-[80%] h-[80%] right-[-10%] rounded-full bg-blue-900/30 border border-blue-400/20"></div>
                    <div className="absolute bottom-4 left-4 flex flex-col items-start scale-75 origin-bottom-left">
                      <span className="text-gray-400 text-[10px] tracking-widest uppercase mb-1">WAKTU ADZAN</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f3e7b1] via-[#d6a94f] to-[#aa771c] text-3xl font-extrabold tracking-widest leading-none mb-1">SHALAT JUMAT</span>
                      <span className="text-white text-xl font-bold font-mono">11:58</span>
                    </div>
                    <div className="absolute bottom-6 right-4 w-1/3 h-1 bg-gray-700/80 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-blue-500"></div>
                    </div>
                  </div>
                  {jumatAdzanBackground === 'image' && (
                    <div className="absolute top-2 right-2 bg-[var(--primary-500)] text-white p-1 rounded-full shadow-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 mt-2">Suara Adzan Jumat</label>
                <select 
                  value={jumatAdzanAudio} 
                  onChange={(e) => setJumatAdzanAudio(e.target.value)} 
                  className="form-control"
                >
                  <option value="adzan-makkah.mp3">Adzan Makkah</option>
                  <option value="adzan-madinah.mp3">Adzan Madinah</option>
                  <option value="adzan-nusantara.mp3">Adzan Nusantara</option>
                  <option value="beep.mp3">Hanya Beep Pendek</option>
                  <option value="none">Tidak Ada Suara (Mute)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 mt-2">Durasi Layar Adzan (Menit)</label>
                <input 
                  type="number" 
                  min="1" max="30"
                  value={jumatAdzanDuration} 
                  onChange={(e) => setJumatAdzanDuration(e.target.value)} 
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Pesan Layar Iqomah Jumat</label>
                <input 
                  type="text" 
                  value={jumatIqomahMessage} 
                  onChange={(e) => setJumatIqomahMessage(e.target.value)} 
                  placeholder="Luruskan dan rapatkan shaf untuk shalat Jumat"
                  className="form-control" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Durasi Hitung Mundur Iqomah (Menit)</label>
                <input 
                  type="number" 
                  min="1" max="30"
                  value={jumatIqomahDuration} 
                  onChange={(e) => setJumatIqomahDuration(e.target.value)} 
                  className="form-control"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">Tema Layar Iqomah Jumat</label>
                <button
                  type="button"
                  onClick={handlePreviewIqomah}
                  disabled={previewingIqomah}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg text-xs font-semibold hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {previewingIqomah ? (
                    <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                  Preview di TV
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: '1', image: '/masjid/iqomah_bg_1.png' },
                  { id: '2', image: '/masjid/iqomah_bg_2.png' },
                  { id: '3', image: '/masjid/iqomah_bg_3.png' },
                  { id: '4', image: '/masjid/iqomah_bg_4.png' },
                  { id: '5', image: '/masjid/adzan_bg_dark.png' }
                ].map((bg) => (
                  <div 
                    key={bg.id}
                    onClick={() => setJumatIqomahBackground(bg.id)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-[3px] transition-all duration-300 relative group flex flex-col bg-[var(--bg-card)] ${
                      jumatIqomahBackground === bg.id 
                        ? 'border-[var(--primary-500)] shadow-lg' 
                        : 'border-transparent shadow hover:border-[var(--primary-500)]/50'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center p-2">
                      <img src={bg.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      
                      {bg.id === '5' ? (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center scale-50 origin-center">
                          <h3 className="text-white text-base font-medium tracking-wide mb-1 drop-shadow-md">IQAMAH</h3>
                          <div className="relative w-48 h-8 rounded-full overflow-hidden bg-gradient-to-b from-[#e6c97a] to-[#b38531] border-2 border-[#f0d892] flex items-center justify-center mb-2">
                            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-blue-400 w-1/3"></div>
                            <div className="relative z-10 text-xl font-bold font-mono text-[#fff19a]">03:58</div>
                          </div>
                          <div className="text-white font-bold text-[8px] uppercase bg-black/40 px-2 py-1 rounded-full border border-white/20 max-w-[90%] truncate">
                            {jumatIqomahMessage || "Luruskan dan rapatkan shaf untuk shalat Jumat"}
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center scale-50 origin-center">
                          <h3 className="text-[#967d3e] text-base font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">IQAMAH</h3>
                          <div className={`text-4xl font-extrabold tracking-tighter mb-2 font-mono ${bg.id === '3' ? 'text-white' : 'text-[#102a43]'}`}>03:58</div>
                          <div className="bg-[#fcf8e3] text-[#785b28] border border-[#d4b97a] px-3 py-1 rounded-full text-[8px] font-bold max-w-[80%] truncate">
                            {jumatIqomahMessage || "Luruskan dan rapatkan shaf untuk shalat Jumat"}
                          </div>
                        </div>
                      )}

                      {jumatIqomahBackground === bg.id && (
                        <div className="absolute top-2 right-2 bg-[var(--primary-500)] text-white p-1 rounded-full shadow-lg z-20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

        {/* Kolom Kanan: Keuangan & Running Text */}
        <div className="space-y-6">
          
          {/* Laporan Keuangan */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-6">
              <h2 className="text-lg font-bold">Kas Masjid</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Saldo Awal</label>
                <input 
                  type="text" 
                  name="saldoAwal" 
                  value={formatRupiah(formData.saldoAwal)} 
                  onChange={handleCurrencyChange} 
                  className="form-control font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Pemasukan</label>
                <input 
                  type="text" 
                  name="pemasukan" 
                  value={formatRupiah(formData.pemasukan)} 
                  onChange={handleCurrencyChange} 
                  className="form-control font-mono text-green-600 dark:text-green-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Pengeluaran</label>
                <input 
                  type="text" 
                  name="pengeluaran" 
                  value={formatRupiah(formData.pengeluaran)} 
                  onChange={handleCurrencyChange} 
                  className="form-control font-mono text-red-600 dark:text-red-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Saldo Akhir</label>
                <input 
                  type="text" 
                  name="saldoAkhir" 
                  value={formatRupiah(formData.saldoAkhir)} 
                  readOnly
                  className="form-control font-mono font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed border-none" 
                />
              </div>
            </div>
          </div>

          {/* Running Text Jumat */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Teks Berjalan Khusus Jumat</h2>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newRunningText} 
                onChange={(e) => setNewRunningText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && addRunningText()}
                placeholder="Cth: Mohon nonaktifkan HP Anda..."
                className="form-control flex-1" 
              />
              <button 
                onClick={addRunningText}
                className="bg-[var(--primary-500)] text-white p-3 md:p-3.5 rounded-xl hover:bg-[var(--primary-600)] transition-colors"
                title="Tambah Pesan"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {formData.runningText.length === 0 ? (
                <div className="text-center py-6 text-sm text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-color)] rounded-xl">
                  Belum ada pesan teks berjalan.
                </div>
              ) : (
                formData.runningText.map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[var(--bg-color)] p-3 rounded-lg border border-[var(--border-color)] group">
                    <div className="mt-0.5 text-xs bg-[var(--primary-100)] text-[var(--primary-700)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-300)] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-sm text-[var(--text-primary)]">{text}</p>
                    <button 
                      onClick={() => removeRunningText(idx)}
                      className="text-red-400 hover:text-red-600 p-2 md:p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pengaturan Ukuran & Kecepatan */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-6">
              <h2 className="text-lg font-bold">Pengaturan Tampilan Teks Berjalan</h2>
            </div>
            
            <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors mb-6" onClick={() => setJumatRunningTextEnabled(!jumatRunningTextEnabled)}>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Status Teks Berjalan Khusus Jumat</h3>
                <p className="text-xs text-[var(--text-secondary)]">Tampilkan atau sembunyikan teks berjalan di layar TV saat Shalat Jumat.</p>
              </div>
              <div className={`w-10 h-5 shrink-0 rounded-full p-1 transition-colors duration-300 ${jumatRunningTextEnabled ? 'bg-[var(--primary-500)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${jumatRunningTextEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="mb-6 pt-6 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-[var(--text-primary)]">Kecepatan Teks</label>
                <span className="text-xs font-mono bg-[var(--primary-500)]/10 text-[var(--primary-600)] dark:text-[var(--primary-500)] px-2 py-1 rounded">
                  {displaySetting?.runningTextSpeed || 25} detik
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Semakin kecil angkanya, semakin cepat teks berjalan.</p>
              <input 
                type="range" 
                min="5" 
                max="60" 
                value={displaySetting?.runningTextSpeed || 25} 
                onChange={(e) => updateSpeed(parseInt(e.target.value))}
                className="w-full accent-[var(--primary-500)]" 
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Cepat</span>
                <span>Lambat</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-[var(--text-primary)]">Ukuran Teks</label>
                <span className="text-xs font-mono bg-[var(--primary-500)]/10 text-[var(--primary-600)] dark:text-[var(--primary-500)] px-2 py-1 rounded">
                  {displaySetting?.runningTextSize || 64} px
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Ubah ukuran tulisan running text pada layar TV.</p>
              <input 
                type="range" 
                min="32" 
                max="120" 
                value={displaySetting?.runningTextSize || 64} 
                onChange={(e) => updateSize(parseInt(e.target.value))}
                className="w-full accent-[var(--primary-500)]" 
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Kecil</span>
                <span>Besar</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-[var(--text-primary)]">Warna Teks Berjalan</label>
                <span 
                  className="w-6 h-6 rounded border border-gray-300" 
                  style={{ backgroundColor: displaySetting?.runningTextColor || '#FBBF24' }}
                ></span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Pilih warna teks berjalan khusus untuk Shalat Jumat.</p>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={displaySetting?.runningTextColor || '#FBBF24'} 
                  onChange={(e) => updateColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer rounded bg-transparent border border-gray-600" 
                />
                <span className="font-mono text-sm uppercase">{displaySetting?.runningTextColor || '#FBBF24'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
