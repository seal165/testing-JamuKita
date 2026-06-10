/**
 * Komentar (Comment) Types
 */

export interface Komentar {
  id: number;
  isiKomentar: string;
  rating: number;
  tanggalPosting: string;
  pengguna: {
    id?: number;
    nama: string;
  };
}

export interface CreateKomentarData {
  isiKomentar: string;
  rating: number;
}
