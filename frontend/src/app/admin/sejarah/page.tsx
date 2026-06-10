'use client';

import Image from 'next/image';
import { useState } from 'react';

// ==========================
// TYPE DEFINITIONS
// ==========================

interface Article {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  gambar: string | null;
}

interface FormType {
  judul: string;
  deskripsi: string;
  tanggal: string;
  gambar: File | null;
}

// ==========================
// COMPONENT
// ==========================

export default function SejarahPage() {
  const [articles, setArticles] = useState<Article[]>([
    { 
      id: 1, 
      judul: 'Sejarah Jamu Indonesia', 
      deskripsi: 'Jamu telah menjadi bagian dari budaya Indonesia selama berabad-abad',
      tanggal: '2024-01-15', 
      gambar: null
    },
    { 
      id: 2, 
      judul: 'Perkembangan Jamu Modern', 
      deskripsi: 'Modernisasi jamu dengan teknologi dan penelitian ilmiah',
      tanggal: '2024-01-10', 
      gambar: null
    },
  ]);

  // Modal popup
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form
  const [formData, setFormData] = useState<FormType>({
    judul: '',
    deskripsi: '',
    tanggal: '',
    gambar: null,
  });

  // ==========================
  // MODAL HANDLER
  // ==========================

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      judul: '',
      deskripsi: '',
      tanggal: '',
      gambar: null,
    });
    setPreviewImage(null);
  };

  const handleOpenEditModal = (article: Article) => {
    setIsEditMode(true);
    setEditId(article.id);
    setFormData({
      judul: article.judul,
      deskripsi: article.deskripsi,
      tanggal: article.tanggal,
      gambar: null,
    });
    setPreviewImage(article.gambar);
    setIsModalOpen(true);
  };

  // ==========================
  // FORM HANDLER
  // ==========================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFormData(prev => ({ ...prev, gambar: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editId !== null) {
      setArticles(prev => prev.map(article => 
        article.id === editId 
          ? {
              ...article,
              judul: formData.judul,
              deskripsi: formData.deskripsi,
              tanggal: formData.tanggal,
              gambar: previewImage,
            }
          : article
      ));
      alert('Artikel berhasil diupdate!');
    } else {
      const newArticle: Article = {
        id: articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        tanggal: formData.tanggal,
        gambar: previewImage,
      };
      
      setArticles(prev => [...prev, newArticle]);
      alert('Artikel berhasil ditambahkan!');
    }

    handleCloseModal();
  };

  // ==========================
  // DELETE HANDLER
  // ==========================

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus artikel ini?');
    
    if (confirmDelete) {
      setArticles(prev => prev.filter(article => article.id !== id));
      alert('Artikel berhasil dihapus!');
    }
  };

  // ==========================
  // RENDER PAGE
  // ==========================

  return (
    <div className="space-y-6">

      {/* HEADER IMAGE */}
      <div className="w-full h-32 rounded-2xl overflow-hidden">
        <Image 
          src="/images/header.png"
          alt="Herbs Header"
          width={1200}
          height={0}
          className="w-full h-full object-cover"
        />
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        
        {/* HEADER TITLE + BUTTON */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#B6771D]" style={{fontFamily: 'Inter'}}>
            SEJARAH
          </h1>
          <button 
            onClick={handleOpenModal}
            className="bg-[#B6771D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#8B5A15] transition-colors" 
            style={{fontFamily: 'Inter'}}
          >
            + Tambah Artikel
          </button>
        </div>

        {/* TABLE TANPA STATUS */}
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>ID</th>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>Gambar</th>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>Judul Artikel</th>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>Deskripsi</th>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>Tanggal</th>
              <th className="text-left p-4 font-bold" style={{fontFamily: 'Inter'}}>Aksi</th>
            </tr>
          </thead>
          
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Belum ada artikel. Klik &quot;Tambah Artikel&quot; untuk menambah.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{article.id}</td>
                  <td className="p-4">
                    {article.gambar ? (
                      <Image 
                        src={article.gambar} 
                        alt={article.judul}
                        width={64}
                        height={0}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold">{article.judul}</td>
                  <td className="p-4 max-w-xs truncate">{article.deskripsi}</td>
                  <td className="p-4">{article.tanggal}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleOpenEditModal(article)}
                      className="text-blue-600 hover:underline mr-3 font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ====================== */}
      {/* POPUP MODAL */}
      {/* ====================== */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#B6771D]" style={{fontFamily: 'Inter'}}>
                {isEditMode ? 'Edit Artikel Sejarah' : 'Tambah Artikel Sejarah'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* UPLOAD GAMBAR */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700" style={{fontFamily: 'Inter'}}>
                  Upload Gambar
                </label>
                <div className="border-2 border-dashed border-[#B6771D] rounded-xl p-6 text-center">
                  
                  {previewImage ? (
                    <div className="space-y-3">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={400}
                        height={0}
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData(prev => ({ ...prev, gambar: null }));
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="gambar-upload"
                        className="hidden"
                      />
                      <label 
                        htmlFor="gambar-upload"
                        className="cursor-pointer text-[#B6771D] hover:text-[#8B5A15] font-semibold"
                      >
                        Klik untuk upload gambar
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG hingga 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* JUDUL */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700" style={{fontFamily: 'Inter'}}>
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  required
                  placeholder="Masukkan judul artikel"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none"
                  style={{fontFamily: 'Inter'}}
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700" style={{fontFamily: 'Inter'}}>
                  Deskripsi *
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Masukkan deskripsi artikel"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none resize-none"
                  style={{fontFamily: 'Inter'}}
                />
              </div>

              {/* TANGGAL */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700" style={{fontFamily: 'Inter'}}>
                  Tanggal Upload *
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#B6771D] focus:outline-none"
                  style={{fontFamily: 'Inter'}}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  style={{fontFamily: 'Inter'}}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#B6771D] text-white rounded-lg font-bold hover:bg-[#8B5A15] transition-colors"
                  style={{fontFamily: 'Inter'}}
                >
                  {isEditMode ? 'Update Artikel' : 'Simpan Artikel'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
