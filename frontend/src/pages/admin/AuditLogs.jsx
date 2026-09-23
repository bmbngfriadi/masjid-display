import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Search, Filter, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ entity: '', action: '' });
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        page,
        limit: 20
      });
      if (filters.entity) params.append('entity', filters.entity);
      if (filters.action) params.append('action', filters.action);

      const res = await axios.get(`${API_BASE_URL}/audit-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Gagal mengambil data log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page on filter change
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'UPDATE': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'DELETE': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Log</h1>
          <p className="text-[var(--text-secondary)] mt-1">Riwayat aktivitas dan perubahan data sistem</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="btn btn-secondary flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-card p-6 border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Filter Modul</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                name="entity"
                value={filters.entity}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent appearance-none"
              >
                <option value="">Semua Modul</option>
                <option value="Mosque">Profil Masjid</option>
                <option value="PrayerTimeConfig">Waktu Sholat</option>
                <option value="RunningText">Teks Berjalan</option>
                <option value="DisplaySetting">Pengaturan Layar</option>
                <option value="User">Pengguna</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Filter Aksi</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent appearance-none"
              >
                <option value="">Semua Aksi</option>
                <option value="CREATE">Buat Baru (CREATE)</option>
                <option value="UPDATE">Perbarui (UPDATE)</option>
                <option value="DELETE">Hapus (DELETE)</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm">
                <th className="py-3 px-4 font-medium whitespace-nowrap">Waktu</th>
                <th className="py-3 px-4 font-medium">Pengguna</th>
                <th className="py-3 px-4 font-medium">Aksi</th>
                <th className="py-3 px-4 font-medium">Modul</th>
                <th className="py-3 px-4 font-medium min-w-[200px]">Detail</th>
                <th className="py-3 px-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[var(--text-secondary)]">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Memuat riwayat log...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[var(--text-secondary)]">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Tidak ada riwayat log yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-[var(--border-color)] hover:bg-slate-50/50 dark:hover:bg-[#0a0a0a]/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                      {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--text-primary)]">
                        {log.user ? log.user.username : 'Sistem'}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {log.user ? log.user.role : '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">
                      {log.entity}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {/* Tampilkan sedikit potongan JSON log. Jika ingin modal, bisa dibuat button detail */}
                      {log.newValue ? (
                        <div className="max-w-[250px] truncate text-[var(--text-secondary)] font-mono bg-[var(--bg-color)] p-1.5 rounded border border-[var(--border-color)]" title={log.newValue}>
                          {log.newValue}
                        </div>
                      ) : (
                        <span className="text-[var(--text-secondary)] italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--text-secondary)]">
                      {log.ip || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-color)]">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-[var(--text-secondary)]">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
