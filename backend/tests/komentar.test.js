import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Komentar API Tests", () => {
  let testData;
  let userToken;
  let anotherUserToken;

  before(async () => {
    await cleanDatabase();
    testData = await seedTestData();

    // Setup user token
    const hashedPassword = await bcrypt.hash("user123", 10);
    await prisma.user.update({
      where: { id: testData.anggota.id },
      data: { password: hashedPassword },
    });

    const userLogin = await request(app).post("/v1/auth/login").send({
      email: "user@test.com",
      password: "user123",
    });
    userToken = userLogin.body.data.access_token;

    // Create another user for testing
    const anotherUser = await prisma.user.create({
      data: {
        nama: "Another User",
        email: "another@test.com",
        password: hashedPassword,
        role: "anggota",
      },
    });

    const anotherLogin = await request(app).post("/v1/auth/login").send({
      email: "another@test.com",
      password: "user123",
    });
    anotherUserToken = anotherLogin.body.data.access_token;
  });

  after(async () => {
    await cleanDatabase();
    await closeDatabase();
  });

  describe("GET /v1/resep/:id/komentar", () => {
    it("should get all komentar for a resep", async () => {
      // First, create a komentar
      await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "Jamu ini sangat manjur!",
          rating: 5,
        });

      const res = await request(app).get(`/v1/resep/${testData.resep1.id}/komentar`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.be.an("array");
    });

    it("should return komentar with correct structure", async () => {
      const res = await request(app).get(`/v1/resep/${testData.resep1.id}/komentar`);

      if (res.body.data.length > 0) {
        const komentar = res.body.data[0];
        expect(komentar).to.have.property("id");
        expect(komentar).to.have.property("isiKomentar");
        expect(komentar).to.have.property("rating");
        expect(komentar).to.have.property("tanggalPosting");
        expect(komentar).to.have.property("pengguna");
        expect(komentar.pengguna).to.have.property("nama");
      }
    });

    it("should return 404 for non-existent resep", async () => {
      const res = await request(app).get("/v1/resep/non-existent-id/komentar");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("POST /v1/resep/:id/komentar", () => {
    it("should create komentar successfully", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep2.id}/komentar`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "Rasanya enak dan menyehatkan",
          rating: 4,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Komentar berhasil ditambahkan");
      expect(res.body.data).to.have.property("isiKomentar", "Rasanya enak dan menyehatkan");
      expect(res.body.data).to.have.property("rating", 4);
    });

    it("should fail without authorization", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .send({
          isiKomentar: "Test komentar",
          rating: 5,
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with komentar too short", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          isiKomentar: "Ok", // Less than 5 characters
          rating: 5,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with invalid rating", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          isiKomentar: "Test komentar dengan rating invalid",
          rating: 6, // Invalid: max is 5
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with rating less than 1", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          isiKomentar: "Test komentar dengan rating nol",
          rating: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          isiKomentar: "Hanya ada komentar tanpa rating",
          // rating missing
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail for non-existent resep", async () => {
      const res = await request(app)
        .post("/v1/resep/non-existent-id/komentar")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "Test komentar",
          rating: 5,
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail when user already commented on the resep", async () => {
      // User already commented on resep1 in earlier test
      const res = await request(app)
        .post(`/v1/resep/${testData.resep1.id}/komentar`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          isiKomentar: "Mencoba komentar lagi pada resep yang sama",
          rating: 5,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("sudah memberikan komentar");
    });
  });
});
