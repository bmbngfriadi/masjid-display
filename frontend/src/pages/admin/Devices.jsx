import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Monitor, CheckCircle, XCircle, Plus, Edit2, Trash2, Camera, X } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Devices() {
  const { showAlert, showConfirm, showPrompt } = useDialog();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDevices(res.data);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: 'Hapus TV',
      message: 'Yakin ingin menghapus perangkat ini?',
      type: 'warning',
      confirmText: 'Hapus'
    });
    if (!isConfirmed) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_BASE_URL}/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDevices(); // Refresh
    } catch (err) {
      showAlert({ title: 'Gagal', message: 'Gagal menghapus device', type: 'error' });
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(() => {
      fetchDevices();
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Manajemen TV Display</h2>
          <p className="text-[var(--text-secondary)]">Kelola perangkat TV yang terhubung ke jaringan.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button 
            onClick={() => setShowScanner(true)}
            className="btn-primary"
          >
            <Camera size={18} />
            Scan QR
          </button>
          <button 
            onClick={async () => {
              const code = await showPrompt({
                title: 'Pairing TV',
                message: 'Masukkan 6-digit Pairing Code yang tampil di layar TV:'
              });
              if (code) {
                window.location.href = `/masjid/pair/${code}`;
              }
            }}
            className="btn-secondary"
          >
            <Plus size={18} />
            Manual
          </button>
        </div>
      </div>
      
      <div className="glass-card data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Terakhir Aktif</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-[var(--text-secondary)]">Memuat data...</td></tr>
            ) : devices.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-[var(--text-secondary)]">Belum ada TV yang dipairing.</td></tr>
            ) : devices.map((device) => (
              <tr key={device.id}>
                <td data-label="Device">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[var(--primary-500)]">
                      <Monitor className="h-5 w-5" />
                    </div>
                    <div className="font-semibold">{device.name || 'TV Display'}</div>
                  </div>
                </td>
                <td data-label="Status">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                    device.status === 'ONLINE' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' 
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
                  }`}>
                    {device.status === 'ONLINE' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                    {device.status}
                  </span>
                </td>
                <td data-label="IP Address" className="font-mono text-sm text-[var(--text-secondary)]">
                  {device.ip || '-'}
                </td>
                <td data-label="Terakhir Aktif" className="text-sm text-[var(--text-secondary)]">
                  {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : '-'}
                </td>
                <td data-label="Aksi" className="md:text-right">
                  <div className="flex items-center md:justify-end gap-3 mt-2 md:mt-0">
                    <button 
                      onClick={async () => {
                        const newName = await showPrompt({
                          title: 'Ganti Nama TV',
                          message: 'Ubah nama untuk TV ini:',
                          defaultValue: device.name || ''
                        });
                        if (newName && newName !== device.name) {
                          try {
                            const token = localStorage.getItem('admin_token');
                            await axios.put(`${API_BASE_URL}/devices/${device.id}`, { name: newName }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchDevices();
                          } catch (err) {
                            showAlert({ title: 'Gagal', message: 'Gagal mengubah nama', type: 'error' });
                          }
                        }
                      }}
                      className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Nama"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(device.id)} 
                      className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showScanner && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-[var(--bg-card)] w-full max-w-full sm:max-w-md max-h-[100vh] sm:max-h-[calc(100vh-2rem)] flex flex-col rounded-t-[32px] sm:rounded-2xl overflow-hidden shadow-2xl relative mt-auto sm:my-auto animate-drawer-up pb-[env(safe-area-inset-bottom)] sm:pb-0">
            {/* Handle bar for mobile bottom sheet */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0"></div>
            
            <div className="p-4 pt-2 sm:pt-4 flex justify-between items-center border-b border-[var(--border-color)] shrink-0">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">Scan QR Code TV</h3>
              <button onClick={() => setShowScanner(false)} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-0 bg-black w-full h-[50vh] max-h-[400px] flex items-center justify-center relative overflow-hidden shrink">
              <Scanner
                onScan={(result) => {
                  if (result && result.length > 0) {
                    const text = result[0].rawValue;
                    console.log('Scanned text:', text);
                    const match = text.match(/\/pair\/(\d{6})/);
                    if (match && match[1]) {
                      window.location.href = `/masjid/pair/${match[1]}`;
                    } else if (/^\d{6}$/.test(text)) {
                       window.location.href = `/masjid/pair/${text}`;
                    }
                  }
                }}
                formats={['qr_code']}
                onError={(error) => {
                  console.log(error?.message);
                  if (error?.message?.includes('Permission denied')) {
                     alert('Izin kamera ditolak. Izinkan akses kamera di browser Anda.');
                  }
                }}
                styles={{
                  container: { width: '100%', height: '100%' },
                  video: { objectFit: 'cover' }
                }}
              />
            </div>
            <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)] shrink-0">
              <p className="text-center text-sm text-[var(--text-secondary)] mb-4">
                Arahkan kamera ke QR Code yang muncul di layar TV Anda.
              </p>
              <button 
                onClick={() => setShowScanner(false)} 
                className="btn-secondary w-full"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
