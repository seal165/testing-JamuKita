import dotenv from "dotenv";
import { execSync } from "child_process";
import { existsSync, unlinkSync } from "fs";

// Load test environment variables
dotenv.config({ path: ".env.test" });

console.log("Database URL : " + process.env.DATABASE_URL);

const dbUrl = process.env.DATABASE_URL?.replace(/^"+|"+$/g, "");
const isSQLite = dbUrl?.startsWith("file:");
console.log("Database URL :", dbUrl);
console.log("isSQLite ?", isSQLite);
console.log('isSQLite ? ', isSQLite);

if (isSQLite) {
    try {
        // If you want a clean DB before each run, remove the file first
        const match = process.env.DATABASE_URL.match(/^file:(.+)$/);
        if (match && existsSync(match[1])) {
            unlinkSync(match[1]);
            console.log("Old test DB deleted.");
        }
    } catch (err) {
        // Ignore if not exist
    }
    try {
        // Generate Prisma Client
        execSync("npx prisma generate --schema=./prisma/schema.test.prisma", {
            stdio: "inherit",
            env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        });

        // Push schema to SQLite file DB
        execSync("npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma", {
            stdio: "inherit",
            env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        });
    } catch (err) {
        console.error("Failed to setup test database:", err.message);
    }
}

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

// Helper: clean, seed, close same as before
export async function cleanDatabase() {
  await prisma.komentar.deleteMany();
  await prisma.favorit.deleteMany();
  await prisma.resep.deleteMany();
  await prisma.kategori.deleteMany();
  await prisma.user.deleteMany();
}

// Helper function to create test data
export async function seedTestData() {
  // Create test admin
  const admin = await prisma.user.create({
    data: {
      nama: "Admin Test",
      email: "admin@test.com",
      password: "$2a$10$X5ZQJZ8Z5ZQJZ8Z5ZQJZ8uQ5ZQJZ8Z5ZQJZ8Z5ZQJZ8Z5ZQJZ8Z5ZQ", // password: admin123
      role: "admin",
    },
  });

  // Create test anggota
  const anggota = await prisma.user.create({
    data: {
      nama: "User Test",
      email: "user@test.com",
      password: "$2a$10$X5ZQJZ8Z5ZQJZ8Z5ZQJZ8uQ5ZQJZ8Z5ZQJZ8Z5ZQJZ8Z5ZQJZ8Z5ZQ", // password: user123
      role: "anggota",
    },
  });

  // Create test kategori
  const kategori1 = await prisma.kategori.create({
    data: {
      nama: "Pegal Linu",
    },
  });

  const kategori2 = await prisma.kategori.create({
    data: {
      nama: "Flu & Batuk",
    },
  });

  // Create test resep
  const resep1 = await prisma.resep.create({
    data: {
      judul: "Jamu Beras Kencur Test",
      deskripsi: "Resep jamu beras kencur untuk test",
      gambarURL: "https://example.com/beras-kencur.jpg",
      sumberLiteratur: "Buku Jamu Test",
      kategoriId: kategori1.id,
      bahan: JSON.stringify(["Beras 100gr", "Kencur 50gr", "Gula Merah"]),
      langkahPembuatan: JSON.stringify([
        "1. Cuci bersih beras",
        "2. Tumbuk kencur",
        "3. Rebus semua bahan",
      ]),
    },
  });

  const resep2 = await prisma.resep.create({
    data: {
      judul: "Wedang Jahe Test",
      deskripsi: "Resep wedang jahe untuk test",
      gambarURL: "https://example.com/wedang-jahe.jpg",
      sumberLiteratur: null,
      kategoriId: kategori2.id,
      bahan: JSON.stringify(["Jahe 100gr", "Gula Merah", "Air 500ml"]),
      langkahPembuatan: JSON.stringify([
        "1. Iris jahe",
        "2. Rebus dengan gula",
        "3. Saring dan sajikan",
      ]),
    },
  });

  return {
    admin,
    anggota,
    kategori1,
    kategori2,
    resep1,
    resep2,
  };
}

// Close database connection after all tests
export async function closeDatabase() {
  await prisma.$disconnect();
}
