"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Artikel } from "@/types";
import { Eye, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function SejarahContent() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtikel();
  }, [selectedKategori, currentPage]);

  const loadArtikel = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllArtikel({
        kategori: selectedKategori || undefined,
        page: currentPage,
        limit: 6,
        sortBy: "tanggalPublikasi",
        order: "desc",
      });

      if (response.success && response.data) {
        setArtikelList(response.data);
        if ((response as any).pagination) {
          setTotalPages((response as any).pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Error loading artikel:", error);
    } finally {
      setIsLoading(false);
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#8B4513] mb-8">
        Artikel & Blog Jamu
      </h1>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedKategori}
          onChange={(e) => {
            setSelectedKategori(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
        >
          <option value="">Semua Kategori</option>
          <option value="Sejarah">Sejarah</option>
          <option value="Kesehatan">Kesehatan</option>
          <option value="Tradisi">Tradisi</option>
          <option value="Tips">Tips & Trik</option>
          <option value="Berita">Berita</option>
        </select>
      </div>

      {/* Articles Grid */}
      {artikelList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Belum ada artikel tersedia
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artikelList.map((artikel) => (
              <Link
                href={`/sejarah/${artikel.id}`}
                key={artikel.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                {artikel.gambarURL && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={artikel.gambarURL}
                      alt={artikel.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block bg-[#8B4513] text-white text-xs px-3 py-1 rounded-full mb-3">
                    {artikel.kategori}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-[#8B4513] mb-3 line-clamp-2">
                    {artikel.judul}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateText(artikel.konten.replace(/<[^>]*>/g, ""), 150)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{artikel.penulis}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(artikel.tanggalPublikasi)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{artikel.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-[#8B4513] text-[#8B4513] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8B4513] hover:text-white transition-colors"
              >
                Sebelumnya
              </button>

              <span className="px-4 py-2 bg-[#8B4513] text-white rounded-lg">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-[#8B4513] text-[#8B4513] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8B4513] hover:text-white transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
