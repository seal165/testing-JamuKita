// Import Types from centralized types folder
import type {
  ApiResponse,
  User,
  AuthResponse,
  RegisterData,
  LoginData,
  ActivityHistory,
  Kategori,
  Resep,
  ResepListResponse,
  SearchResepParams,
  GetResepParams,
  SaveRecentSearchData,
  RecentSearchItem,
  AdminUser,
  AdminResep,
  CreateResepData,
  UpdateResepData,
  Komentar,
  CreateKomentarData,
  PublicProfileData,
  Report,
  CreateReportData,
  Artikel,
  CreateArtikelData,
  UpdateArtikelData,
  ArtikelListResponse,
  ArtikelPopular,
  ArtikelRecent,
  ArtikelCategory,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

class ApiService {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  private removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
    }
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.data?.access_token) {
      this.setToken(result.data.access_token);
      // Store user data in localStorage
      if (result.data.user) {
        localStorage.setItem("user_data", JSON.stringify(result.data.user));
      }
    }

    return result;
  }

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.data?.access_token) {
      this.setToken(result.data.access_token);
      // Store user data in localStorage
      if (result.data.user) {
        localStorage.setItem("user_data", JSON.stringify(result.data.user));
      }
    }

    return result;
  }

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getHeaders(true),
    });

    const result = await response.json();

    if (response.ok) {
      this.removeToken();
    }

    return result;
  }

  getStoredToken(): string | null {
    return this.getToken();
  }

  clearToken(): void {
    this.removeToken();
  }

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Resep endpoints
  async getResepList(params?: GetResepParams): Promise<ApiResponse<ResepListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.append("q", params.q);
      if (params?.kategori) queryParams.append("kategori", params.kategori);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/resep${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching resep list:", error);
      return {
        success: false,
        message: "Gagal memuat daftar resep"
      };
    }
  }

  async getResepDetail(id: string): Promise<ApiResponse<Resep>> {
    const response = await fetch(`${API_BASE_URL}/resep/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async searchResep(params?: SearchResepParams): Promise<ApiResponse<Resep[]>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.kategoriId) queryParams.append("kategoriId", params.kategoriId.toString());
    if (params?.minRating) queryParams.append("minRating", params.minRating.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/resep/search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      {
        method: "GET",
        headers: this.getHeaders(true),
      }
    );

    return await response.json();
  }

  async getKategoriList(): Promise<ApiResponse<Kategori[]>> {
    const response = await fetch(`${API_BASE_URL}/kategori`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async getTop7Weekly(): Promise<ApiResponse<Resep[]>> {
    const response = await fetch(`${API_BASE_URL}/resep/top/weekly`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async getFavorites(): Promise<ApiResponse<Resep[]>> {
    const response = await fetch(`${API_BASE_URL}/favorit`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async updateProfile(data: Partial<Pick<User, "nama" | "email">>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "PATCH",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async getActivityHistory(): Promise<ApiResponse<ActivityHistory>> {
    const response = await fetch(`${API_BASE_URL}/me/activity`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async getPublicProfile(userId: number): Promise<ApiResponse<PublicProfileData>> {
    const response = await fetch(`${API_BASE_URL}/me/${userId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  // Recent Search endpoints
  async getRecentSearches(): Promise<ApiResponse<RecentSearchItem[]>> {
    const response = await fetch(`${API_BASE_URL}/recent-search`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async saveRecentSearch(query: string, resultCount: number = 0): Promise<ApiResponse<RecentSearchItem>> {
    const response = await fetch(`${API_BASE_URL}/recent-search`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({ query, resultCount }),
    });

    return await response.json();
  }

  async deleteRecentSearch(id: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/recent-search/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async clearAllRecentSearches(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/recent-search`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  // Admin User Management endpoints
  async getAllUsers(): Promise<ApiResponse<AdminUser[]>> {
    const response = await fetch(`${API_BASE_URL}/admin/pengguna`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async deleteUser(id: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/pengguna/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  // Admin Resep Management endpoints
  async createResep(data: CreateResepData): Promise<ApiResponse<AdminResep>> {
    const response = await fetch(`${API_BASE_URL}/admin/resep`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async updateResep(id: string, data: UpdateResepData): Promise<ApiResponse<AdminResep>> {
    const response = await fetch(`${API_BASE_URL}/admin/resep/${id}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async deleteResep(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/admin/resep/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  // Komentar endpoints
  async getKomentarByResepId(resepId: string): Promise<ApiResponse<Komentar[]>> {
    const response = await fetch(`${API_BASE_URL}/resep/${resepId}/komentar`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async createKomentar(resepId: string, data: CreateKomentarData): Promise<ApiResponse<Komentar>> {
    const response = await fetch(`${API_BASE_URL}/resep/${resepId}/komentar`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async getUserKomentar(resepId: string): Promise<ApiResponse<Komentar>> {
    const response = await fetch(`${API_BASE_URL}/resep/${resepId}/komentar/me`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  async updateKomentar(resepId: string, komentarId: number, data: CreateKomentarData): Promise<ApiResponse<Komentar>> {
    const response = await fetch(`${API_BASE_URL}/resep/${resepId}/komentar/${komentarId}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  // ==================== ARTIKEL METHODS ====================

  async getAllArtikel(params?: {
    kategori?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
  }): Promise<ApiResponse<Artikel[]>> {
    const queryParams = new URLSearchParams();
    if (params?.kategori) queryParams.append("kategori", params.kategori);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);

    const response = await fetch(
      `${API_BASE_URL}/artikel?${queryParams.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return await response.json();
  }

  async getArtikelById(id: number): Promise<ApiResponse<Artikel>> {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async getPopularArtikel(limit?: number): Promise<ApiResponse<ArtikelPopular[]>> {
    const queryParams = limit ? `?limit=${limit}` : "";
    const response = await fetch(
      `${API_BASE_URL}/artikel/popular${queryParams}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return await response.json();
  }

  async getRecentArtikel(limit?: number): Promise<ApiResponse<ArtikelRecent[]>> {
    const queryParams = limit ? `?limit=${limit}` : "";
    const response = await fetch(
      `${API_BASE_URL}/artikel/recent${queryParams}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return await response.json();
  }

  async getArtikelCategories(): Promise<ApiResponse<ArtikelCategory[]>> {
    const response = await fetch(`${API_BASE_URL}/artikel/categories`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async createArtikel(data: CreateArtikelData): Promise<ApiResponse<Artikel>> {
    const response = await fetch(`${API_BASE_URL}/artikel`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async updateArtikel(id: number, data: UpdateArtikelData): Promise<ApiResponse<Artikel>> {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async deleteArtikel(id: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return await response.json();
  }

  // ==================== UPLOAD METHODS ====================

  async uploadImage(data: {
    image: string;
    folder?: string;
  }): Promise<ApiResponse<{ url: string; fileName: string }>> {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async uploadMultipleImages(data: {
    images: string[];
    folder?: string;
  }): Promise<ApiResponse<{ url: string; fileName: string }[]>> {
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

}

export const apiService = new ApiService();
