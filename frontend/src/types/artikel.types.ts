export interface Artikel {
  id: number;
  judul: string;
  konten: string;
  gambarURL: string | null;
  kategori: string;
  penulis: string;
  tanggalPublikasi: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtikelData {
  judul: string;
  konten: string;
  gambarURL?: string;
  kategori: string;
  penulis: string;
  tanggalPublikasi?: string;
}

export interface UpdateArtikelData {
  judul?: string;
  konten?: string;
  gambarURL?: string;
  kategori?: string;
  penulis?: string;
  tanggalPublikasi?: string;
}

export interface ArtikelListResponse {
  artikel: Artikel[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export interface ArtikelPopular {
  id: number;
  judul: string;
  gambarURL: string | null;
  views: number;
  tanggalPublikasi: string;
}

export interface ArtikelRecent {
  id: number;
  judul: string;
  gambarURL: string | null;
  kategori: string;
  tanggalPublikasi: string;
}

export interface ArtikelCategory {
  kategori: string;
  count: number;
}
