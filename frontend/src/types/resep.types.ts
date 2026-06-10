import type { Kategori } from "./kategori.types";
import type { Pagination } from "./api.types";

/**
 * Resep Interface
 */
export interface Resep {
  id: string;
  judul: string;
  deskripsi: string;
  gambarURL: string | null;
  kategori: Kategori;
  rataRataRating: number;
  sumberLiteratur?: string | null;
  bahan?: string[];
  langkahPembuatan?: string[];
  totalKomentar?: number;
  totalFavorit?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Resep Detail (with required full data)
 */
export interface ResepDetail extends Resep {
  bahan: string[];
  langkahPembuatan: string[];
  sumberLiteratur: string | null;
}

/**
 * Resep List Response with Pagination
 */
export interface ResepListResponse {
  data: Resep[];
  pagination: Pagination;
}

/**
 * Search Resep Parameters
 */
export interface SearchResepParams {
  keyword?: string;
  kategoriId?: string | number;
  minRating?: string | number;
  sortBy?: "createdAt" | "rating" | "judul" | string | undefined;
  sortOrder?: "asc" | "desc" | string;
  page?: number;
  limit?: number;
}

/**
 * Get Resep Parameters
 */
export interface GetResepParams {
  q?: string;
  kategori?: string;
  page?: number;
  limit?: number;
}
