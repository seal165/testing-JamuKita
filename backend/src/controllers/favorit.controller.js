import { FavoritModel } from "../models/favorit.models.js";
import { ResepModel } from "../models/resep.models.js";
import { ResponseError } from "../models/error.models.js";

export const FavoritController = {
  // GET /favorit - Get all favorites for current user
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;

      const favorit = await FavoritModel.getByUserId(userId);

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan daftar resep favorit",
        data: favorit,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /favorit - Add resep to favorites
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { resepId } = req.body;

      // Check if resep exists
      const resep = await ResepModel.getById(resepId);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      // Check if already favorited
      const isFavorited = await FavoritModel.isFavorited(userId, resepId);
      if (isFavorited) {
        throw new ResponseError(400, "Resep sudah ada di daftar favorit");
      }

      await FavoritModel.create(userId, resepId);

      res.status(201).json({
        success: true,
        message: "Resep berhasil ditambahkan ke favorit",
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /favorit/:resep_id - Remove resep from favorites
  async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const { resep_id } = req.params;

      // Check if resep exists
      const resep = await ResepModel.getById(resep_id);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      // Check if favorited
      const isFavorited = await FavoritModel.isFavorited(userId, resep_id);
      if (!isFavorited) {
        throw new ResponseError(404, "Resep tidak ada di daftar favorit");
      }

      await FavoritModel.delete(userId, resep_id);

      res.status(200).json({
        success: true,
        message: "Resep berhasil dihapus dari favorit",
      });
    } catch (error) {
      next(error);
    }
  },
};
