import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import { cleanDatabase, seedTestData, closeDatabase } from "./setup.js";

describe("Kategori API Tests", () => {
  let testData;

  before(async () => {
    await cleanDatabase();
    testData = await seedTestData();
  });

  after(async () => {
    await cleanDatabase();
    await closeDatabase();
  });

  describe("GET /v1/kategori", () => {
    it("should get all kategori successfully", async () => {
      const res = await request(app).get("/v1/kategori");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.be.an("array");
      expect(res.body.data.length).to.be.at.least(2);
    });

    it("should return kategori with correct structure", async () => {
      const res = await request(app).get("/v1/kategori");

      expect(res.status).to.equal(200);
      const kategori = res.body.data[0];
      expect(kategori).to.have.property("id");
      expect(kategori).to.have.property("nama");
      expect(kategori.id).to.be.a("number");
      expect(kategori.nama).to.be.a("string");
    });

    it("should include test kategori names", async () => {
      const res = await request(app).get("/v1/kategori");

      expect(res.status).to.equal(200);
      const kategoriNames = res.body.data.map((k) => k.nama);
      expect(kategoriNames).to.include("Pegal Linu");
      expect(kategoriNames).to.include("Flu & Batuk");
    });
  });
});
