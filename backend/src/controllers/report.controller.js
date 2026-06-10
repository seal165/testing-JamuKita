import { ReportModel } from "../models/report.models.js";
import { UserModel } from "../models/user.models.js";
import { ResponseError } from "../models/error.models.js";

export const ReportController = {
  // POST /report - Create new report
  async create(req, res, next) {
    try {
      const reporterId = req.user.id;
      const { reportedUserId, reason } = req.body;

      // Check if trying to report self
      if (reporterId === parseInt(reportedUserId)) {
        throw new ResponseError(400, "Anda tidak dapat melaporkan diri sendiri");
      }

      // Check if reported user exists
      const reportedUser = await UserModel.getById(parseInt(reportedUserId));
      if (!reportedUser) {
        throw new ResponseError(404, "Pengguna yang dilaporkan tidak ditemukan");
      }

      // Check if reported user is admin
      if (reportedUser.role === "admin") {
        throw new ResponseError(403, "Anda tidak dapat melaporkan admin");
      }

      // Check if already reported
      const hasReported = await ReportModel.hasReported(reporterId, parseInt(reportedUserId));
      if (hasReported) {
        throw new ResponseError(400, "Anda sudah melaporkan pengguna ini");
      }

      const report = await ReportModel.create(reporterId, parseInt(reportedUserId), reason);

      res.status(201).json({
        success: true,
        message: "Laporan berhasil dibuat",
        data: {
          id: report.id,
          reportedUser: {
            id: report.reportedUser.id,
            nama: report.reportedUser.nama,
          },
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /admin/reports - Get all reports (Admin only)
  async getAll(req, res, next) {
    try {
      const reports = await ReportModel.getAll();

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan daftar laporan",
        data: reports.map((r) => ({
          id: r.id,
          reporter: {
            id: r.reporter.id,
            nama: r.reporter.nama,
            email: r.reporter.email,
          },
          reportedUser: {
            id: r.reportedUser.id,
            nama: r.reportedUser.nama,
            email: r.reportedUser.email,
            role: r.reportedUser.role,
            isBanned: r.reportedUser.isBanned,
          },
          reason: r.reason,
          status: r.status,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /admin/reports/:id/ban - Ban user from report (Admin only)
  async banUser(req, res, next) {
    try {
      const { id } = req.params;

      const report = await ReportModel.getById(parseInt(id));
      if (!report) {
        throw new ResponseError(404, "Laporan tidak ditemukan");
      }

      // Check if user is already banned
      if (report.reportedUser.isBanned) {
        throw new ResponseError(400, "Pengguna sudah dibanned");
      }

      // Ban user and delete all comments
      await ReportModel.banUser(report.reportedUserId);

      // Update report status to resolved
      await ReportModel.updateStatus(parseInt(id), "resolved");

      res.status(200).json({
        success: true,
        message: "Pengguna berhasil dibanned dan semua komentarnya dihapus",
        data: {
          reportId: report.id,
          bannedUserId: report.reportedUserId,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /admin/reports/:id/reject - Reject report (Admin only)
  async reject(req, res, next) {
    try {
      const { id } = req.params;

      const report = await ReportModel.getById(parseInt(id));
      if (!report) {
        throw new ResponseError(404, "Laporan tidak ditemukan");
      }

      await ReportModel.updateStatus(parseInt(id), "rejected");

      res.status(200).json({
        success: true,
        message: "Laporan ditolak",
        data: { reportId: report.id },
      });
    } catch (error) {
      next(error);
    }
  },
};
