// Utility untuk mengelola recent search via Backend API

import { apiService } from "./api";
import type { RecentSearchItem } from "@/types";

// Re-export type
export type { RecentSearchItem };

// Simpan pencarian ke backend
export async function saveRecentSearch(query: string, resultCount: number = 0): Promise<void> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return;

  try {
    await apiService.saveRecentSearch(trimmedQuery, resultCount);
  } catch (error) {
    console.error("Failed to save recent search:", error);
    throw error;
  }
}

// Ambil semua recent searches dari backend
export async function getRecentSearches(): Promise<RecentSearchItem[]> {
  try {
    const response = await apiService.getRecentSearches();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to get recent searches:", error);
    return [];
  }
}

// Hapus satu pencarian
export async function removeRecentSearch(id: number): Promise<void> {
  try {
    await apiService.deleteRecentSearch(id);
  } catch (error) {
    console.error("Failed to remove recent search:", error);
    throw error;
  }
}

// Hapus semua recent searches
export async function clearRecentSearches(): Promise<void> {
  try {
    await apiService.clearAllRecentSearches();
  } catch (error) {
    console.error("Failed to clear recent searches:", error);
    throw error;
  }
}

// Format timestamp ke string yang readable
export function formatSearchTime(timestamp: string): string {
  const searchDate = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - searchDate.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  
  return searchDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
