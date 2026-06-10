import { UserModel } from "../models/user.models.js";
import { ResponseError } from "../models/error.models.js";

export const AdminUserController = {
  // GET /admin/pengguna - Get all users (Anggota only)
  async getAll(req, res, next) {
    try {
      const users = await UserModel.getAll();

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan daftar pengguna",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /admin/pengguna/:id - Delete user
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;

      // Prevent admin from deleting themselves
      if (parseInt(id) === currentUserId) {
        throw new ResponseError(403, "Tidak dapat menghapus akun sendiri");
      }

      // Check if user exists
      const user = await UserModel.getById(parseInt(id));
      if (!user) {
        throw new ResponseError(404, "Pengguna tidak ditemukan");
      }

      // Prevent deleting another admin
      if (user.role === "admin") {
        throw new ResponseError(403, "Tidak dapat menghapus akun admin lain");
      }

      await UserModel.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: "Pengguna berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
