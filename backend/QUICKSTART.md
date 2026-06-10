# 🚀 Quick Start Guide - Jamu Kita API

Panduan cepat untuk menjalankan Jamu Kita API pertama kali.

## Prerequisites

Pastikan sudah terinstall:
- Node.js (v18 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

#### Buat Database MySQL
```sql
CREATE DATABASE jamukita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Configure Environment Variables
Copy `.env.example` ke `.env` dan sesuaikan:
```bash
cp .env.example .env
```

Edit file `.env`:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/jamukita"
JWT_SECRET="ganti_dengan_secret_key_random_anda"
PORT=3000
NODE_ENV=development
```

### 3. Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init_jamu_kita
```

### 4. Seed Database (Optional tapi Recommended)
Populate database dengan data sample:
```bash
npx prisma db seed
```

Ini akan membuat:
- 1 akun Admin: `admin@jamukita.com` / `admin123`
- 3 akun Anggota: `budi@example.com` / `password123`
- 5 Kategori resep
- 5 Resep jamu
- Komentar dan favorit sample

### 5. Jalankan Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

### 6. Test API

#### Akses Swagger Documentation
Buka browser: `http://localhost:3000/api-docs`

#### Test dengan cURL

**Get All Resep (Public):**
```bash
curl http://localhost:3000/v1/resep
```

**Register Anggota Baru:**
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jamukita.com",
    "password": "admin123"
  }'
```

**Get Resep dengan Auth (Favorit):**
```bash
# Ganti <TOKEN> dengan access_token dari response login
curl http://localhost:3000/v1/favorit \
  -H "Authorization: Bearer <TOKEN>"
```

## 🎯 Next Steps

1. **Explore API**: Gunakan Swagger UI untuk explore semua endpoint
2. **Test CRUD**: Coba create, read, update, delete resep sebagai admin
3. **Test User Flow**: 
   - Register sebagai anggota baru
   - Login
   - Browse resep
   - Tambah komentar
   - Add to favorit
4. **Customize**: Sesuaikan resep seed dengan data real
5. **Frontend Integration**: Integrate dengan frontend app

## 🔧 Troubleshooting

### Error: "Can't reach database server"
- Pastikan MySQL sudah running
- Cek kredensial database di `.env`
- Test koneksi: `mysql -u root -p`

### Error: "Table doesn't exist"
- Jalankan migrations: `npx prisma migrate dev`
- Reset database (hati-hati!): `npx prisma migrate reset`

### Error: "JWT secret not configured"
- Pastikan `JWT_SECRET` sudah di-set di `.env`
- Jangan gunakan secret default di production!

### Port already in use
- Ganti PORT di `.env`
- Atau kill process yang menggunakan port 3000

## 📚 Documentation

- **API Docs**: http://localhost:3000/api-docs
- **README**: Lihat README.md untuk dokumentasi lengkap
- **Migration Guide**: Lihat MIGRATION_GUIDE.md untuk detail perubahan

## 🆘 Need Help?

- Check README.md untuk dokumentasi lengkap
- Review Swagger documentation
- Open issue di repository

---

**Happy Coding! 🌿**
