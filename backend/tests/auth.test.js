import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase, prisma } from "./setup.js";

describe("Auth API Tests", () => {
  let testData;

  before(async () => {
    // Clean database before all tests
    await cleanDatabase();
    // Seed test data
    testData = await seedTestData();
  });

  after(async () => {
    // Clean up after all tests
    await cleanDatabase();
    await closeDatabase();
  });

  describe("POST /v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({
          nama: "New User",
          email: "newuser@test.com",
          password: "password123",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Registrasi berhasil");
      expect(res.body.data).to.have.property("user");
      expect(res.body.data).to.have.property("access_token");
      expect(res.body.data.user).to.have.property("email", "newuser@test.com");
      expect(res.body.data.user).to.have.property("role", "anggota");
    });

    it("should fail when email already exists", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({
          nama: "Duplicate User",
          email: "user@test.com", // Already exists
          password: "password123",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body.message).to.include("Email sudah terdaftar");
    });

    it("should fail with invalid email format", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({
          nama: "Test User",
          email: "invalid-email",
          password: "password123",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with short password", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({
          nama: "Test User",
          email: "test@test.com",
          password: "12345", // Less than 6 characters
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app).post("/v1/auth/register").send({
        nama: "Test User",
        // email and password missing
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("POST /v1/auth/login", () => {
    let hashedPassword;

    before(async () => {
      // Create a user with known password for login tests
      hashedPassword = await bcrypt.hash("testpass123", 10);
      await prisma.user.create({
        data: {
          nama: "Login Test User",
          email: "logintest@test.com",
          password: hashedPassword,
          role: "anggota",
        },
      });
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/v1/auth/login").send({
        email: "logintest@test.com",
        password: "testpass123",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Login berhasil");
      expect(res.body.data).to.have.property("user");
      expect(res.body.data).to.have.property("access_token");
      expect(res.body.data.user).to.have.property("email", "logintest@test.com");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/v1/auth/login").send({
        email: "logintest@test.com",
        password: "wrongpassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/v1/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with invalid email format", async () => {
      const res = await request(app).post("/v1/auth/login").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with missing credentials", async () => {
      const res = await request(app).post("/v1/auth/login").send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("success", false);
    });
  });

  describe("POST /v1/auth/logout", () => {
    let userToken;

    before(async () => {
      // Login to get a token
      const hashedPassword = await bcrypt.hash("logouttest123", 10);
      await prisma.user.create({
        data: {
          nama: "Logout Test User",
          email: "logouttest@test.com",
          password: hashedPassword,
          role: "anggota",
        },
      });

      const loginRes = await request(app).post("/v1/auth/login").send({
        email: "logouttest@test.com",
        password: "logouttest123",
      });

      userToken = loginRes.body.data.access_token;
    });

    it("should logout successfully with valid token", async () => {
      const res = await request(app)
        .post("/v1/auth/logout")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Logout berhasil");
    });

    it("should fail without authorization token", async () => {
      const res = await request(app).post("/v1/auth/logout");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .post("/v1/auth/logout")
        .set("Authorization", "Bearer invalid_token_here");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });
  });
});
