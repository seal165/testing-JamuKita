"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Artikel } from "@/types";
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ArtikelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtikel = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getArtikelById(Number(params.id));
        if (response.success && response.data) {
          setArtikel(response.data);
        } else {
          setError("Artikel tidak ditemukan");
        }
      } catch (err) {
        console.error("Error loading artikel:", err);
        setError("Gagal memuat artikel");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadArtikel();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBEA] pt-24 px-8">
        <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
        </div>
      </div>
    );
  }

  if (error || !artikel) {
    return (
      <div className="min-h-screen bg-[#FFFBEA] pt-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error || "Artikel tidak ditemukan"}</p>
            <button
              onClick={() => router.push("/sejarah")}
              className="px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition-colors"
            >
              Kembali ke Daftar Artikel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEA] pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/sejarah"
          className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#6d3410] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Artikel</span>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {artikel.gambarURL && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <Image
                src={artikel.gambarURL}
                alt={artikel.judul}
                width={800}
                height={0}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-10">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 bg-[#8B4513] text-white text-sm px-4 py-2 rounded-full">
                <Tag size={16} />
                {artikel.kategori}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-4 leading-tight">
              {artikel.judul}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#8B4513]" />
                <span className="font-semibold">{artikel.penulis}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#8B4513]" />
                <span>{formatDate(artikel.tanggalPublikasi)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-[#8B4513]" />
                <span>{artikel.views} views</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: artikel.konten
                    .replace(/\n/g, "<br />")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>Terakhir diperbarui:</p>
                  <p className="font-semibold">{formatDate(artikel.updatedAt)}</p>
                </div>
                <button
                  onClick={() => router.push("/sejarah")}
                  className="px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition-colors font-semibold"
                >
                  Lihat Artikel Lainnya
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Share Section (Optional) */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#8B4513] mb-3">Bagikan Artikel Ini</h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                alert("Link artikel berhasil disalin!");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
            >
              📋 Salin Link
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `Baca artikel: ${artikel.judul}`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
                  "_blank"
                );
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `Baca artikel: ${artikel.judul}`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    text
                  )}&url=${encodeURIComponent(url)}`,
                  "_blank"
                );
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              🐦 Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
