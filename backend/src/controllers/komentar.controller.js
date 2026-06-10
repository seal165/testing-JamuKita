import { KomentarModel } from "../models/komentar.models.js";
import { ResepModel } from "../models/resep.models.js";
import { ResponseError } from "../models/error.models.js";

export const KomentarController = {
  // GET /resep/:id/komentar - Get all comments for a resep
  async getByResepId(req, res, next) {
    try {
      const { id } = req.params;

      // Check if resep exists
      const resep = await ResepModel.getById(id);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      const komentar = await KomentarModel.getByResepId(id);

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan daftar komentar",
        data: komentar,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /resep/:id/komentar - Add comment to resep
  async create(req, res, next) {
    try {
      const { id: resepId } = req.params;
      const userId = req.user.id;

      // Check if resep exists
      const resep = await ResepModel.getById(resepId);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      // Check if user already commented
      const hasCommented = await KomentarModel.hasUserCommented(resepId, userId);
      if (hasCommented) {
        throw new ResponseError(400, "Anda sudah memberikan komentar pada resep ini");
      }

      const komentar = await KomentarModel.create(resepId, userId, req.body);

      res.status(201).json({
        success: true,
        message: "Komentar berhasil ditambahkan",
        data: {
          id: komentar.id,
          isiKomentar: komentar.isiKomentar,
          rating: komentar.rating,
          tanggalPosting: komentar.tanggalPosting.toISOString(),
          pengguna: {
            nama: komentar.user.nama,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /resep/:id/komentar/me - Get current user's comment for a resep
  async getUserComment(req, res, next) {
    try {
      const { id: resepId } = req.params;
      const userId = req.user.id;

      // Check if resep exists
      const resep = await ResepModel.getById(resepId);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      const komentar = await KomentarModel.getUserComment(resepId, userId);

      if (!komentar) {
        return res.status(404).json({
          success: false,
          message: "Anda belum memberikan komentar pada resep ini",
        });
      }

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan komentar",
        data: komentar,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /resep/:resepId/komentar/:komentarId - Update comment
  async update(req, res, next) {
    try {
      const { resepId, komentarId } = req.params;
      const userId = req.user.id;

      // Check if resep exists
      const resep = await ResepModel.getById(resepId);
      if (!resep) {
        throw new ResponseError(404, "Resep tidak ditemukan");
      }

      // Check if comment exists
      const existingKomentar = await KomentarModel.getById(parseInt(komentarId));
      if (!existingKomentar) {
        throw new ResponseError(404, "Komentar tidak ditemukan");
      }

      // Check if user owns this comment
      if (existingKomentar.userId !== userId) {
        throw new ResponseError(403, "Anda tidak memiliki akses untuk mengubah komentar ini");
      }

      const updatedKomentar = await KomentarModel.update(parseInt(komentarId), req.body);

      res.status(200).json({
        success: true,
        message: "Komentar berhasil diperbarui",
        data: {
          id: updatedKomentar.id,
          isiKomentar: updatedKomentar.isiKomentar,
          rating: updatedKomentar.rating,
          tanggalPosting: updatedKomentar.tanggalPosting.toISOString(),
          pengguna: {
            id: updatedKomentar.user.id,
            nama: updatedKomentar.user.nama,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
