import prisma from "../lib/prisma.js";

export const ReportModel = {
  // Create new report
  async create(reporterId, reportedUserId, reason) {
    return await prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
      },
      include: {
        reporter: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nama: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  // Get all reports (Admin only)
  async getAll() {
    return await prisma.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nama: true,
            email: true,
            role: true,
            isBanned: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get report by ID
  async getById(id) {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            nama: true,
            email: true,
            role: true,
            isBanned: true,
          },
        },
      },
    });
  },

  // Update report status
  async updateStatus(id, status) {
    return await prisma.report.update({
      where: { id },
      data: { status },
    });
  },

  // Check if user already reported another user
  async hasReported(reporterId, reportedUserId) {
    const count = await prisma.report.count({
      where: {
        reporterId,
        reportedUserId,
      },
    });
    return count > 0;
  },

  // Ban user and delete all their comments
  async banUser(userId) {
    // Use transaction to ensure both operations succeed or fail together
    return await prisma.$transaction(async (tx) => {
      // Delete all comments by this user
      await tx.komentar.deleteMany({
        where: { userId },
      });

      // Ban the user
      const bannedUser = await tx.user.update({
        where: { id: userId },
        data: { isBanned: true },
      });

      return bannedUser;
    });
  },

  // Unban user
  async unbanUser(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });
  },
};
