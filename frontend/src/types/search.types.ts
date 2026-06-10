/**
 * Recent Search Item
 */
export interface RecentSearchItem {
  id: number;
  userId: number;
  query: string;
  resultCount: number;
  createdAt: string;
}

/**
 * Save Recent Search Request Data
 */
export interface SaveRecentSearchData {
  query: string;
  resultCount: number;
}
