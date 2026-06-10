import prisma from "../lib/prisma.js";

class ArtikelModel {
  /**
   * Create a new artikel
   * @param {Object} data - { judul, konten, gambarURL?, kategori, penulis, tanggalPublikasi? }
   * @returns {Promise<Object>}
   */
  static async create(data) {
    return await prisma.artikel.create({
      data: {
        judul: data.judul,
        konten: data.konten,
        gambarURL: data.gambarURL || null,
        kategori: data.kategori,
        penulis: data.penulis,
        tanggalPublikasi: data.tanggalPublikasi
          ? new Date(data.tanggalPublikasi)
          : new Date(),
      },
    });
  }

  /**
   * Get all artikel with optional filters and pagination
   * @param {Object} options - { kategori?, search?, page?, limit?, sortBy? }
   * @returns {Promise<Object>} { artikel, total, page, totalPages }
   */
  static async getAll(options = {}) {
    const {
      kategori,
      search,
      page = 1,
      limit = 10,
      sortBy = "tanggalPublikasi",
      order = "desc",
    } = options;

    const where = {};

    if (kategori) {
      where.kategori = kategori;
    }

    if (search) {
      where.OR = [
        { judul: { contains: search } },
        { konten: { contains: search } },
        { penulis: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [artikel, total] = await Promise.all([
      prisma.artikel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.artikel.count({ where }),
    ]);

    return {
      artikel,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get artikel by ID
   * @param {Number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    return await prisma.artikel.findUnique({
      where: { id: parseInt(id) },
    });
  }

  /**
   * Update artikel
   * @param {Number} id
   * @param {Object} data - { judul?, konten?, gambarURL?, kategori?, penulis?, tanggalPublikasi? }
   * @returns {Promise<Object>}
   */
  static async update(id, data) {
    const updateData = {};

    if (data.judul !== undefined) updateData.judul = data.judul;
    if (data.konten !== undefined) updateData.konten = data.konten;
    if (data.gambarURL !== undefined) updateData.gambarURL = data.gambarURL;
    if (data.kategori !== undefined) updateData.kategori = data.kategori;
    if (data.penulis !== undefined) updateData.penulis = data.penulis;
    if (data.tanggalPublikasi !== undefined) {
      updateData.tanggalPublikasi = new Date(data.tanggalPublikasi);
    }

    return await prisma.artikel.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  /**
   * Delete artikel
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  static async delete(id) {
    return await prisma.artikel.delete({
      where: { id: parseInt(id) },
    });
  }

  /**
   * Increment views count
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  static async incrementViews(id) {
    return await prisma.artikel.update({
      where: { id: parseInt(id) },
      data: {
        views: { increment: 1 },
      },
    });
  }

  /**
   * Get popular artikel (highest views)
   * @param {Number} limit
   * @returns {Promise<Array>}
   */
  static async getPopular(limit = 5) {
    return await prisma.artikel.findMany({
      take: limit,
      orderBy: { views: "desc" },
      select: {
        id: true,
        judul: true,
        gambarURL: true,
        views: true,
        tanggalPublikasi: true,
      },
    });
  }

  /**
   * Get recent artikel
   * @param {Number} limit
   * @returns {Promise<Array>}
   */
  static async getRecent(limit = 5) {
    return await prisma.artikel.findMany({
      take: limit,
      orderBy: { tanggalPublikasi: "desc" },
      select: {
        id: true,
        judul: true,
        gambarURL: true,
        kategori: true,
        tanggalPublikasi: true,
      },
    });
  }

  /**
   * Get artikel categories with count
   * @returns {Promise<Array>}
   */
  static async getCategories() {
    const result = await prisma.artikel.groupBy({
      by: ["kategori"],
      _count: {
        kategori: true,
      },
      orderBy: {
        _count: {
          kategori: "desc",
        },
      },
    });

    return result.map((item) => ({
      kategori: item.kategori,
      count: item._count.kategori,
    }));
  }
}

export default ArtikelModel;
