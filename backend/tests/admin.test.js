import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Admin API Tests", () => {
  let testData;
  let adminToken;
  let userToken;

  before(async () => {
    await cleanDatabase();
    testData = await seedTestData();

    // Setup admin token
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.update({
      where: { id: testData.admin.id },
      data: { password: hashedPassword },
    });

    const adminLogin = await request(app).post("/v1/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });
    adminToken = adminLogin.body.data.access_token;

    // Setup user token
    await prisma.user.update({
      where: { id: testData.anggota.id },
      data: { password: hashedPassword },
    });

    const userLogin = await request(app).post("/v1/auth/login").send({
      email: "user@test.com",
      password: "admin123",
    });
    userToken = userLogin.body.data.access_token;
  });

  after(async () => {
    await cleanDatabase();
    await closeDatabase();
  });

  describe("GET /v1/admin/pengguna", () => {
    it("should get all anggota as admin", async () => {
      const res = await request(app)
        .get("/v1/admin/pengguna")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.be.an("array");
      expect(res.body.data.length).to.be.at.least(1);
    });

    it("should return users with correct structure", async () => {
      const res = await request(app)
        .get("/v1/admin/pengguna")
        .set("Authorization", `Bearer ${adminToken}`);

      if (res.body.data.length > 0) {
        const user = res.body.data[0];
        expect(user).to.have.property("id");
        expect(user).to.have.property("nama");
        expect(user).to.have.property("email");
        expect(user).to.have.property("role");
        expect(user).to.have.property("createdAt");
        expect(user).to.not.have.property("password"); // Password should not be exposed
      }
    });

    it("should fail without authorization", async () => {
      const res = await request(app).get("/v1/admin/pengguna");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with anggota token", async () => {
      const res = await request(app)
        .get("/v1/admin/pengguna")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("DELETE /v1/admin/pengguna/:id", () => {
    it("should delete anggota user as admin", async () => {
      // Create a user to delete
      const userToDelete = await prisma.user.create({
        data: {
          nama: "User to Delete",
          email: "delete@test.com",
          password: await bcrypt.hash("password123", 10),
          role: "anggota",
        },
      });

      const res = await request(app)
        .delete(`/v1/admin/pengguna/${userToDelete.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.message).to.include("berhasil dihapus");
    });

    it("should fail without authorization", async () => {
      const res = await request(app).delete(`/v1/admin/pengguna/${testData.anggota.id}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with anggota token", async () => {
      const res = await request(app)
        .delete(`/v1/admin/pengguna/${testData.anggota.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail when deleting non-existent user", async () => {
      const res = await request(app)
        .delete("/v1/admin/pengguna/99999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail when trying to delete admin user", async () => {
      // Create another admin
      const anotherAdmin = await prisma.user.create({
        data: {
          nama: "Another Admin",
          email: "admin2@test.com",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
        },
      });

      const res = await request(app)
        .delete(`/v1/admin/pengguna/${anotherAdmin.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("Tidak dapat menghapus akun admin lain");
    });

    it("should fail when admin tries to delete themselves", async () => {
      const res = await request(app)
        .delete(`/v1/admin/pengguna/${testData.admin.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("Tidak dapat menghapus akun sendiri");
    });
  });

  describe("Admin Resep Management (Additional Tests)", () => {
    it("should validate kategoriId exists when creating resep", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Test Resep Invalid Kategori",
          deskripsi: "Test description",
          kategoriId: 99999, // Non-existent kategori
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("tidak ditemukan");
    });

    it("should trim and sanitize input when creating resep", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "  Resep with Spaces  ",
          deskripsi: "  Description with spaces  ",
          kategoriId: testData.kategori1.id,
          bahan: ["  Bahan 1  ", "  Bahan 2  "],
          langkahPembuatan: ["  Step 1  ", "  Step 2  "],
        });

      expect(res.status).to.equal(201);
      expect(res.body.data.judul).to.not.include("  ");
      expect(res.body.data.deskripsi).to.not.include("  ");
    });
  });
});
