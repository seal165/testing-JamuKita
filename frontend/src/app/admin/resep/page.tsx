'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import type { Resep, Kategori, CreateResepData, ResepListResponse } from '@/types';
import { Plus, Edit2, Trash2, Search, X, Book, Tag } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

const ITEMS_PER_PAGE = 20;

export default function ResepManagementPage() {
  const [reseps, setReseps] = useState<Resep[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedResep, setSelectedResep] = useState<Resep | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<CreateResepData>({
    judul: '',
    deskripsi: '',
    gambarURL: '',
    kategoriId: 0,
    bahan: [''],
    langkahPembuatan: [''],
    sumberLiteratur: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resepResponse , kategoriResponse] = await Promise.all([
        apiService.getResepList({ limit: 100 }),
        apiService.getKategoriList()
      ]);
      
      if (resepResponse.success && resepResponse.data) {
        setReseps(resepResponse.data as any || []);
      }
      
      if (kategoriResponse.success && kategoriResponse.data) {
        setKategoris(kategoriResponse.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setImageBase64("");
    setFormData({
      judul: '',
      deskripsi: '',
      gambarURL: '',
      kategoriId: kategoris[0]?.id || 0,
      bahan: [''],
      langkahPembuatan: [''],
      sumberLiteratur: '',
    });
    setShowModal(true);
  };

  const openEditModal = async (resep: Resep) => {
    try {
      const response = await apiService.getResepDetail(resep.id);
      if (response.success && response.data) {
        const detail = response.data;
        setModalMode('edit');
        setSelectedResep(resep);
        setImageBase64("");
        setFormData({
          judul: detail.judul,
          deskripsi: detail.deskripsi,
          gambarURL: detail.gambarURL || '',
          kategoriId: detail.kategori.id,
          bahan: detail.bahan || [''],
          langkahPembuatan: detail.langkahPembuatan || [''],
          sumberLiteratur: detail.sumberLiteratur || '',
        });
        setShowModal(true);
      }
    } catch (err) {
      alert('Gagal memuat detail resep');
      console.error('Error fetching resep detail:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    // Validation
    if (!formData.judul.trim()) {
      alert('Judul resep harus diisi');
      return;
    }
    if (!formData.deskripsi.trim()) {
      alert('Deskripsi resep harus diisi');
      return;
    }
    if (!formData.kategoriId) {
      alert('Kategori harus dipilih');
      return;
    }
    
    const cleanedBahan = formData.bahan.filter(b => b.trim());
    const cleanedLangkah = formData.langkahPembuatan.filter(l => l.trim());
    
    if (cleanedBahan.length === 0) {
      alert('Minimal harus ada 1 bahan');
      return;
    }
    if (cleanedLangkah.length === 0) {
      alert('Minimal harus ada 1 langkah pembuatan');
      return;
    }
    
    try {
      setSubmitting(true);
      
      let finalImageUrl = formData.gambarURL;

      // Upload image to S3 if new image selected
      if (imageBase64 && imageBase64.startsWith("data:")) {
        try {
          const uploadResponse = await apiService.uploadImage({
            image: imageBase64,
            folder: "resep",
          });

          if (uploadResponse.success && uploadResponse.data?.url) {
            finalImageUrl = uploadResponse.data.url;
          } else {
            throw new Error("Gagal upload gambar");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (uploadError: any) {
          alert(`Gagal upload gambar: ${uploadError.message}`);
          setSubmitting(false);
          return;
        }
      }

      const submitData = {
        ...formData,
        bahan: cleanedBahan,
        langkahPembuatan: cleanedLangkah,
        gambarURL: finalImageUrl,
      };
      
      if (modalMode === 'create') {
        const response = await apiService.createResep(submitData);
        if (response.success) {
          alert('Resep berhasil ditambahkan');
          setShowModal(false);
          fetchData();
        } else {
          throw new Error(response.message || 'Gagal menambahkan resep');
        }
      } else if (selectedResep) {
        const response = await apiService.updateResep(selectedResep.id, submitData);
        if (response.success) {
          alert('Resep berhasil diperbarui');
          setShowModal(false);
          fetchData();
        } else {
          throw new Error(response.message || 'Gagal memperbarui resep');
        }
      }
    } catch (err) {
      console.error('Error submitting resep:', err);
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiService.deleteResep(id);
      if (response.success) {
        setReseps(reseps.filter(r => r.id !== id));
        setDeleteConfirm(null);
        alert('Resep berhasil dihapus');
      } else {
        throw new Error(response.message || 'Gagal menghapus resep');
      }
    } catch (err) {
      console.error('Error deleting resep:', err);
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const addBahanField = () => {
    setFormData({ ...formData, bahan: [...formData.bahan, ''] });
  };

  const removeBahanField = (index: number) => {
    const newBahan = formData.bahan.filter((_, i) => i !== index);
    setFormData({ ...formData, bahan: newBahan });
  };

  const updateBahanField = (index: number, value: string) => {
    const newBahan = [...formData.bahan];
    newBahan[index] = value;
    setFormData({ ...formData, bahan: newBahan });
  };

  const addLangkahField = () => {
    setFormData({ ...formData, langkahPembuatan: [...formData.langkahPembuatan, ''] });
  };

  const removeLangkahField = (index: number) => {
    const newLangkah = formData.langkahPembuatan.filter((_, i) => i !== index);
    setFormData({ ...formData, langkahPembuatan: newLangkah });
  };

  const updateLangkahField = (index: number, value: string) => {
    const newLangkah = [...formData.langkahPembuatan];
    newLangkah[index] = value;
    setFormData({ ...formData, langkahPembuatan: newLangkah });
  };

  const filteredReseps = reseps.filter(resep =>
    resep.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resep.kategori.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredReseps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReseps = filteredReseps.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#B6771D] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat data resep...</p>
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
              MANAJEMEN RESEP
            </h1>
            <p className="text-gray-600 mt-2">Kelola resep jamu tradisional Indonesia</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#B6771D] text-white rounded-lg hover:bg-[#9a6118] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Resep
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Resep</p>
                <p className="text-3xl font-bold text-blue-600">{reseps.length}</p>
              </div>
              <Book className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Kategori</p>
                <p className="text-3xl font-bold text-green-600">{kategoris.length}</p>
              </div>
              <Tag className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari resep berdasarkan judul atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D] focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Menampilkan {filteredReseps.length} dari {reseps.length} resep
            </p>
          )}
        </div>

        {/* Resep Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-bold text-gray-700">No</th>
                <th className="text-left p-4 font-bold text-gray-700">Judul</th>
                <th className="text-left p-4 font-bold text-gray-700">Kategori</th>
                <th className="text-left p-4 font-bold text-gray-700">Rating</th>
                <th className="text-center p-4 font-bold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReseps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada resep yang cocok dengan pencarian' : 'Belum ada resep'}
                  </td>
                </tr>
              ) : (
                paginatedReseps.map((resep, index) => (
                  <tr key={resep.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">{startIndex + index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {resep.gambarURL && (
                          <Image 
                            src={resep.gambarURL} 
                            alt={resep.judul}
                            width={64}
                            height={0}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{resep.judul}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{resep.deskripsi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {resep.kategori.nama}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-yellow-500">⭐ {resep.rataRataRating?.toFixed(1) || '0.0'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {deleteConfirm === resep.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(resep.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Ya, Hapus
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(resep)}
                              className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(resep.id)}
                              className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </button>
                          </>
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
        {filteredReseps.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredReseps.length}
          />
        )}      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#B6771D]">
                {modalMode === 'create' ? 'Tambah Resep Baru' : 'Edit Resep'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Judul */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Resep *
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                  placeholder="Contoh: Jamu Beras Kencur"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.kategoriId}
                  onChange={(e) => setFormData({ ...formData, kategoriId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoris.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                  rows={4}
                  placeholder="Jelaskan manfaat dan kegunaan resep ini..."
                  required
                />
              </div>

              {/* Gambar */}
              <div>
                <ImageUpload
                  currentImageUrl={formData.gambarURL}
                  onImageSelected={(base64) => {
                    setImageBase64(base64);
                    setFormData({ ...formData, gambarURL: base64 });
                  }}
                  label="Gambar Resep"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gambar akan diupload ke S3 saat Anda menekan tombol Simpan
                </p>
              </div>

              {/* Bahan-bahan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Bahan-bahan *
                  </label>
                  <button
                    type="button"
                    onClick={addBahanField}
                    className="text-sm text-[#B6771D] hover:underline"
                  >
                    + Tambah Bahan
                  </button>
                </div>
                {formData.bahan.map((bahan, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bahan}
                      onChange={(e) => updateBahanField(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                      placeholder={`Bahan ${index + 1}`}
                    />
                    {formData.bahan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBahanField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Langkah Pembuatan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Langkah Pembuatan *
                  </label>
                  <button
                    type="button"
                    onClick={addLangkahField}
                    className="text-sm text-[#B6771D] hover:underline"
                  >
                    + Tambah Langkah
                  </button>
                </div>
                {formData.langkahPembuatan.map((langkah, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <textarea
                      value={langkah}
                      onChange={(e) => updateLangkahField(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                      placeholder={`Langkah ${index + 1}`}
                      rows={2}
                    />
                    {formData.langkahPembuatan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLangkahField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Sumber Literatur */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sumber Literatur
                </label>
                <input
                  type="text"
                  value={formData.sumberLiteratur}
                  onChange={(e) => setFormData({ ...formData, sumberLiteratur: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B6771D]"
                  placeholder="Contoh: Buku Jamu Tradisional Indonesia, halaman 123"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#B6771D] text-white rounded-lg hover:bg-[#9a6118] disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah Resep' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
