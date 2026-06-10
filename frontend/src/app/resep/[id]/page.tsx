"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiService } from "@/lib/api";
import type { Resep, Komentar, CreateKomentarData } from "@/types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnalytics } from "@/hooks/useAnalytics";
import { trackRecipeView, trackComment } from "@/lib/gtag";
import { faStar, faArrowLeft, faBook, faComment, faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";

export default function ResepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [resep, setResep] = useState<Resep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [komentars, setKomentars] = useState<Komentar[]>([]);
  const [isLoadingKomentar, setIsLoadingKomentar] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userKomentar, setUserKomentar] = useState<Komentar | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [commentFormData, setCommentFormData] = useState<CreateKomentarData>({
    isiKomentar: '',
    rating: 0,
  });
  const hasLoaded = useRef(false);
  const hasTrackedView = useRef(false);

  const dontTrack = useSearchParams().get("dontTrack") === "true";

  const fetchResepDetail = async (id: string) => {
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getResepDetail(id);

      if (response.success && response.data) {
        setResep(response.data);
        // Track recipe view
        if (!hasTrackedView.current || dontTrack === false) {
          hasTrackedView.current = true;
          trackRecipeView(response.data.id, response.data.judul);
          await trackEvent('recipe_view', {
            recipeId: response.data.id,
            recipeTitle: response.data.judul,
            kategori: response.data.kategori?.nama,
          });
        }
      } else {
        setError(response.message || "Resep tidak ditemukan");
      }
    } catch (err) {
      console.error("[ResepDetail] Error:", err);
      setError("Terjadi kesalahan saat memuat resep");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKomentars = async (id: string) => {
    try {
      setIsLoadingKomentar(true);
      const response = await apiService.getKomentarByResepId(id);
      if (response.success && response.data) {
        setKomentars(response.data);
      }

      // Check if user has already commented
      if (apiService.getStoredToken()) {
        const userCommentResponse = await apiService.getUserKomentar(id);
        if (userCommentResponse.success && userCommentResponse.data) {
          setUserKomentar(userCommentResponse.data);
          // Don't auto-show the form, let user click edit button
        }
      }
    } catch (err) {
      console.error('[ResepDetail] Error loading comments:', err);
    } finally {
      setIsLoadingKomentar(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      if (params.id) {
        fetchResepDetail(params.id as string);
        fetchKomentars(params.id as string);
      }
    }
  }, [params.id, fetchResepDetail, fetchKomentars]);

  const handleRatingClick = (rating: number) => {
    if (!apiService.getStoredToken()) {
      alert('Silakan login terlebih dahulu untuk memberikan rating');
      router.push('/login');
      return;
    }
    setCommentFormData({ ...commentFormData, rating });
    setShowCommentForm(true);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiService.getStoredToken()) {
      alert('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (!commentFormData.isiKomentar.trim()) {
      alert('Komentar tidak boleh kosong');
      return;
    }

    if (commentFormData.rating === 0) {
      alert('Silakan pilih rating terlebih dahulu');
      return;
    }

    try {
      setIsSubmitting(true);
      let response;
      
      if (isEditMode && userKomentar) {
        // Update existing comment
        response = await apiService.updateKomentar(
          params.id as string,
          userKomentar.id,
          commentFormData
        );
      } else {
        // Create new comment
        response = await apiService.createKomentar(params.id as string, commentFormData);
      }
      
      if (response.success) {
        // Track the comment
        if (resep) {
          trackComment(resep.judul, commentFormData.rating);
          await trackEvent(isEditMode ? 'edit_comment' : 'add_comment', {
            recipeId: resep.id,
            recipeTitle: resep.judul,
            rating: commentFormData.rating,
          });
        }

        alert(isEditMode ? 'Komentar berhasil diperbarui!' : 'Komentar berhasil ditambahkan!');
        setShowCommentForm(false);
        setIsEditMode(false);
        setCommentFormData({ isiKomentar: '', rating: 0 });
        
        // Refresh comments and resep detail
        await fetchKomentars(params.id as string);
        await fetchResepDetail(params.id as string);
      } else {
        throw new Error(response.message || 'Gagal menyimpan komentar');
      }
    } catch (err: any) {
      console.error('[ResepDetail] Error submitting comment:', err);
      alert(err.message || 'Terjadi kesalahan saat menyimpan komentar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4C763B] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat resep...</p>
        </div>
      </div>
    );
  }

  if (error || !resep) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl">😕</span>
          <h2 className="mt-4 text-2xl font-bold text-gray-700">Resep Tidak Ditemukan</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/beranda")}
            className="mt-6 rounded-full bg-[#4C763B] px-6 py-3 text-white hover:brightness-110"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f1]">
      {/* Header */}
      <div className="bg-[#4C763B] py-4">
        <div className="mx-auto max-w-[1200px] px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:opacity-80"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Hero Image */}
          <div className="relative h-64 w-full bg-gradient-to-br from-green-50 to-yellow-50 sm:h-96">
            {resep.gambarURL ? (
              <Image
                src={resep.gambarURL}
                alt={resep.judul}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-9xl">🍵</span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 font-semibold text-[#4C763B] shadow-lg">
              {resep.kategori.nama}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            {/* Title and Rating */}
            <div className="mb-6">
              <h1 className="mb-3 text-3xl font-bold text-[#2f3e2a] sm:text-4xl">
                {resep.judul}
              </h1>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-semibold text-gray-700">
                  {resep.rataRataRating > 0 ? resep.rataRataRating.toFixed(1) : "Belum ada rating"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-[#4C763B]">Deskripsi</h2>
              <p className="text-gray-700 leading-relaxed">{resep.deskripsi}</p>
            </div>

            {/* Sumber Literatur */}
            {resep.sumberLiteratur && (
              <div className="mb-8 rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faBook} className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Sumber Literatur</h3>
                    <p className="text-sm text-blue-700">{resep.sumberLiteratur}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bahan */}
            {resep.bahan && resep.bahan.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-[#4C763B]">Bahan-Bahan</h2>
                <ul className="space-y-2">
                  {resep.bahan.map((bahan, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#4C763B]"></span>
                      <span className="text-gray-700">{bahan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Langkah Pembuatan */}
            {resep.langkahPembuatan && resep.langkahPembuatan.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-[#4C763B]">Langkah Pembuatan</h2>
                <ol className="space-y-4">
                  {resep.langkahPembuatan.map((langkah, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4C763B] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-1 text-gray-700">{langkah}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Rating & Comments Section */}
            <div className="border-t pt-8">
              <div className="mb-6">
                <h2 className="mb-4 text-2xl font-bold text-[#4C763B] flex items-center gap-2">
                  <FontAwesomeIcon icon={faComment} className="h-6 w-6" />
                  Ulasan & Rating
                </h2>

                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-yellow-600">
                        {resep.rataRataRating > 0 ? resep.rataRataRating.toFixed(1) : '0.0'}
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={`h-5 w-5 ${
                              star <= Math.round(resep.rataRataRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {komentars.length} ulasan
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 mb-3">
                        {userKomentar 
                          ? 'Anda sudah memberikan ulasan. Klik tombol di bawah untuk mengeditnya.'
                          : 'Bagikan pengalaman Anda dengan resep ini!'}
                      </p>
                      {!showCommentForm && (
                        <button
                          onClick={() => {
                            if (!apiService.getStoredToken()) {
                              alert('Silakan login terlebih dahulu');
                              router.push('/login');
                              return;
                            }
                            if (userKomentar) {
                              // Edit mode
                              setIsEditMode(true);
                              setCommentFormData({
                                isiKomentar: userKomentar.isiKomentar,
                                rating: userKomentar.rating,
                              });
                            } else {
                              // Create mode
                              setIsEditMode(false);
                              setCommentFormData({ isiKomentar: '', rating: 0 });
                            }
                            setShowCommentForm(true);
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-[#4C763B] text-white rounded-lg hover:brightness-110 transition-all"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                          {userKomentar ? 'Edit Ulasan Saya' : 'Tulis Ulasan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comment Form */}
                {showCommentForm && (
                  <div className="bg-white border-2 border-[#4C763B] rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-[#4C763B] mb-4">
                      {isEditMode ? 'Edit Ulasan Anda' : 'Tulis Ulasan Anda'}
                    </h3>
                    <form onSubmit={handleSubmitComment}>
                      {/* Rating Stars */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating *
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <FontAwesomeIcon
                                icon={faStar}
                                className={`h-8 w-8 ${
                                  star <= commentFormData.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          {commentFormData.rating > 0 && (
                            <span className="ml-2 text-gray-600">
                              {commentFormData.rating}/5
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment Text */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ulasan Anda *
                        </label>
                        <textarea
                          value={commentFormData.isiKomentar}
                          onChange={(e) =>
                            setCommentFormData({
                              ...commentFormData,
                              isiKomentar: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C763B] focus:border-transparent"
                          rows={4}
                          placeholder="Bagikan pengalaman Anda dengan resep ini... (minimal 5 karakter)"
                          required
                          minLength={5}
                          maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {commentFormData.isiKomentar.length}/1000 karakter
                        </p>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-6 py-3 bg-[#4C763B] text-white rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                          {isSubmitting 
                            ? (isEditMode ? 'Memperbarui...' : 'Mengirim...') 
                            : (isEditMode ? 'Perbarui Ulasan' : 'Kirim Ulasan')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCommentForm(false);
                            setIsEditMode(false);
                            setCommentFormData({ isiKomentar: '', rating: 0 });
                          }}
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-all"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Comments List */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Ulasan Pengguna ({komentars.length})
                  </h3>
                  
                  {isLoadingKomentar ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4C763B] border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Memuat ulasan...</p>
                    </div>
                  ) : komentars.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faComment} className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-600">Belum ada ulasan untuk resep ini</p>
                      <p className="text-sm text-gray-500 mt-1">Jadilah yang pertama memberikan ulasan!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {komentars.map((komentar) => (
                        <div
                          key={komentar.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4C763B] to-[#6a9c4d] flex items-center justify-center text-white font-bold text-lg">
                                <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {/* When Click, redirect to user profile */}
                                    <a href={`/profile/${komentar.pengguna.id}`} className="hover:underline">
                                      {komentar.pengguna.nama}
                                    </a>
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesomeIcon
                                          key={star}
                                          icon={faStar}
                                          className={`h-4 w-4 ${
                                            star <= komentar.rating
                                              ? 'text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {komentar.rating}/5
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(komentar.tanggalPosting).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {komentar.isiKomentar}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
