'use client';

import { useState, useEffect } from 'react';
import { adminApiService } from '@/lib/adminApi';
import type { Report } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, Ban, User, Calendar } from 'lucide-react';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

const ITEMS_PER_PAGE = 40;

export default function AdminReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'rejected' | string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.getAllReports();
      
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setError(response.message || 'Gagal memuat laporan');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err : any) {
      console.error('Error fetching reports:', err);
      setError('Terjadi kesalahan saat memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (reportId: number, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin mem-BAN user "${userName}"?\n\nTindakan ini akan:\n- Memblokir akun user\n- Menghapus SEMUA komentar user\n- Tidak dapat dibatalkan`)) {
      return;
    }

    try {
      setActionLoading(reportId);
      const response = await adminApiService.banUserFromReport(reportId);
      
      if (response.success) {
        alert('User berhasil dibanned dan semua komentarnya dihapus');
        await fetchReports();
      } else {
        throw new Error(response.message || 'Gagal mem-ban user');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error banning user:', err);
      alert(err.message || 'Terjadi kesalahan saat mem-ban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectReport = async (reportId: number) => {
    if (!confirm('Apakah Anda yakin ingin menolak laporan ini?')) {
      return;
    }

    try {
      setActionLoading(reportId);
      const response = await adminApiService.rejectReport(reportId);
      
      if (response.success) {
        alert('Laporan ditolak');
        await fetchReports();
      } else {
        throw new Error(response.message || 'Gagal menolak laporan');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error rejecting report:', err);
      alert(err.message || 'Terjadi kesalahan saat menolak laporan');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: AlertTriangle },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Reviewed', icon: CheckCircle },
      resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const filteredReports = filterStatus === 'all' 
    ? reports 
    : reports.filter(r => r.status === filterStatus);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#B6771D] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat laporan...</p>
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
              MANAJEMEN LAPORAN
            </h1>
            <p className="text-gray-600 mt-2">Kelola laporan pengguna</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Laporan</p>
                <p className="text-3xl font-bold text-yellow-600">{reports.length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {reports.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-bold text-gray-700">No</th>
                <th className="text-left p-4 font-bold text-gray-700">Pelapor</th>
                <th className="text-left p-4 font-bold text-gray-700">User Dilaporkan</th>
                <th className="text-left p-4 font-bold text-gray-700">Alasan</th>
                <th className="text-left p-4 font-bold text-gray-700">Status</th>
                <th className="text-left p-4 font-bold text-gray-700">Tanggal</th>
                <th className="text-center p-4 font-bold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {filterStatus === 'all' ? 'Belum ada laporan' : `Tidak ada laporan dengan status ${filterStatus}`}
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report, index) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">{startIndex + index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-semibold text-gray-800">{report.reporter.nama}</p>
                          <p className="text-xs text-gray-500">{report.reporter.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-800">{report.reportedUser.nama}</p>
                        <p className="text-xs text-gray-500">{report.reportedUser.email}</p>
                        {report.reportedUser.isBanned && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                            BANNED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700 line-clamp-2">{report.reason}</p>
                    </td>
                    <td className="p-4">{getStatusBadge(report.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {report.status === 'pending' && !report.reportedUser.isBanned && (
                          <>
                            <button
                              onClick={() => handleBanUser(report.id, report.reportedUser.nama)}
                              disabled={actionLoading === report.id}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" />
                              Ban User
                            </button>
                            <button
                              onClick={() => handleRejectReport(report.id)}
                              disabled={actionLoading === report.id}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              Tolak
                            </button>
                          </>
                        )}
                        {report.reportedUser.isBanned && (
                          <span className="text-xs text-gray-500">User sudah dibanned</span>
                        )}
                        {report.status !== 'pending' && !report.reportedUser.isBanned && (
                          <span className="text-xs text-gray-500">Laporan {report.status}</span>
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
        {filteredReports.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredReports.length}
          />
        )}
      </div>
    </div>
  );
}
