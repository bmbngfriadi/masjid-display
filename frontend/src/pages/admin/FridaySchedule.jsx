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
  const [jumatMode, setJumatMode] = useState(true);
  const [jumatTimeStart, setJumatTimeStart] = useState("06:00");
  const [jumatTimeEnd, setJumatTimeEnd] = useState("14:00");
  const [jumatRunningTextEnabled, setJumatRunningTextEnabled] = useState(true);
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          jumatRunningTextEnabled
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
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Saldo Awal (Rp)</label>
                <input 
                  type="number" 
                  name="saldoAwal" 
                  value={formData.saldoAwal} 
                  onChange={handleInputChange} 
                  className="form-control font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Pemasukan (Rp)</label>
                <input 
                  type="number" 
                  name="pemasukan" 
                  value={formData.pemasukan} 
                  onChange={handleInputChange} 
                  className="form-control font-mono text-green-600 dark:text-green-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Pengeluaran (Rp)</label>
                <input 
                  type="number" 
                  name="pengeluaran" 
                  value={formData.pengeluaran} 
                  onChange={handleInputChange} 
                  className="form-control font-mono text-red-600 dark:text-red-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Saldo Akhir (Rp)</label>
                <input 
                  type="number" 
                  name="saldoAkhir" 
                  value={formData.saldoAkhir} 
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
          </div>

        </div>
      </div>
    </div>
  );
}
