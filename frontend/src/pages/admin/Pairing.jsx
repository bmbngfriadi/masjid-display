import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Link as LinkIcon, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Pairing() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [pairingCode, setPairingCode] = useState(code || '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePair = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatus('Memproses pairing...');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setStatus('❌ Anda harus login sebagai admin terlebih dahulu.');
        setTimeout(() => navigate('/admin/login'), 2000);
        return;
      }
      
      const res = await axios.post(`${API_BASE_URL}/devices/pair`, {
        code: pairingCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus('✅ Pairing Berhasil! Layar TV akan otomatis masuk ke tampilan Masjid.');
      setTimeout(() => navigate('/admin/devices'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('❌ Gagal pairing. Kode salah atau sudah kadaluarsa (atau Anda belum login Admin).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If opened via QR code (URL has code param), auto-submit if user is logged in
    // For now we just pre-fill the form
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color)]">
      {/* Decorative Header */}
      <div className="h-64 bg-slate-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-gradient opacity-30 pointer-events-none"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-4 -mt-32 relative z-10">
        <div className="glass-card w-full max-w-md p-8 text-center bg-[var(--bg-card)]">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-600)] flex items-center justify-center mx-auto mb-6">
            <LinkIcon size={32} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-extrabold mb-2 text-[var(--text-primary)] tracking-tight">Pairing TV Display</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-sm">Masukkan kode otentikasi dari layar TV Anda</p>
          
          <form onSubmit={handlePair}>
            <div className="form-group mb-6">
              <label className="form-label text-left text-xs uppercase tracking-widest text-[var(--text-secondary)]">Pairing Code (6 Digit)</label>
              <input 
                className="form-control text-center text-4xl font-mono font-bold tracking-[0.5em] py-6 text-[var(--primary-600)] dark:bg-black/20 uppercase" 
                type="text" 
                maxLength={6}
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                placeholder="000000" 
                required
              />
            </div>
            <button 
              className="btn-primary w-full py-4 text-lg mt-2" 
              type="submit"
              disabled={loading || pairingCode.length < 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Pairing Sekarang'
              )}
            </button>
          </form>

          {status && (
            <div className={`mt-8 p-4 rounded-xl font-medium text-sm flex items-start gap-3 text-left animate-fade-up ${
              status.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400' 
                : status.includes('✅') 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400' 
                  : 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}>
              <ShieldAlert className={`w-5 h-5 flex-shrink-0 mt-0.5 ${status.includes('❌') ? 'text-red-500' : status.includes('✅') ? 'text-emerald-500' : 'text-slate-500'}`} />
              <p>{status.replace(/[✅❌] /g, '')}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
            <p>Hanya administrator sah yang dapat melakukan prosedur ini.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
