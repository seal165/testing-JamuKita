"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileCard from "@/components/profile/ProfileCard";
import ActivityCard from "@/components/profile/ActivityCard";
import AccountSettings from "@/components/profile/AccountSettings";
import SavedList from "@/components/profile/SavedList";
import ReviewsList from "@/components/profile/ReviewsList";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import type { ActivityHistory, Resep, PublicProfileData} from "@/types";
import { adminApiService } from "@/lib/adminApi";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user, refreshProfile } = useAuth();

  // Ambil UUID dari query parameter
  const uuid = searchParams.get("u");

  // Tab kanan atas: activity / settings
  const [activeTab, setActiveTab] = useState<"activity" | "settings">(
    "activity"
  );

  // Tab kiri: saved / reviews
  const [leftTab, setLeftTab] = useState<"saved" | "reviews" | null>(null);

  const [favorites, setFavorites] = useState<Resep[]>([]);
  const [activity, setActivity] = useState<ActivityHistory>({
    favorites: [],
    comments: [],
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isViewingOtherProfile, setIsViewingOtherProfile] = useState(false);
  const [publicProfileData, setPublicProfileData] =
    useState<PublicProfileData | null>(null);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const hasLoadAnotherUserProfile = useRef(false);

  // Proteksi halaman - redirect ke login jika melihat profil sendiri (tanpa UUID) dan tidak terautentikasi
  useEffect(() => {
    if (!isLoading && !uuid && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, uuid, router]);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsDataLoading(true);
      setError(null);

      try {
        // Jika ada UUID, load profil user lain (public)
        if (uuid) {
          hasLoadAnotherUserProfile.current = true;
          setIsViewingOtherProfile(true);
          const response = await apiService.getPublicProfile(parseInt(uuid));

          if (response.success && response.data) {
            setPublicProfileData(response.data);
            // Convert to existing state format for compatibility
            setActivity({
              favorites: response.data.activity.favorites,
              comments: response.data.activity.comments,
            });
            // Convert favorites to Resep format
            const favoritesAsResep = response.data.activity.favorites.map(
              (fav) => ({
                id: fav.id,
                judul: fav.judul,
                deskripsi: fav.deskripsi,
                kategori: fav.kategori,
                gambarURL: fav.gambarURL,
                rataRataRating: 0, // Not available in public view
                bahan: [],
                langkahPembuatan: [],
                sumberLiteratur: null,
              })
            );
            setFavorites(favoritesAsResep);
          } else {
            setError(response.message || "Profil tidak ditemukan");
          }
        } else if (isAuthenticated) {
          // Load profil sendiri
          setIsViewingOtherProfile(false);
          const [favRes, activityRes] = await Promise.all([
            apiService.getFavorites(),
            apiService.getActivityHistory(),
          ]);

          if (favRes.success && favRes.data) {
            setFavorites(favRes.data);
          } else {
            setError(favRes.message || "Gagal memuat favorit");
          }

          if (activityRes.success && activityRes.data) {
            setActivity(activityRes.data);
          } else {
            setError(activityRes.message || "Gagal memuat aktivitas");
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Terjadi kesalahan saat memuat profil");
      } finally {
        setIsDataLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated, uuid]);

  const handleReportUser = async () => {
    if (!reportReason.trim() || reportReason.length < 10) {
      alert("Alasan laporan minimal 10 karakter");
      return;
    }

    if (!publicProfileData?.user.id) return;

    try {
      setIsSubmittingReport(true);
      const response = await adminApiService.createReport({
        reportedUserId: publicProfileData.user.id,
        reason: reportReason,
      });

      if (response.success) {
        alert("Laporan berhasil dikirim. Terima kasih atas laporan Anda.");
        setShowReportModal(false);
        setReportReason("");
      } else {
        throw new Error(response.message || "Gagal mengirim laporan");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error submitting report:", err);
      alert(err.message || "Terjadi kesalahan saat mengirim laporan");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Tampilkan loading saat mengecek autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B6771D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jangan render konten jika melihat profil sendiri tanpa login
  if (!uuid && !isAuthenticated) {
    return null;
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B6771D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-6 py-2.5 bg-[#B6771D] text-white rounded-lg hover:bg-[#9a6118] transition-colors duration-200"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* LEFT – PROFILE NAVIGATION */}
          <div className="w-full md:w-[35%] lg:w-[30%]">
            <ProfileCard
              activeTab={leftTab ?? ""}
              setActiveTab={setLeftTab}
              user={
                isViewingOtherProfile && publicProfileData
                  ? publicProfileData.user
                  : user
              }
              savedCount={favorites.length}
              reviewsCount={activity.comments.length}
              isViewingOther={isViewingOtherProfile}
              isAuthenticatedUser={isAuthenticated}
              onReportClick={() => setShowReportModal(true)}
            />
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* Top Right Tabs - hanya tampilkan jika bukan viewing other profile */}
            {!isViewingOtherProfile && (
              <ProfileTabs
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setLeftTab(null);
                }}
              />
            )}

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl min-h-[400px] sm:min-h-[500px] mt-4 sm:mt-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {/* Prioritas content: kiri > kanan */}
              {leftTab === "saved" && <SavedList favorites={favorites} />}
              {leftTab === "reviews" && (
                <ReviewsList comments={activity.comments} />
              )}
              {!leftTab &&
                !isViewingOtherProfile &&
                activeTab === "activity" && (
                  <ActivityCard activity={activity} />
                )}
              {!leftTab &&
                !isViewingOtherProfile &&
                activeTab === "settings" && (
                  <AccountSettings
                    user={user}
                    onProfileUpdate={refreshProfile}
                  />
                )}
              {!leftTab && isViewingOtherProfile && (
                <ActivityCard activity={activity} />
              )}
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-600 mb-4">Laporkan Pengguna</h3>
              <p className="text-sm text-gray-600 mb-4">
                Anda melaporkan: <strong>{publicProfileData?.user.nama}</strong>
              </p>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alasan Laporan *
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="Jelaskan alasan Anda melaporkan pengguna ini (minimal 10 karakter)"
                minLength={10}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 mb-4">
                {reportReason.length}/500 karakter
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReportUser}
                  disabled={isSubmittingReport || reportReason.length < 10}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isSubmittingReport ? "Mengirim..." : "Kirim Laporan"}
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason("");
                  }}
                  disabled={isSubmittingReport}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B6771D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
