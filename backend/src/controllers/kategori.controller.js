import { KategoriModel } from "../models/kategori.models.js";

export const KategoriController = {
  // GET /kategori - Get all categories
  async getAll(req, res, next) {
    try {
      const kategori = await KategoriModel.getAll();

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan daftar kategori",
        data: kategori,
      });
    } catch (error) {
      next(error);
    }
  },
};
