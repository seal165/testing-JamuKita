"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { Resep } from "@/types";

interface ResepCardProps {
  resep: Resep;
  onClick?: () => void;
}

export default function ResepCard({ resep, onClick }: ResepCardProps) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {resep.gambarURL ? (
          <Image
            src={resep.gambarURL}
            alt={resep.judul}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
            <span className="text-4xl">🍵</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#4C763B] backdrop-blur-sm">
          {resep.kategori.nama}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-bold text-[#2f3e2a] min-h-[3rem]">
          {resep.judul}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 min-h-[2.5rem]">
          {resep.deskripsi}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-700">
            {resep.rataRataRating > 0 ? resep.rataRataRating.toFixed(1) : "N/A"}
          </span>
          <span className="text-xs text-gray-500">
            ({resep.rataRataRating > 0 ? "rated" : "no ratings"})
          </span>
        </div>
      </div>
    </div>
  );
}
