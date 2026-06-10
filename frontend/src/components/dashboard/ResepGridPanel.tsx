"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import type { Resep, ResepListResponse } from "@/types";
import ResepCard from "./ResepCard";
import { useRouter } from "next/navigation";

interface ResepGridPanelProps {
  kategori?: string;
  limit?: number;
}

export default function ResepGridPanel({ kategori, limit = 20 }: ResepGridPanelProps) {
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchResep();
  }, [kategori, currentPage]);

  const fetchResep = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getResepList({
        kategori: kategori && kategori !== "All" ? kategori : undefined,
        page: currentPage,
        limit,
      });
      
      if (response.success && response.data) {
        setResepList(response.data as any || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.message || "Gagal memuat resep");
      }
    } catch (err) {
      console.error("[ResepGridPanel] Error fetching resep:", err);
      setError("Terjadi kesalahan saat memuat resep");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResepClick = (resepId: string) => {
    router.push(`/resep/${resepId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#4C763B] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat resep...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchResep}
          className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (resepList.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <span className="text-6xl">🍵</span>
        <p className="mt-4 text-gray-600">Belum ada resep tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resepList.map((resep) => (
          <ResepCard
            key={resep.id}
            resep={resep}
            onClick={() => handleResepClick(resep.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full bg-[#4C763B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
          >
            Sebelumnya
          </button>
          
          <span className="px-4 text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full bg-[#4C763B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
