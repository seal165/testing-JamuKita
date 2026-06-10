"use client";

import Image from "next/image";
import { useState } from "react";
import type { Resep } from "@/types";

interface SavedListProps {
  favorites: Resep[];
}

export default function SavedList({ favorites }: SavedListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeJamu, setActiveJamu] = useState<Resep | null>(null);

  const openPopup = (jamu: Resep) => {
    setActiveJamu(jamu);
    setIsOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tersimpan</h2>

      <div className="space-y-4">
        {favorites.length === 0 && (
          <p className="text-sm text-gray-600">Belum ada resep tersimpan.</p>
        )}
        {favorites.map((jamu) => (
          <div
            key={jamu.id}
            className="flex items-center gap-4 p-3 border rounded-xl hover:bg-green-50 cursor-pointer"
            onClick={() => openPopup(jamu)}
          >
            <Image
              src={jamu.gambarURL || "/images/jamu1.jpg"}
              width={60}
              height={60}
              className="rounded-lg object-cover"
              alt={jamu.judul}
            />
            <div>
              <p className="font-medium">{jamu.judul}</p>
              <p className="text-xs text-gray-500">{jamu.kategori?.nama}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Detail */}
      {isOpen && activeJamu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-lg p-6 mt-20">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-black text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{activeJamu.judul}</h2>
            <Image
              src={activeJamu.gambarURL || "/images/jamu1.jpg"}
              width={500}
              height={250}
              className="w-full h-64 object-cover rounded-lg mb-4"
              alt={activeJamu.judul}
            />
            <p className="text-sm text-gray-600">{activeJamu.kategori?.nama}</p>
            <p className="text-lg leading-8 mt-3">{activeJamu.deskripsi}</p>
          </div>
        </div>
      )}
    </div>
  );
}
