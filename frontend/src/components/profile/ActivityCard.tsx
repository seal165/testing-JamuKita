"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHistory, FaChevronRight } from "react-icons/fa";
import type { ActivityHistory } from "@/types";

interface ActivityCardProps {
  activity: ActivityHistory;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();

  const handleNavigateToResep = (resepId: string) => {
    router.push(`/resep/${resepId}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex flex-col text-start">
        <h2 className="text-3xl font-bold mt-2 flex items-center gap-2 text-green-800">
          <FaHistory className="text-2xl" /> Activity
        </h2>
        <p className="text-sm opacity-60 mt-1">Riwayat aktivitas Anda</p>

        <div className="mt-8 w-full space-y-4">
          {activity.favorites.length === 0 && activity.comments.length === 0 && (
            <p className="text-sm text-gray-600">Belum ada aktivitas.</p>
          )}

          {activity.favorites.map((fav) => (
            <button
              key={`fav-${fav.id}`}
              onClick={() => handleNavigateToResep(fav.id)}
              className="w-full flex items-center justify-between border border-green-700 rounded-xl py-4 px-4 font-medium hover:bg-green-50 transition text-sm"
            >
              <span className="flex items-center gap-4">
                <Image
                  src={fav.gambarURL || "/images/jamu1.jpg"}
                  width={55}
                  height={55}
                  className="rounded-lg object-cover"
                  alt="jamu-item"
                />
                {fav.judul} – Favorit
              </span>
              <FaChevronRight />
            </button>
          ))}

          {activity.comments.map((comment) => (
            <button
              key={`comment-${comment.id}`}
              onClick={() => handleNavigateToResep(comment.resepId)}
              className="w-full flex items-center justify-between border border-green-700 rounded-xl py-4 px-4 font-medium hover:bg-green-50 transition text-sm"
            >
              <span className="flex items-center gap-4">
                <Image
                  src="/images/jamu2.jpg"
                  width={55}
                  height={55}
                  className="rounded-lg object-cover"
                  alt="jamu-item"
                />
                {comment.judul} – Ulasan {comment.rating}/5
              </span>
              <FaChevronRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
