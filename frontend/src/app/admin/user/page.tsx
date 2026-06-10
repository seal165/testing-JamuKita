'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import type { AdminUser } from '@/types';
import { Trash2, Search, UserCheck, Shield, User as UserIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

const ITEMS_PER_PAGE = 30;

export default function UserPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        throw new Error(response.message || 'Gagal memuat data pengguna');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingId) return;
    
    try {
      setDeletingId(id);
      const response = await apiService.deleteUser(id);
      
      if (response.success) {
        setUsers(users.filter(user => user.id !== id));
        setDeleteConfirm(null);
        alert('Pengguna berhasil dihapus');
      } else {
        throw new Error(response.message || 'Gagal menghapus pengguna');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus pengguna');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const anggotaCount = users.filter(u => u.role === 'anggota').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#B6771D] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Image */}
      <div className="w-full h-32 rounded-2xl overflow-hidden">
        <Image 
           src="/images/header.png"
          alt="Herbs Header"
          width={1200}
          height={0}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#B6771D]" style={{ fontFamily: 'Inter' }}>
              MANAJEMEN PENGGUNA
            </h1>
            <p className="text-gray-600 mt-2">Kelola akun pengguna yang terdaftar di sistem</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-[#B6771D] text-white rounded-lg hover:bg-[#9a6118] transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Pengguna</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
              <UserIcon className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Anggota</p>
                <p className="text-3xl font-bold text-green-600">{anggotaCount}</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Admin</p>
                <p className="text-3xl font-bold text-purple-600">{adminCount}</p>
              </div>
              <Shield className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pengguna berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D] focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Menampilkan {filteredUsers.length} dari {users.length} pengguna
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-bold text-gray-700">No</th>
                <th className="text-left p-4 font-bold text-gray-700">Nama</th>
                <th className="text-left p-4 font-bold text-gray-700">Email</th>
                <th className="text-left p-4 font-bold text-gray-700">Role</th>
                <th className="text-left p-4 font-bold text-gray-700">Tanggal Daftar</th>
                <th className="text-center p-4 font-bold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada pengguna yang cocok dengan pencarian' : 'Belum ada pengguna terdaftar'}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">{startIndex + index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#B6771D] flex items-center justify-center text-white font-semibold">
                          {user.nama.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.nama}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="w-3 h-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Anggota
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {deleteConfirm === user.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deletingId === user.id}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              {deletingId === user.id ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deletingId === user.id}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            disabled={user.role === 'admin'}
                            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user.role === 'admin' ? 'Tidak dapat menghapus admin' : 'Hapus pengguna'}
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredUsers.length}
          />
        )}

        {/* Info Note */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Catatan:</strong> Akun admin tidak dapat dihapus. Anda hanya dapat menghapus akun dengan role &quot;Anggota&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}