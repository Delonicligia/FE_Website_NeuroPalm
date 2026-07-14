import { useEffect, useState } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import { userService, type UserResponse } from '../../services/userService';

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  // Pagination States
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...users];

    if (roleFilter !== 'Semua') {
      result = result.filter((u) => u.role === roleFilter.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  const handleRoleChange = async (userId: number, currentRole: 'petani' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'petani' : 'admin';
    if (
      !window.confirm(
        `Apakah Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole.toUpperCase()}?`
      )
    )
      return;

    try {
      await userService.changeUserRole(userId, newRole);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert('Peran pengguna berhasil diperbarui.');
    } catch (err) {
      console.error('Failed to change role:', err);
      alert('Gagal mengubah peran pengguna. Pastikan Anda memiliki otorisasi Admin.');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex font-sans">
      <Sidebar activePage="users" />

      <div className="flex-1 flex flex-col justify-start items-start overflow-x-hidden">
        {/* Top Navbar */}
        <div className="self-stretch pl-16 pr-4 py-5 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm md:px-8">
          <div className="flex justify-start items-center gap-3 min-w-0">
            <div className="w-2.5 h-6 bg-emerald-800 rounded-full shrink-0" />
            <h1 className="text-black text-sm sm:text-base md:text-xl font-bold font-['Inter'] leading-tight py-1">Manajemen Pengguna</h1>
          </div>
          <button
            onClick={fetchUsers}
            className="px-2.5 py-2 sm:p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-100 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
            <span className="hidden sm:inline">Segarkan</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8">
          {/* Header Summary */}
          <div>
            <h2 className="text-black text-xl sm:text-2xl font-black font-['Inter']">
              <span className="text-black">Daftar Akun Pengguna</span>
            </h2>
            <p className="text-black text-xs sm:text-sm mt-1">
              Kelola peran pengguna dan otorisasi akses ke platform NeuroPalm.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="w-full p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Pencarian</label>
              <input
                type="text"
                placeholder="Cari username atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Filter Peran</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
              >
                <option value="Semua">Semua Peran</option>
                <option value="Admin">Admin</option>
                <option value="Petani">Petani</option>
              </select>
            </div>

            <button
              onClick={() => {
                setRoleFilter('Semua');
                setSearchQuery('');
              }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-700 font-bold rounded-xl text-sm transition text-center cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          {/* Users Table */}
          <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            {loading && (
              <div className="w-full p-12 text-center flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  <span className="text-neutral-500 text-sm font-medium">Sedang memuat data pengguna...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full p-8 text-center text-rose-800 bg-rose-50 border-b border-rose-100">
                <p className="font-semibold mb-2">{error}</p>
                <button onClick={fetchUsers} className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold hover:bg-rose-900 transition">
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
              <div className="w-full p-12 text-center text-neutral-500 flex flex-col justify-center items-center gap-4">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Tidak ada pengguna yang terdaftar.</span>
              </div>
            )}

            {!loading && !error && filteredUsers.length > 0 && (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-3 py-3 sm:px-6 sm:py-4">ID</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Nama Pengguna</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Email</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Peran (Role)</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Tanggal Daftar</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-3 py-3 sm:px-6 sm:py-4 font-mono text-xs text-neutral-600">
                          #{user.id}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold text-xs sm:text-sm">
                          {user.username}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm">
                          {user.email}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <span
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black border rounded-full uppercase tracking-wider ${
                              user.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-neutral-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                          <button
                            onClick={() => handleRoleChange(user.id, user.role)}
                            className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[10px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap"
                          >
                            Ubah ke {user.role === 'admin' ? 'Petani' : 'Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && filteredUsers.length > 0 && totalPages > 1 && (
              <div className="w-full border-t border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-neutral-500 text-sm">
                  Menampilkan <span className="font-bold text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="font-bold text-slate-800">{filteredUsers.length}</span> pengguna
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    title="Halaman Pertama"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    title="Halaman Sebelumnya"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, index, arr) => {
                      const elements = [];
                      if (index > 0 && p - arr[index - 1] > 1) {
                        elements.push(
                          <span key={`dots-${p}`} className="px-2 text-neutral-400">...</span>
                        );
                      }
                      elements.push(
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                            currentPage === p
                              ? 'bg-emerald-800 text-white'
                              : 'border border-slate-200 text-slate-600 bg-white hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                      return elements;
                    })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    title="Halaman Berikutnya"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    title="Halaman Terakhir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
