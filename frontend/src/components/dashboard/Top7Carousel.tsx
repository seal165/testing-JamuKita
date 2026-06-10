"use client";

import { useEffect, useState } from "react";
import JamuCard from "./JamuCard";
import { apiService } from "@/lib/api";
import type { Resep } from "@/types";

export default function Top7Carousel() {
  const [data, setData] = useState<Resep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop7 = async () => {
      try {
        setLoading(true);
        const result = await apiService.getTop7Weekly();
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (err) {
        console.error("Error fetching top 7 recipes:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchTop7();
  }, []);

  if (loading) {
    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 w-max">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-48 h-48 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-blue-600 underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada resep populer minggu ini</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 w-max">
        {data.map((item, i) => (
          <JamuCard
            key={item.id}
            index={i}
            id={item.id}
            title={item.judul}
            img={item.gambarURL || "/img/jamu-default.jpg"}
            rating={item.rataRataRating}
            benefits={[item.deskripsi]}
            ingredients={item.bahan || []}
            steps={item.langkahPembuatan || []}
          />
        ))}
      </div>
    </div>
  );
}
