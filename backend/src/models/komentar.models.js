import prisma from "../lib/prisma.js";

export const KomentarModel = {
  // Get all comments for a resep
  async getByResepId(resepId) {
    const komentar = await prisma.komentar.findMany({
      where: { resepId },
      include: {
        user: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
      orderBy: { tanggalPosting: "desc" },
    });

    return komentar.map((k) => ({
      id: k.id,
      isiKomentar: k.isiKomentar,
      rating: k.rating,
      tanggalPosting: k.tanggalPosting.toISOString(),
      pengguna: {
        id: k.user.id,
        nama: k.user.nama,
      },
    }));
  },

  // Create new comment
  async create(resepId, userId, data) {
    const { isiKomentar, rating } = data;

    return await prisma.komentar.create({
      data: {
        resepId,
        userId,
        isiKomentar,
        rating,
      },
      include: {
        user: {
          select: {
            nama: true,
          },
        },
      },
    });
  },

  // Check if user already commented on this resep
  async hasUserCommented(resepId, userId) {
    const count = await prisma.komentar.count({
      where: {
        resepId,
        userId,
      },
    });
    return count > 0;
  },

  // Get comment by ID
  async getById(id) {
    return await prisma.komentar.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  },

  // Get user's comment for a specific resep
  async getUserComment(resepId, userId) {
    const komentar = await prisma.komentar.findFirst({
      where: {
        resepId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    if (!komentar) return null;

    return {
      id: komentar.id,
      isiKomentar: komentar.isiKomentar,
      rating: komentar.rating,
      tanggalPosting: komentar.tanggalPosting.toISOString(),
      pengguna: {
        id: komentar.user.id,
        nama: komentar.user.nama,
      },
    };
  },

  // Update comment
  async update(id, data) {
    const { isiKomentar, rating } = data;

    return await prisma.komentar.update({
      where: { id },
      data: {
        isiKomentar,
        rating,
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  },
};
