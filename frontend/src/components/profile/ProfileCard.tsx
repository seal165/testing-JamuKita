"use client";

import Image from "next/image";

interface ProfileCardProps {
  activeTab: string;
  setActiveTab: (tab: "saved" | "reviews") => void;
  user: { nama: string; email?: string; role?: string; id?: number } | null;
  savedCount: number;
  reviewsCount: number;
  isViewingOther?: boolean;
  isAuthenticatedUser?: boolean;
  onReportClick?: () => void;
}

export default function ProfileCard({
  activeTab,
  setActiveTab,
  user,
  savedCount,
  reviewsCount,
  isViewingOther = false,
  isAuthenticatedUser = false,
  onReportClick,
}: ProfileCardProps) {
  return (
    <div className="w-full md:w-[350px] bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <Image
          src={`https://picsum.photos/seed/${
            (user?.id + user!.nama + user!.role) || "default"
          }/120/120`}
          width={120}
          height={120}
          className="rounded-full object-cover w-20 h-20 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px]"
          alt="User profile"
        />

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-3 sm:mt-4">
          {user?.nama || "Pengguna"}
        </h2>
        {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
        {isViewingOther && user?.role && (
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {user.role === "admin" ? "Admin" : "Anggota"}
          </span>
        )}

        <div className="mt-4 sm:mt-6 w-full space-y-2 sm:space-y-3">
          <button
            onClick={() => setActiveTab("saved")}
            className={`w-full border border-green-700 rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition ${
              activeTab === "saved"
                ? "bg-green-700 text-white"
                : "hover:bg-green-50"
            }`}
          >
            Tersimpan ({savedCount})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full border border-green-700 rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition ${
              activeTab === "reviews"
                ? "bg-green-700 text-white"
                : "hover:bg-green-50"
            }`}
          >
            Ulasan ({reviewsCount})
          </button>

          {isViewingOther && user?.role !== "admin" && isAuthenticatedUser && (
            <button
              onClick={onReportClick}
              className="w-full border border-red-600 text-red-600 rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition hover:bg-red-50"
            >
              🚨 Laporkan Pengguna
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
