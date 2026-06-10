"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import JamuCard from "@/components/dashboard/JamuCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { saveRecentSearch } from "@/lib/recentSearch";
import { apiService } from "@/lib/api";
import { useAnalytics } from "@/hooks/useAnalytics";
import { trackSearch } from "@/lib/gtag";
import type { Resep, Kategori } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";

interface SearchFilters {
  kategoriId?: string;
  minRating?: string;
  sortBy?: "createdAt" | "rating" | "judul" | string | undefined;
  sortOrder?: "asc" | "desc" | string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { trackEvent } = useAnalytics();
  const query = searchParams.get("q") || "";
  const savedSearchRef = useRef<string>("");
  const isSearching = useRef(false);
  
  const [results, setResults] = useState<Resep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Redirect ke login jika belum login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load kategori list
  useEffect(() => {
    const loadKategori = async () => {
      try {
        const response = await apiService.getKategoriList();
        if (response.success && response.data) {
          setKategoriList(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    if (isAuthenticated) {
      loadKategori();
    }
  }, [isAuthenticated]);

  // Perform search
  useEffect(() => {
    if (!query || !isAuthenticated || isLoading) return;

    const searchKey = `${query}-${JSON.stringify(filters)}`;
    
    // Prevent duplicate searches
    if (savedSearchRef.current === searchKey || isSearching.current) {
      return;
    }

    const performSearch = async () => {
      try {
        isSearching.current = true;
        setLoading(true);
        setError(null);

        // Call backend search API
        const response = await apiService.searchResep({
          keyword: query,
          kategoriId: filters.kategoriId,
          minRating: filters.minRating,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: 1,
          limit: 50,
        });

        if (response.success && response.data) {
          savedSearchRef.current = searchKey;
          const ResultsCount = response.data.length;
          
          setResults(response.data);
          
          // Save to recent search and track analytics in background
          try {
            await saveRecentSearch(query, ResultsCount);
            // Track search with GTAG
            trackSearch(query, ResultsCount);
            // Track search with backend analytics
            trackEvent('search', {
              query,
              resultCount: ResultsCount,
              filters,
            });
          } catch (err) {
            console.error("Failed to save recent search:", err);
          }
        } else {
          throw new Error(response.message || "Gagal melakukan pencarian");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mencari");
        setResults([]);
      } finally {
        setLoading(false);
        isSearching.current = false;
      }
    };

    performSearch();
  }, [query, filters, isAuthenticated, isLoading]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = filters.kategoriId || filters.minRating;

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B6771D] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#29372a] mb-2">
          Hasil Pencarian: <span className="text-[#B6771D]">&quot;{query}&quot;</span>
        </h2>
        <p className="text-gray-600">
          {loading ? "Mencari resep jamu..." : `${results.length} resep ditemukan`}
        </p>
      </div>

      {/* Filter Toggle & Info */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <FontAwesomeIcon icon={faFilter} className="text-[#B6771D]" />
          <span className="font-medium">Filter & Urutkan</span>
          {hasActiveFilters && (
            <span className="bg-[#B6771D] text-white text-xs px-2 py-0.5 rounded-full">
              {(filters.kategoriId ? 1 : 0) + (filters.minRating ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span className="text-sm font-medium">Reset Filter</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kategori Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📁 Kategori
              </label>
              <select
                value={filters.kategoriId || ""}
                onChange={(e) =>
                  handleFilterChange({
                    kategoriId: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6771D] bg-white"
              >
                <option value="">Semua Kategori</option>
                {kategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⭐ Rating Minimal
              </label>
              <select
                value={filters.minRating || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minRating: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6771D] bg-white"
              >
                <option value="">Semua Rating</option>
                <option value="4.5">⭐ 4.5 ke atas</option>
                <option value="4.0">⭐ 4.0 ke atas</option>
                <option value="3.5">⭐ 3.5 ke atas</option>
                <option value="3.0">⭐ 3.0 ke atas</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔄 Urutkan Berdasarkan
              </label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  handleFilterChange({
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6771D] bg-white"
              >
                <option value="createdAt-desc">🆕 Terbaru</option>
                <option value="createdAt-asc">🕐 Terlama</option>
                <option value="rating-desc">⭐ Rating Tertinggi</option>
                <option value="rating-asc">⭐ Rating Terendah</option>
                <option value="judul-asc">🔤 Nama A-Z</option>
                <option value="judul-desc">🔤 Nama Z-A</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {results.map((resep, index) => (
            <JamuCard
              key={resep.id}
              index={index}
              id={resep.id}
              title={resep.judul}
              img={resep.gambarURL || "/img/jamu-default.jpg"}
              rating={resep.rataRataRating}
              benefits={[resep.deskripsi]}
              ingredients={[]}
              steps={[]}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-16 bg-gradient-to-b from-yellow-50 to-white rounded-lg border border-yellow-200">
          <div className="text-7xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Tidak Ada Hasil Ditemukan
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Tidak ada resep jamu yang cocok dengan kata kunci <strong>&quot;{query}&quot;</strong>
            {hasActiveFilters && " dan filter yang dipilih"}
          </p>
          
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto border border-gray-200">
            <p className="font-semibold text-gray-800 mb-3">💡 Tips Pencarian:</p>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#B6771D] font-bold">•</span>
                <span>Coba kata kunci yang lebih umum (misalnya: &quot;kunyit&quot; bukan &quot;kunyit asem&quot;)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B6771D] font-bold">•</span>
                <span>Periksa ejaan kata kunci Anda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B6771D] font-bold">•</span>
                <span>Gunakan sinonim atau kata lain yang relevan</span>
              </li>
              {hasActiveFilters && (
                <li className="flex items-start gap-2">
                  <span className="text-[#B6771D] font-bold">•</span>
                  <span>Coba hapus beberapa filter untuk hasil lebih luas</span>
                </li>
              )}
            </ul>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-3 bg-[#B6771D] text-white rounded-lg hover:bg-[#945d15] transition font-semibold"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#FFFBEA]">
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B6771D] mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Memuat hasil pencarian...</p>
              </div>
            }
          >
            <SearchContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
