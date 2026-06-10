import type { Kategori } from "./kategori.types";

/**
 * Activity Favorites Item
 */
export interface ActivityFavoritesItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: Kategori;
  gambarURL: string | null;
  createdAt: string;
}

/**
 * Activity Comments Item
 */
export interface ActivityCommentsItem {
  id: number;
  resepId: string;
  judul: string;
  isiKomentar: string;
  rating: number;
  kategori: Kategori;
  tanggalPosting: string;
}

/**
 * Activity History
 */
export interface ActivityHistory {
  favorites: ActivityFavoritesItem[];
  comments: ActivityCommentsItem[];
}
