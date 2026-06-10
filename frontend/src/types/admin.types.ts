/**
 * Admin API Types
 */

export interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: 'anggota' | 'admin';
  createdAt: string;
}

export interface AdminResep {
  id: string;
  judul: string;
  deskripsi: string;
  gambarURL: string | null;
  kategoriId: number;
  kategori: {
    id: number;
    nama: string;
  };
  bahan: string[];
  langkahPembuatan: string[];
  sumberLiteratur?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResepData {
  judul: string;
  deskripsi: string;
  gambarURL?: string;
  kategoriId: number;
  bahan: string[];
  langkahPembuatan: string[];
  sumberLiteratur?: string;
}

export interface UpdateResepData extends Partial<CreateResepData> {}

export interface AnalyticsResponse {
  summary: {
    totalVisitors: number;
    averageDaily: number;
    highestVisitors: number;
    lowestVisitors: number;
    period: string;
  };
  dailyVisitors: Array<{ date: string; visitors: number }>;
  topCategories: Array<{ name: string; count: number }>;
  topRecipes: Array<{ id: string; title: string; count: number }>;
  topSearchTerms: Array<{ query: string; count: number }>;
}
