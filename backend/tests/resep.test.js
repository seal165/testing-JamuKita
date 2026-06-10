import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Resep API Tests", () => {
  let testData;
  let adminToken;
  let userToken;

  before(async () => {
    // Clean database and seed test data
    await cleanDatabase();
    testData = await seedTestData();

    // Get admin token
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

    // Get user token
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

  describe("GET /v1/resep", () => {
    it("should get all resep with default pagination", async () => {
      const res = await request(app).get("/v1/resep");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.be.an("array");
      expect(res.body).to.have.property("pagination");
      expect(res.body.pagination).to.have.property("page", 1);
      expect(res.body.pagination).to.have.property("limit", 10);
    });

    it("should filter resep by keyword", async () => {
      const res = await request(app).get("/v1/resep?q=Beras");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.be.an("array");
      if (res.body.data.length > 0) {
        expect(res.body.data[0].judul).to.include("Beras");
      }
    });

    it("should filter resep by kategori", async () => {
      const res = await request(app).get("/v1/resep?kategori=Pegal Linu");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.be.an("array");
    });

    it("should support custom pagination", async () => {
      const res = await request(app).get("/v1/resep?page=1&limit=5");

      expect(res.status).to.equal(200);
      expect(res.body.pagination).to.have.property("page", 1);
      expect(res.body.pagination).to.have.property("limit", 5);
    });
  });

  describe("GET /v1/resep/search", () => {
    it("should search resep by keyword", async () => {
      const res = await request(app)
        .get("/v1/resep/search?keyword=jahe")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body).to.have.property("pagination");
      expect(res.body).to.have.property("filters");
      expect(res.body.filters).to.have.property("keyword", "jahe");
    });

    it("should filter by kategoriId", async () => {
      const res = await request(app)
        .get(`/v1/resep/search?kategoriId=${testData.kategori1.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.filters).to.have.property(
        "kategoriId",
        testData.kategori1.id.toString()
      );
    });

    it("should filter by minRating", async () => {
      const res = await request(app)
        .get("/v1/resep/search?minRating=4.0")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.filters).to.have.property("minRating", "4.0");
    });

    it("should sort by rating descending", async () => {
      const res = await request(app)
        .get("/v1/resep/search?sortBy=rating&sortOrder=desc")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.filters).to.have.property("sortBy", "rating");
      expect(res.body.filters).to.have.property("sortOrder", "desc");
    });

    it("should fail with invalid minRating", async () => {
      const res = await request(app)
        .get("/v1/resep/search?minRating=10")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with keyword too short", async () => {
      const res = await request(app)
        .get("/v1/resep/search?keyword=a")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("GET /v1/resep/:id", () => {
    it("should get resep detail by id", async () => {
      const res = await request(app).get(`/v1/resep/${testData.resep1.id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property("id", testData.resep1.id);
      expect(res.body.data).to.have.property("judul");
      expect(res.body.data).to.have.property("deskripsi");
      expect(res.body.data).to.have.property("bahan");
      expect(res.body.data).to.have.property("langkahPembuatan");
      expect(res.body.data).to.have.property("kategori");
    });

    it("should return 404 for non-existent resep", async () => {
      const res = await request(app).get("/v1/resep/non-existent-id");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("POST /v1/admin/resep", () => {
    it("should create new resep as admin", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Jamu Kunyit Asam",
          deskripsi: "Jamu tradisional untuk kesehatan wanita",
          gambarURL: "https://example.com/kunyit.jpg",
          sumberLiteratur: "Buku Herbal Indonesia",
          kategoriId: testData.kategori1.id,
          bahan: ["Kunyit 100gr", "Asam Jawa 50gr", "Gula Merah"],
          langkahPembuatan: [
            "1. Rebus kunyit",
            "2. Tambah asam",
            "3. Beri gula",
          ],
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property("judul", "Jamu Kunyit Asam");
    });

    it("should fail without authorization", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .send({
          judul: "Test Resep",
          deskripsi: "Test description",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(401);
    });

    it("should fail with anggota token", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          judul: "Test Resep",
          deskripsi: "Test description",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(403);
    });

    it("should fail with invalid kategoriId", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Test Resep",
          deskripsi: "Test description",
          kategoriId: 99999,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(400);
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Test Resep",
          // Missing other required fields
        });

      expect(res.status).to.equal(400);
    });
  });

  describe("PUT /v1/admin/resep/:id", () => {
    it("should update resep as admin", async () => {
      const res = await request(app)
        .put(`/v1/admin/resep/${testData.resep1.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Updated Jamu Beras Kencur",
          deskripsi: "Updated description",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property(
        "judul",
        "Updated Jamu Beras Kencur"
      );
    });

    it("should fail without authorization", async () => {
      const res = await request(app)
        .put(`/v1/admin/resep/${testData.resep1.id}`)
        .send({
          judul: "Updated Title",
        });

      expect(res.status).to.equal(401);
    });

    it("should fail with anggota token", async () => {
      const res = await request(app)
        .put(`/v1/admin/resep/${testData.resep1.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          judul: "Updated Title",
        });

      expect(res.status).to.equal(403);
    });

    it("should fail for non-existent resep", async () => {
      const res = await request(app)
        .put("/v1/admin/resep/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Updated Title",
        });

      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE /v1/admin/resep/:id", () => {
    it("should delete resep as admin", async () => {
      // Create a resep to delete
      const createRes = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Resep to Delete",
          deskripsi: "Will be deleted",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      const resepId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/v1/admin/resep/${resepId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Resep berhasil dihapus");
    });

    it("should fail without authorization", async () => {
      const res = await request(app).delete(
        `/v1/admin/resep/${testData.resep1.id}`
      );

      expect(res.status).to.equal(401);
    });

    it("should fail with anggota token", async () => {
      const res = await request(app)
        .delete(`/v1/admin/resep/${testData.resep1.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(403);
    });
  });
});
