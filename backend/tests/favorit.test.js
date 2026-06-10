import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Favorit API Tests", () => {
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

    // Create another user
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

  describe("GET /v1/favorit", () => {
    it("should get empty favorit list initially", async () => {
      const res = await request(app)
        .get("/v1/favorit")
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.be.an("array");
    });

    it("should fail without authorization", async () => {
      const res = await request(app).get("/v1/favorit");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should get user favorit list after adding", async () => {
      // Add a favorit first
      await request(app)
        .post("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          resepId: testData.resep1.id,
        });

      const res = await request(app)
        .get("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an("array");
      expect(res.body.data.length).to.be.at.least(1);
    });

    it("should return favorit with correct structure", async () => {
      const res = await request(app)
        .get("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`);

      if (res.body.data.length > 0) {
        const favorit = res.body.data[0];
        expect(favorit).to.have.property("id");
        expect(favorit).to.have.property("judul");
        expect(favorit).to.have.property("deskripsi");
        expect(favorit).to.have.property("kategori");
        expect(favorit).to.have.property("rataRataRating");
      }
    });
  });

  describe("POST /v1/favorit", () => {
    it("should add resep to favorit successfully", async () => {
      const res = await request(app)
        .post("/v1/favorit")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          resepId: testData.resep1.id,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.include("ditambahkan ke favorit");
    });

    it("should fail without authorization", async () => {
      const res = await request(app).post("/v1/favorit").send({
        resepId: testData.resep1.id,
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with missing resepId", async () => {
      const res = await request(app)
        .post("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with non-existent resepId", async () => {
      const res = await request(app)
        .post("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          resepId: "non-existent-id",
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail when adding duplicate favorit", async () => {
      // User already added resep1 to favorit
      const res = await request(app)
        .post("/v1/favorit")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          resepId: testData.resep1.id,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("sudah ada");
    });
  });

  describe("DELETE /v1/favorit/:resep_id", () => {
  beforeEach(async () => {
    // Reset semua favorit
    await prisma.favorit.deleteMany({});
    
    // Setup: Hanya userToken yang punya resep1 di favorit
    await prisma.favorit.create({
      data: {
        userId: testData.anggota.id,  // ID dari userToken
        resepId: testData.resep1.id,
      },
    });
  });

  it("should remove resep from favorit successfully", async () => {
    // userToken delete favoritnya sendiri (BOLEH)
    const res = await request(app)
      .delete(`/v1/favorit/${testData.resep1.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.message).to.include("dihapus dari favorit");
  });

  it("should fail without authorization", async () => {
    const res = await request(app).delete(`/v1/favorit/${testData.resep1.id}`);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("success", false);
  });

  it("should fail for non-existent favorit", async () => {
    // anotherUserToken coba delete resep2 yang tidak ada di favoritnya
    const res = await request(app)
      .delete(`/v1/favorit/${testData.resep2.id}`)
      .set("Authorization", `Bearer ${anotherUserToken}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("success", false);
    expect(res.body.message).to.include("Resep tidak ada di daftar favorit");
  });

  it("should not delete other user's favorit", async () => {
    // anotherUserToken coba delete favorit resep1 milik userToken (TIDAK BOLEH)
    const res = await request(app)
      .delete(`/v1/favorit/${testData.resep1.id}`)
      .set("Authorization", `Bearer ${anotherUserToken}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("success", false);
    expect(res.body.message).to.include("Resep tidak ada di daftar favorit");
  });
});
});
