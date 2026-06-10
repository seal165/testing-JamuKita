"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import Image from "next/image";
import { Artikel, CreateArtikelData, UpdateArtikelData } from "@/types";
import { Plus, Edit2, Trash2, Eye, Calendar, User, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 20;

export default function AdminArtikelPage() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [filteredArtikel, setFilteredArtikel] = useState<Artikel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState<Artikel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CreateArtikelData>({
    judul: "",
    konten: "",
    gambarURL: "",
    kategori: "Sejarah",
    penulis: "",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
      return;
    }
    loadArtikel();
  }, [isAuthenticated, user, router]);

  const loadArtikel = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllArtikel({ limit: 100 });
      if (response.success && response.data) {
        setArtikelList(response.data);
      }
    } catch (error) {
      console.error("Error loading artikel:", error);
      alert("Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filterArtikel = () => {
      let filtered = [...artikelList];

      if (searchQuery) {
        filtered = filtered.filter(
          (a) =>
            a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.penulis.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedKategori) {
        filtered = filtered.filter((a) => a.kategori === selectedKategori);
      }

      setFilteredArtikel(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    };
    filterArtikel();
  }, [searchQuery, selectedKategori, artikelList]);

  const handleOpenModal = (artikel?: Artikel) => {
    if (artikel) {
      setEditingArtikel(artikel);
      setFormData({
        judul: artikel.judul,
        konten: artikel.konten,
        gambarURL: artikel.gambarURL || "",
        kategori: artikel.kategori,
        penulis: artikel.penulis,
      });
      setImageBase64(""); // Reset base64 for edit
    } else {
      setEditingArtikel(null);
      setFormData({
        judul: "",
        konten: "",
        gambarURL: "",
        kategori: "Sejarah",
        penulis: "",
      });
      setImageBase64("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArtikel(null);
    setImageBase64("");
    setFormData({
      judul: "",
      konten: "",
      gambarURL: "",
      kategori: "Sejarah",
      penulis: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.gambarURL;

      // Upload image to S3 if new image selected
      if (imageBase64 && imageBase64.startsWith("data:")) {
        try {
          const uploadResponse = await apiService.uploadImage({
            image: imageBase64,
            folder: "artikel",
          });

          if (uploadResponse.success && uploadResponse.data?.url) {
            finalImageUrl = uploadResponse.data.url;
          } else {
            throw new Error("Gagal upload gambar");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (uploadError: any) {
          alert(`Gagal upload gambar: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Submit artikel with final image URL
      const submitData = {
        ...formData,
        gambarURL: finalImageUrl,
      };

      if (editingArtikel) {
        // Update
        const response = await apiService.updateArtikel(
          editingArtikel.id,
          submitData as UpdateArtikelData
        );
        if (response.success) {
          alert("Artikel berhasil diperbarui");
          loadArtikel();
          handleCloseModal();
        } else {
          throw new Error(response.message);
        }
      } else {
        // Create
        const response = await apiService.createArtikel(submitData);
        if (response.success) {
          alert("Artikel berhasil dibuat");
          loadArtikel();
          handleCloseModal();
        } else {
          throw new Error(response.message);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting artikel:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      const response = await apiService.deleteArtikel(id);
      if (response.success) {
        alert("Artikel berhasil dihapus");
        loadArtikel();
      } else {
        throw new Error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting artikel:", error);
      alert(error.message || "Terjadi kesalahan saat menghapus artikel");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Artikel</h1>
              <p className="text-gray-600 mt-1">Kelola artikel dan blog Jamu Kita</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition-colors"
            >
              <Plus size={20} />
              Tambah Artikel
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              />
            </div>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            >
              <option value="">Semua Kategori</option>
              <option value="Sejarah">Sejarah</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Tradisi">Tradisi</option>
              <option value="Tips">Tips & Trik</option>
              <option value="Berita">Berita</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Artikel</h3>
            <p className="text-3xl font-bold text-[#8B4513]">{artikelList.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-[#8B4513]">
              {artikelList.reduce((sum, a) => sum + a.views, 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Artikel Terfilter</h3>
            <p className="text-3xl font-bold text-[#8B4513]">{filteredArtikel.length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
            </div>
          ) : filteredArtikel.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Tidak ada artikel ditemukan</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Artikel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Penulis
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredArtikel
                      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                      .map((artikel) => (
                        <tr key={artikel.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {artikel.gambarURL && (
                                <Image
                                  src={artikel.gambarURL}
                                  alt={artikel.judul}
                                  width={64}
                                  height={0}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div className="max-w-md">
                                <p className="font-semibold text-gray-900 line-clamp-1">
                                  {artikel.judul}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {artikel.konten.replace(/<[^>]*>/g, "").substring(0, 100)}
                                  ...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-[#8B4513] text-white text-xs rounded-full">
                              {artikel.kategori}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              {artikel.penulis}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(artikel.tanggalPublikasi)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              {artikel.views}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenModal(artikel)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(artikel.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredArtikel.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredArtikel.length}
              />
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingArtikel ? "Edit Artikel" : "Tambah Artikel Baru"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  required
                  minLength={5}
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Konten *</label>
                <textarea
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  rows={10}
                  required
                  minLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 50 karakter</p>
              </div>

              <div>
                <ImageUpload
                  currentImageUrl={formData.gambarURL}
                  onImageSelected={(base64) => {
                    setImageBase64(base64);
                    setFormData({ ...formData, gambarURL: base64 });
                  }}
                  label="Gambar Artikel"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gambar akan diupload ke S3 saat Anda menekan tombol Simpan
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    required
                  >
                    <option value="Sejarah">Sejarah</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Tradisi">Tradisi</option>
                    <option value="Tips">Tips & Trik</option>
                    <option value="Berita">Berita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penulis *
                  </label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingArtikel
                    ? "Perbarui Artikel"
                    : "Simpan Artikel"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
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
