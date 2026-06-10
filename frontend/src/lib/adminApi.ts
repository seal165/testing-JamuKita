import { AnalyticsResponse, ApiResponse, CreateReportData, Report } from "@/types";
import { AdminStats } from "@/types/adminApi.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

class AdminApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }
  async getAnalyticsLogs(): Promise<ApiResponse<AdminStats>> {
    const response = await fetch(`${API_BASE_URL}/analytics/statistics`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createReport(data: CreateReportData): Promise<ApiResponse<Report>> {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async getAllReports(): Promise<ApiResponse<Report[]>> {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async banUserFromReport(reportId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/report/${reportId}/ban`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async rejectReport(reportId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/report/${reportId}/reject`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    return await response.json();
  }
}

export const adminApiService = new AdminApiService();
