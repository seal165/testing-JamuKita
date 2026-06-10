"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRecentSearches, formatSearchTime, clearRecentSearches, removeRecentSearch } from "@/lib/recentSearch";
import type { RecentSearchItem } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faClock } from "@fortawesome/free-solid-svg-icons";

export default function RecentSearchCarousel() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasLoadedRef = useRef(false);

  const loadRecentSearches = async () => {
    try {
      setLoading(true);
      const searches = await getRecentSearches();
      setRecentSearches(searches);
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadRecentSearches();
    }
  }, []);

  const handleSearchClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRemove = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeRecentSearch(id);
      await loadRecentSearches();
    } catch (error) {
      console.error("Failed to remove search:", error);
    }
  };

  const handleClearAll = async () => {
    if (confirm("Hapus semua riwayat pencarian?")) {
      try {
        await clearRecentSearches();
        setRecentSearches([]);
      } catch (error) {
        console.error("Failed to clear searches:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-20 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-20 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-20 w-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (recentSearches.length === 0) {
    return (
      <div className="text-center py-8">
        <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-4xl mb-3" />
        <p className="text-gray-500 text-sm">Belum ada riwayat pencarian</p>
        <p className="text-gray-400 text-xs mt-1">Mulai cari resep jamu favorit Anda</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#29372a] flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-[#B6771D]" />
          Pencarian Terakhir
        </h3>
        {recentSearches.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div className="flex gap-3 w-max">
        {recentSearches.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSearchClick(item.query)}
            className="group relative min-w-[180px] bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-[#B6771D] transition cursor-pointer"
          >
            {/* Remove button */}
            <button
              onClick={(e) => handleRemove(item.id, e)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-600"
              aria-label="Hapus"
            >
              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
            </button>

            {/* Query */}
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faSearch} className="text-[#B6771D] text-sm" />
              <p className="font-semibold text-sm text-gray-800 truncate flex-1">
                {item.query}
              </p>
            </div>

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatSearchTime(item.createdAt)}</span>
              {item.resultCount !== undefined && (
                <span className="text-[#B6771D] font-medium">
                  {item.resultCount} hasil
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
