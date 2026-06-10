import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Validation & Security Tests", () => {
  let testData;
  let adminToken;
  let userToken;

  before(async () => {
    await cleanDatabase();
    testData = await seedTestData();

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

  describe("Input Sanitization Tests", () => {
    it("should trim whitespace from string inputs", async () => {
      const res = await request(app).post("/v1/auth/register").send({
        nama: "  Test User  ",
        email: "  trimtest@test.com  ",
        password: "password123",
      });

      expect(res.status).to.equal(201);
      expect(res.body.data.user.nama).to.equal("Test User");
      expect(res.body.data.user.email).to.equal("trimtest@test.com");
    });

    it("should convert email to lowercase", async () => {
      const res = await request(app).post("/v1/auth/register").send({
        nama: "Lowercase Test",
        email: "UPPERCASE@TEST.COM",
        password: "password123",
      });

      expect(res.status).to.equal(201);
      expect(res.body.data.user.email).to.equal("uppercase@test.com");
    });

    it("should sanitize array items in resep", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Sanitize Test",
          deskripsi: "Testing array sanitization",
          kategoriId: testData.kategori1.id,
          bahan: ["  Bahan 1  ", "  Bahan 2  "],
          langkahPembuatan: ["  Step 1  ", "  Step 2  "],
        });

      expect(res.status).to.equal(201);
      // Array items should be trimmed
      res.body.data.bahan.forEach((bahan) => {
        expect(bahan).to.not.match(/^\s+|\s+$/);
      });
    });
  });

  describe("XSS Prevention Tests", () => {
    it("should accept but not execute script tags in comments", async () => {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await prisma.user.update({
        where: { id: testData.anggota.id },
        data: { password: hashedPassword },
      });

      const userLogin = await request(app).post("/v1/auth/login").send({
        email: "user@test.com",
        password: "user123",
      });
      const userToken = userLogin.body.data.access_token;

      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "<script>alert('XSS')</script>Test komentar",
          rating: 5,
        });

      expect(res.status).to.equal(201);
      // Data should be stored as-is (escaping happens on frontend)
      expect(res.body.data.isiKomentar).to.include("<script>");
    });
  });

  describe("SQL Injection Prevention Tests", () => {
    it("should safely handle SQL-like strings in search", async () => {
      const maliciousQuery = "'; DROP TABLE resep; --";
      const res = await request(app).get(
        `/v1/resep?q=${encodeURIComponent(maliciousQuery)}`
      );

      expect(res.status).to.equal(200);
      // Should return empty or no results, not error
      expect(res.body).to.have.property("success", true);
    });

    it("should safely handle SQL injection in keyword search", async () => {
      const res = await request(app)
        .get("/v1/resep/search?keyword=" + encodeURIComponent("' OR '1'='1"))
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.be.oneOf([200, 401]);
      if (res.status === 200) {
        expect(res.body).to.have.property("success", true);
      }
    });
  });

  describe("Authorization Bypass Tests", () => {
    it("should not allow anggota to access admin endpoints", async () => {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await prisma.user.update({
        where: { id: testData.anggota.id },
        data: { password: hashedPassword },
      });

      const userLogin = await request(app).post("/v1/auth/login").send({
        email: "user@test.com",
        password: "user123",
      });
      const userToken = userLogin.body.data.access_token;

      const endpoints = [
        { method: "post", url: "/v1/admin/resep" },
        { method: "put", url: `/v1/admin/resep/${testData.resep1.id}` },
        { method: "delete", url: `/v1/admin/resep/${testData.resep1.id}` },
        { method: "get", url: "/v1/admin/pengguna" },
        { method: "delete", url: "/v1/admin/pengguna/1" },
      ];

      for (const endpoint of endpoints) {
        const res = await request(app)
          [endpoint.method](endpoint.url)
          .set("Authorization", `Bearer ${userToken}`)
          .send({});

        expect(res.status).to.equal(403);
        expect(res.body).to.have.property("success", false);
      }
    });

    it("should not allow access without token to protected routes", async () => {
      const protectedRoutes = [
        { method: "post", url: "/v1/auth/logout" },
        { method: "get", url: "/v1/favorit" },
        { method: "post", url: "/v1/favorit" },
        { method: "delete", url: `/v1/favorit/${testData.resep1.id}` },
        { method: "post", url: `/v1/resep/${testData.resep1.id}/komentar` },
      ];

      for (const route of protectedRoutes) {
        const res = await request(app)[route.method](route.url).send({});

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("success", false);
      }
    });
  });

  describe("Data Type Validation Tests", () => {
    it("should reject invalid data types", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Test",
          deskripsi: "Test",
          kategoriId: "not-a-number", // Should be number
          bahan: "not-an-array", // Should be array
          langkahPembuatan: ["Step 1"],
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should reject rating outside 1-5 range", async () => {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await prisma.user.update({
        where: { id: testData.anggota.id },
        data: { password: hashedPassword },
      });

      const userLogin = await request(app).post("/v1/auth/login").send({
        email: "user@test.com",
        password: "user123",
      });
      const userToken = userLogin.body.data.access_token;

      const invalidRatings = [0, 6, -1, 10];

      for (const rating of invalidRatings) {
        // Create new resep for each test to avoid duplicate comment error
        const resepRes = await request(app)
          .post("/v1/admin/resep")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            judul: `Test Resep ${rating}`,
            deskripsi: "Test Resep Dengan Deskripsi Panjang",
            kategoriId: testData.kategori1.id,
            bahan: ["Test"],
            langkahPembuatan: ["Test"],
          });

        const res = await request(app)
          .post(`/v1/resep/${resepRes.body.data.id}/komentar`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            isiKomentar: "Test komentar",
            rating: rating,
          });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("success", false);
      }
    });
  });

  describe("Length Constraint Tests", () => {
    it("should reject password shorter than 6 characters", async () => {
      const res = await request(app).post("/v1/auth/register").send({
        nama: "Test User",
        email: "shortpass@test.com",
        password: "12345", // 5 chars
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should reject judul shorter than 3 characters", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "AB", // 2 chars
          deskripsi: "Test description",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should reject komentar shorter than 5 characters", async () => {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await prisma.user.update({
        where: { id: testData.anggota.id },
        data: { password: hashedPassword },
      });

      const userLogin = await request(app).post("/v1/auth/login").send({
        email: "user@test.com",
        password: "user123",
      });
      const userToken = userLogin.body.data.access_token;

      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "OK", // 2 chars
          rating: 5,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("URL Validation Tests", () => {
    it("should accept valid URL for gambarURL", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Valid URL Test",
          deskripsi: "Testing URL validation",
          gambarURL: "https://example.com/image.jpg",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(201);
    });

    it("should reject invalid URL for gambarURL", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "Invalid URL Test",
          deskripsi: "Testing URL validation",
          gambarURL: "not-a-valid-url",
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should accept null or empty gambarURL", async () => {
      const res = await request(app)
        .post("/v1/admin/resep")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          judul: "No Image Test",
          deskripsi: "Testing optional gambarURL",
          gambarURL: null,
          kategoriId: testData.kategori1.id,
          bahan: ["Test"],
          langkahPembuatan: ["Test"],
        });

      expect(res.status).to.equal(201);
    });
  });
});
