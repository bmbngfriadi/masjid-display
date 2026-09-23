import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Users as UsersIcon, Plus, Edit2, Trash2, ShieldAlert, Check, X } from 'lucide-react';
import { useDialog } from '../../contexts/DialogContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';

export default function Users() {
  const { showAlert, showConfirm } = useDialog();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // The user currently logged in
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    canManageDevices: true,
    canManageText: true,
    canManageProfile: true,
    canManageUsers: false,
    canManageLogs: false,
    canManagePrayerTimes: true,
    canManageFridaySchedule: true,
    canManageAdzanScreen: true,
    canManageIqomahScreen: true,
    canManageSholatScreen: true,
    canManageLayout: true
  });
  
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('admin_token');
      const payload = { ...formData };
      
      if (modalMode === 'add') {
        if (!payload.password) return setError('Password wajib diisi untuk pengguna baru.');
        await axios.post(`${API_BASE_URL}/users`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        if (!payload.password) delete payload.password; // Don't update if empty
        await axios.put(`${API_BASE_URL}/users/${payload.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data pengguna.');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm({
      title: 'Hapus Pengguna',
      message: 'Apakah Anda yakin ingin menghapus pengguna ini?',
      type: 'warning',
      confirmText: 'Hapus'
    });
    
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        showAlert({ 
          title: 'Gagal', 
          message: err.response?.data?.message || 'Gagal menghapus pengguna', 
          type: 'error' 
        });
      }
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: null,
      username: '',
      email: '',
      password: '',
      canManageDevices: true,
      canManageText: true,
      canManageProfile: true,
      canManageUsers: false,
      canManageLogs: false,
      canManagePrayerTimes: true,
      canManageFridaySchedule: true,
      canManageAdzanScreen: true,
      canManageIqomahScreen: true,
      canManageSholatScreen: true,
      canManageLayout: true
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      password: '',
      canManageDevices: user.canManageDevices,
      canManageText: user.canManageText,
      canManageProfile: user.canManageProfile,
      canManageUsers: user.canManageUsers,
      canManageLogs: user.canManageLogs,
      canManagePrayerTimes: user.canManagePrayerTimes,
      canManageFridaySchedule: user.canManageFridaySchedule,
      canManageAdzanScreen: user.canManageAdzanScreen,
      canManageIqomahScreen: user.canManageIqomahScreen,
      canManageSholatScreen: user.canManageSholatScreen,
      canManageLayout: user.canManageLayout
    });
    setError('');
    setShowModal(true);
  };

  if (loading) return (
    <div className="p-8 text-center text-[var(--text-secondary)] font-medium flex items-center justify-center gap-3">
      <span className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></span>
      Memuat daftar pengguna...
    </div>
  );

  // If user doesn't have permission to manage users
  if (currentUser && !currentUser.canManageUsers && currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6 drop-shadow-lg" />
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Akses Ditolak</h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto">
          Anda tidak memiliki izin untuk mengakses halaman Manajemen Pengguna.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Kelola Pengguna</h2>
          <p className="text-[var(--text-secondary)]">Manajemen akun admin dan kontrol hak akses aplikasi.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary mt-4 md:mt-0">
          <Plus size={18} /> Tambah Pengguna
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Hak Akses (Izin)</th>
                <th>Tanggal Bergabung</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td data-label="Pengguna">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/10 text-[var(--primary-500)] flex items-center justify-center">
                        <UsersIcon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{user.username}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Hak Akses">
                    <div className="flex flex-wrap gap-2">
                      {user.canManageDevices && <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-md font-medium">TV</span>}
                      {user.canManageText && <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-md font-medium">Teks</span>}
                      {user.canManageProfile && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-md font-medium">Profil</span>}
                      {user.canManageUsers && <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-md font-medium">Pengguna</span>}
                      {user.canManageLogs && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs rounded-md font-medium">Log</span>}
                      {user.canManagePrayerTimes && <span className="px-2 py-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-xs rounded-md font-medium">Waktu Sholat</span>}
                      {user.canManageFridaySchedule && <span className="px-2 py-1 bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 text-xs rounded-md font-medium">Jumat</span>}
                      {user.canManageAdzanScreen && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-md font-medium">Adzan</span>}
                      {user.canManageIqomahScreen && <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs rounded-md font-medium">Iqomah</span>}
                      {user.canManageSholatScreen && <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-md font-medium">Sholat</span>}
                      {user.canManageLayout && <span className="px-2 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 text-xs rounded-md font-medium">Tema</span>}
                    </div>
                  </td>
                  <td data-label="Tgl Bergabung" className="text-[var(--text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td data-label="Aksi" className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Pengguna"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={currentUser?.id === user.id}
                        className="p-3 md:p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--text-secondary)]"
                        title="Hapus Pengguna"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-[var(--text-secondary)]">
                    Belum ada pengguna terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit User */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-card)] rounded-t-[32px] sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-drawer-up border-t sm:border border-[var(--border-color)] pb-[env(safe-area-inset-bottom)] sm:pb-0">
            {/* Handle bar for mobile bottom sheet */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0"></div>
            
            <div className="overflow-y-auto flex-1 w-full custom-scrollbar">
              <div className="p-6 pt-2 sm:pt-6 border-b border-[var(--border-color)] flex justify-between items-center sticky top-0 bg-[var(--bg-card)] z-10">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {modalMode === 'add' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-medium text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="form-grid-2 mb-6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="form-label">Password {modalMode === 'edit' && '(Kosongkan jika tidak diubah)'}</label>
                  <input
                    type="password"
                    required={modalMode === 'add'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label mb-3 block border-b border-[var(--border-color)] pb-2">Checklist Hak Akses</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  
                  <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.canManageDevices}
                      onChange={(e) => setFormData({...formData, canManageDevices: e.target.checked})}
                      className="w-5 h-5 accent-[var(--primary-500)]"
                    />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Perangkat TV</div>
                      <div className="text-xs text-[var(--text-secondary)]">Dapat memanipulasi TV</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.canManageText}
                      onChange={(e) => setFormData({...formData, canManageText: e.target.checked})}
                      className="w-5 h-5 accent-[var(--primary-500)]"
                    />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Running Text</div>
                      <div className="text-xs text-[var(--text-secondary)]">Ubah pengumuman teks</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.canManageProfile}
                      onChange={(e) => setFormData({...formData, canManageProfile: e.target.checked})}
                      className="w-5 h-5 accent-[var(--primary-500)]"
                    />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Profil Masjid</div>
                      <div className="text-xs text-[var(--text-secondary)]">Ubah identitas masjid</div>
                    </div>
                  </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageUsers}
                        onChange={(e) => setFormData({...formData, canManageUsers: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Pengguna</div>
                        <div className="text-xs text-[var(--text-secondary)]">Tambah/Hapus Admin</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageLogs}
                        onChange={(e) => setFormData({...formData, canManageLogs: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Akses Audit Log</div>
                        <div className="text-xs text-[var(--text-secondary)]">Lihat riwayat aktivitas</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManagePrayerTimes}
                        onChange={(e) => setFormData({...formData, canManagePrayerTimes: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Waktu Sholat</div>
                        <div className="text-xs text-[var(--text-secondary)]">Kordinat & Koreksi waktu</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageFridaySchedule}
                        onChange={(e) => setFormData({...formData, canManageFridaySchedule: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Jadwal Jumat</div>
                        <div className="text-xs text-[var(--text-secondary)]">Petugas & Laporan kas</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageAdzanScreen}
                        onChange={(e) => setFormData({...formData, canManageAdzanScreen: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Layar Adzan</div>
                        <div className="text-xs text-[var(--text-secondary)]">Tampilan saat Adzan</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageIqomahScreen}
                        onChange={(e) => setFormData({...formData, canManageIqomahScreen: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Layar Iqomah</div>
                        <div className="text-xs text-[var(--text-secondary)]">Tampilan hitung mundur</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageSholatScreen}
                        onChange={(e) => setFormData({...formData, canManageSholatScreen: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Layar Sholat</div>
                        <div className="text-xs text-[var(--text-secondary)]">Tampilan layar tenang</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.canManageLayout}
                        onChange={(e) => setFormData({...formData, canManageLayout: e.target.checked})}
                        className="w-5 h-5 accent-[var(--primary-500)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Kelola Tema & Layout</div>
                        <div className="text-xs text-[var(--text-secondary)]">Tampilan utama TV</div>
                      </div>
                    </label>

                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-full font-medium text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={18} />
                  Simpan
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
