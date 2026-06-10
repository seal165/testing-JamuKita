import { RecentSearchModel } from "../models/recentSearch.models.js";
import { ResponseError } from "../models/error.models.js";

export const RecentSearchController = {
  // GET /api/recent-search - Get user's recent searches
  async getRecentSearches(req, res, next) {
    try {
      const userId = req.user.id;

      const searches = await RecentSearchModel.getUserRecentSearches(userId);

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan riwayat pencarian",
        data: searches,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/recent-search - Save a new search
  async saveSearch(req, res, next) {
    try {
      const userId = req.user.id;
      const { query, resultCount } = req.body;

      if (!query || query.trim().length === 0) {
        throw new ResponseError(400, "Query pencarian tidak boleh kosong");
      }

      const search = await RecentSearchModel.saveSearch(
        userId,
        query.trim(),
        resultCount || 0
      );

      res.status(201).json({
        success: true,
        message: "Pencarian berhasil disimpan",
        data: search,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/recent-search/:id - Delete one search
  async deleteSearch(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const search = await RecentSearchModel.deleteSearch(
        parseInt(id),
        userId
      );

      if (!search) {
        throw new ResponseError(404, "Riwayat pencarian tidak ditemukan");
      }

      res.status(200).json({
        success: true,
        message: "Riwayat pencarian berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/recent-search - Clear all searches
  async clearAllSearches(req, res, next) {
    try {
      const userId = req.user.id;

      await RecentSearchModel.clearAllSearches(userId);

      res.status(200).json({
        success: true,
        message: "Semua riwayat pencarian berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
