import prisma from "../lib/prisma.js";

export const UserModel = {
  // Get all users (Anggota only, for admin)
  async getAll() {
    return await prisma.user.findMany({
      //where: { role: "anggota" },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get user by ID
  async getById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  // Get user by email (for auth)
  async getByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Create new user (registration)
  async create(data) {
    const { nama, email, password } = data;
    return await prisma.user.create({
      data: {
        nama,
        email,
        password,
        role: "anggota", // Default role
      },
    });
  },

  // Update user token
  async updateToken(id, token) {
    return await prisma.user.update({
      where: { id },
      data: { userToken: token },
    });
  },

  // Delete user (Admin only)
  async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  },

  // Check if email exists
  async emailExists(email) {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  },
};