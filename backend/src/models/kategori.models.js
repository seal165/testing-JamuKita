import prisma from "../lib/prisma.js";

export const KategoriModel = {
  // Get all categories
  async getAll() {
    return await prisma.kategori.findMany({
      orderBy: { nama: "asc" },
    });
  },

  // Get category by ID
  async getById(id) {
    return await prisma.kategori.findUnique({
      where: { id: parseInt(id) },
    });
  },

  // Get category by name
  async getByName(nama) {
    return await prisma.kategori.findUnique({
      where: { nama },
    });
  },
};
