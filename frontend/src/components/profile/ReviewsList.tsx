"use client";

import type { ActivityCommentsItem } from "@/types";

interface ReviewsListProps {
  comments: ActivityCommentsItem[];
}

export default function ReviewsList({ comments }: ReviewsListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ulasan</h2>

      <div className="space-y-4">
        {comments.length === 0 && <p className="text-sm text-gray-600">Belum ada ulasan.</p>}
        {comments.map((item) => (
          <div key={item.id} className="p-4 border rounded-xl hover:bg-green-50">
            <p className="font-medium">{item.judul} – "{item.isiKomentar}"</p>
            <p className="text-xs text-gray-500">Rating: {item.rating}/5</p>
            <p className="text-sm opacity-60">{new Date(item.tanggalPosting).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
