import prisma from "../lib/prisma.js";

export const FavoritModel = {
  // Get all favorites for a user
  async getByUserId(userId) {
    const favorit = await prisma.favorit.findMany({
      where: { userId },
      include: {
        resep: {
          include: {
            kategori: true,
            komentar: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return favorit.map((f) => {
      const ratings = f.resep.komentar.map((k) => k.rating);
      const rataRataRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        id: f.resep.id,
        judul: f.resep.judul,
        deskripsi: f.resep.deskripsi,
        gambarURL: f.resep.gambarURL,
        kategori: {
          id: f.resep.kategori.id,
          nama: f.resep.kategori.nama,
        },
        rataRataRating: Math.round(rataRataRating * 10) / 10,
      };
    });
  },

  // Add resep to favorites
  async create(userId, resepId) {
    return await prisma.favorit.create({
      data: {
        userId,
        resepId,
      },
    });
  },

  // Remove resep from favorites
  async delete(userId, resepId) {
    return await prisma.favorit.deleteMany({
      where: {
        userId,
        resepId,
      },
    });
  },

  // Check if resep is already favorited
  async isFavorited(userId, resepId) {
    const count = await prisma.favorit.count({
      where: {
        userId,
        resepId,
      },
    });
    return count > 0;
  },
};
