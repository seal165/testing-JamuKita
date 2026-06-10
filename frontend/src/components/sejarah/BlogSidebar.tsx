"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { ArtikelPopular } from "@/types";
import { TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BlogSidebar() {
  const [popularArtikel, setPopularArtikel] = useState<ArtikelPopular[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadPopularArtikel();
  }, []);

  const loadPopularArtikel = async () => {
    try {
      const response = await apiService.getPopularArtikel(5);
      if (response.success && response.data) {
        setPopularArtikel(response.data);
      }
    } catch (error) {
      console.error("Error loading popular artikel:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sejarah?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-[#8B4513] mb-4 flex items-center gap-2">
          <Search size={20} />
          Cari Artikel
        </h3>
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Popular Articles */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-[#8B4513] mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Artikel Populer
        </h3>

        {popularArtikel.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada artikel populer</p>
        ) : (
          <div className="space-y-4">
            {popularArtikel.map((artikel, index) => (
              <Link
                href={`/sejarah/${artikel.id}`}
                key={artikel.id}
                className="flex gap-3 group hover:bg-[#FFFBEA] p-2 rounded-lg transition-colors"
              >
                {/* Number Badge */}
                <div className="flex-shrink-0 w-8 h-8 bg-[#8B4513] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#8B4513] group-hover:text-[#6d3410] line-clamp-2 mb-1">
                    {artikel.judul}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatDate(artikel.tanggalPublikasi)}</span>
                    <span>👁️ {artikel.views}</span>
                  </div>
                </div>

                {/* Thumbnail */}
                {artikel.gambarURL && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={artikel.gambarURL}
                      alt={artikel.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-[#8B4513] mb-4">Kategori</h3>
        <div className="space-y-2">
          {[
            "Sejarah",
            "Kesehatan",
            "Tradisi",
            "Tips & Trik",
            "Berita",
          ].map((kategori) => (
            <Link
              href={`/sejarah?kategori=${kategori}`}
              key={kategori}
              className="block px-4 py-2 rounded-lg hover:bg-[#FFFBEA] text-gray-700 hover:text-[#8B4513] transition-colors"
            >
              {kategori}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
