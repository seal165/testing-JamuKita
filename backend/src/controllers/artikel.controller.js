import ArtikelModel from "../models/artikel.models.js";
import { ResponseError } from "../models/error.models.js";

class ArtikelController {
  /**
   * Create new artikel (Admin only)
   */
  static async create(req, res, next) {
    try {
      const { judul, konten, gambarURL, kategori, penulis, tanggalPublikasi } =
        req.body;

      const artikel = await ArtikelModel.create({
        judul,
        konten,
        gambarURL,
        kategori,
        penulis,
        tanggalPublikasi,
      });

      res.status(201).json({
        success: true,
        message: "Artikel berhasil dibuat",
        data: artikel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all artikel with filters (Public)
   */
  static async getAll(req, res, next) {
    try {
      const { kategori, search, page, limit, sortBy, order } = req.query;

      const result = await ArtikelModel.getAll({
        kategori,
        search,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        sortBy: sortBy || "tanggalPublikasi",
        order: order || "desc",
      });

      res.json({
        success: true,
        message: "Artikel berhasil dimuat",
        data: result.artikel,
        pagination: {
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get artikel by ID (Public - increment views)
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const artikel = await ArtikelModel.getById(id);

      if (!artikel) {
        throw new ResponseError(404, "Artikel tidak ditemukan");
      }

      // Increment views
      await ArtikelModel.incrementViews(id);
      artikel.views += 1;

      res.json({
        success: true,
        message: "Artikel berhasil dimuat",
        data: artikel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update artikel (Admin only)
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { judul, konten, gambarURL, kategori, penulis, tanggalPublikasi } =
        req.body;

      const existing = await ArtikelModel.getById(id);
      if (!existing) {
        throw new ResponseError(404, "Artikel tidak ditemukan");
      }

      const updated = await ArtikelModel.update(id, {
        judul,
        konten,
        gambarURL,
        kategori,
        penulis,
        tanggalPublikasi,
      });

      res.json({
        success: true,
        message: "Artikel berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete artikel (Admin only)
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const existing = await ArtikelModel.getById(id);
      if (!existing) {
        throw new ResponseError(404, "Artikel tidak ditemukan");
      }

      await ArtikelModel.delete(id);

      res.json({
        success: true,
        message: "Artikel berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get popular artikel (Public)
   */
  static async getPopular(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const artikel = await ArtikelModel.getPopular(limit);

      res.json({
        success: true,
        message: "Artikel populer berhasil dimuat",
        data: artikel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent artikel (Public)
   */
  static async getRecent(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const artikel = await ArtikelModel.getRecent(limit);

      res.json({
        success: true,
        message: "Artikel terbaru berhasil dimuat",
        data: artikel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get artikel categories (Public)
   */
  static async getCategories(req, res, next) {
    try {
      const categories = await ArtikelModel.getCategories();

      res.json({
        success: true,
        message: "Kategori artikel berhasil dimuat",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ArtikelController;
