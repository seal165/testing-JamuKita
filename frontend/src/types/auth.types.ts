/**
 * User Types
 */
export interface User {
  id: number;
  nama: string;
  email: string;
  role: "anggota" | "admin";
  createdAt?: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  user: User;
  access_token: string;
}

/**
 * Register Request Data
 */
export interface RegisterData {
  nama: string;
  email: string;
  password: string;
}

/**
 * Login Request Data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Public Profile Response
 */
export interface PublicProfileData {
  user: {
    id: number;
    nama: string;
    role: string;
  };
  activity: {
    favorites: Array<{
      id: string;
      judul: string;
      deskripsi: string;
      kategori: {
        id: number;
        nama: string;
      };
      gambarURL: string | null;
      createdAt: string;
    }>;
    comments: Array<{
      id: number;
      resepId: string;
      judul: string;
      isiKomentar: string;
      rating: number;
      kategori: {
        id: number;
        nama: string;
      };
      tanggalPosting: string;
    }>;
  };
  stats: {
    totalFavorites: number;
    totalComments: number;
  };
}
