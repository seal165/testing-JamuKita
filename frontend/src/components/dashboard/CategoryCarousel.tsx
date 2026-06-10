"use client";

import { useState } from "react";
import {
  Leaf,
  HeartPulse,
  LucideHouse,
  Apple,
  Sprout,
  Flower,
  CupSoda,
  CookingPot,
} from "lucide-react";

const categories = [
  { id: 0, name: "All", icon: Leaf },
  { id: 1, name: "Kesehatan", icon: HeartPulse },
  { id: 2, name: "Manfaat", icon: Sprout },
  { id: 3, name: "Rumahan", icon: LucideHouse },
  { id: 4, name: "Rempah", icon: CookingPot },
  { id: 5, name: "Buah", icon: Apple },
];

export default function CategoryCarousel({
  onSelect,
}: {
  onSelect?: (cat: string) => void;
}) {
  const [active, setActive] = useState("All");

  const handleSelect = (name: string) => {
    setActive(name);
    onSelect?.(name);
  };

  return (
    <div className="w-60 sticky top-24">
      {/* BOX WRAPPER */}
      <div className="bg-white rounded-2xl shadow-lg border p-5">
        <h2 className="text-lg font-bold mb-4">Kategori</h2>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[65vh] pr-2">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.name)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm
                  transition-all duration-200 w-full text-left
                  ${
                    active === cat.name
                      ? "bg-yellow-600 text-white border-yellow-700 shadow-md scale-[1.03]"
                      : "bg-white hover:bg-yellow-100 border-gray-300"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={
                    active === cat.name ? "text-white" : "text-yellow-700"
                  }
                />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* END BOX */}
    </div>
  );
}
