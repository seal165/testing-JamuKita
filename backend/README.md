# Jamu Kita API

![Tests](https://github.com/AthallahDzaki/Jamu-Kita/actions/workflows/backendTest.yaml/badge.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

**Jamu Kita** adalah sebuah REST API yang menyediakan platform untuk mengelola dan berbagi resep jamu tradisional Indonesia. API ini memungkinkan pengguna untuk mencari resep, memberikan komentar dan rating, serta menyimpan resep favorit mereka.

## 🌿 Fitur Utama

### Untuk Anggota (Pengguna Umum)
- **Pencarian Resep:** Cari resep jamu berdasarkan kata kunci dan kategori
- **Detail Resep:** Lihat informasi lengkap resep termasuk bahan dan langkah pembuatan
- **Komentar & Rating:** Berikan ulasan dan rating untuk resep yang telah dicoba
- **Resep Favorit:** Simpan dan kelola daftar resep favorit
- **Kategori Resep:** Jelajahi resep berdasarkan manfaat kesehatan

### Untuk Admin
- **Manajemen Resep:** Tambah, edit, dan hapus resep jamu
- **Manajemen Pengguna:** Kelola akun anggota yang terdaftar

### Umum
- **Autentikasi & Otorisasi:** Sistem login dengan JWT untuk keamanan
- **Dokumentasi API:** Swagger UI untuk dokumentasi interaktif

## 🛠️ Teknologi

- **Backend:** Express.js (Node.js)
- **Database:** MySQL dengan Prisma ORM
- **Autentikasi:** JWT (JSON Web Token)
- **Validasi:** Joi
- **Dokumentasi:** Swagger/OpenAPI 3.0
- **Testing:** Mocha & Chai

## 📋 Struktur Database

- **User** - Pengguna (Anggota & Admin)
- **Kategori** - Kategori resep (Pegal Linu, Flu & Batuk, dll)
- **Resep** - Resep jamu dengan detail lengkap
- **Komentar** - Komentar dan rating dari pengguna
- **Favorit** - Daftar resep favorit pengguna

## 🚀 Cara Penggunaan

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Jamu-Kita.git
cd Jamu-Kita/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root folder:
```env
DATABASE_URL="mysql://user:password@localhost:3306/jamukita"
JWT_SECRET="your_secret_key_here"
PORT=3000
NODE_ENV=development
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

### 6. (Optional) Setup Testing
```bash
# Buat database test
CREATE DATABASE jamukita_test;

# Copy .env.test.example ke .env.test dan sesuaikan
cp .env.test.example .env.test

# Run migrations pada test database
DATABASE_URL="mysql://user:password@localhost:3306/jamukita_test" npx prisma migrate dev

# Jalankan tests
npm test
```

## 📚 Dokumentasi API

Setelah server berjalan, akses dokumentasi lengkap di:
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Base URL:** `http://localhost:3000/v1`

### Endpoint Utama

#### Autentikasi
- `POST /v1/auth/register` - Registrasi anggota baru
- `POST /v1/auth/login` - Login
- `POST /v1/auth/logout` - Logout

#### Resep (Public)
- `GET /v1/resep` - Daftar resep (dengan filter & pagination)
- `GET /v1/resep/:id` - Detail resep

#### Kategori (Public)
- `GET /v1/kategori` - Daftar kategori

#### Komentar
- `GET /v1/resep/:id/komentar` - Daftar komentar (Public)
- `POST /v1/resep/:id/komentar` - Tambah komentar (Anggota)

#### Favorit (Anggota)
- `GET /v1/favorit` - Daftar favorit
- `POST /v1/favorit` - Tambah ke favorit
- `DELETE /v1/favorit/:resep_id` - Hapus dari favorit

#### Admin
- `POST /v1/admin/resep` - Tambah resep
- `PUT /v1/admin/resep/:id` - Edit resep
- `DELETE /v1/admin/resep/:id` - Hapus resep
- `GET /v1/admin/pengguna` - Daftar pengguna
- `DELETE /v1/admin/pengguna/:id` - Hapus pengguna

## 🔒 Autentikasi

Gunakan header Authorization untuk endpoint yang memerlukan autentikasi:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 Contoh Response

### GET /v1/resep/:id
```json
{
  "success": true,
  "message": "Berhasil mendapatkan detail resep",
  "data": {
    "id": "resep-123",
    "judul": "Jamu Beras Kencur",
    "deskripsi": "Minuman penyegar tubuh...",
    "gambarURL": "https://api.jamukita.com/images/beras-kencur.jpg",
    "sumberLiteratur": "Buku Resep Herbal Warisan, Hal. 12",
    "kategori": {
      "id": 1,
      "nama": "Pegal Linu"
    },
    "bahan": [
      "Beras 100gr",
      "Kencur 50gr",
      "Gula Merah secukupnya"
    ],
    "langkahPembuatan": [
      "1. Cuci bersih beras",
      "2. Tumbuk kencur",
      "3. Rebus semua bahan"
    ],
    "rataRataRating": 4.5
  }
}
```

## 🧪 Testing

API ini dilengkapi dengan **73 unit tests** menggunakan Mocha, Chai, dan Supertest.

### Test Coverage

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| Auth | 13 | Register, Login, Logout |
| Resep | 20 | CRUD, Search, Filters |
| Kategori | 3 | Get all categories |
| Komentar | 11 | Create, Read, Validations |
| Favorit | 13 | Add, Remove, List |
| Admin | 13 | User & Resep management |
| **TOTAL** | **73** | **All endpoints** |

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx mocha tests/auth.test.js

# Run in watch mode
npm run test:watch
```

### Setup Test Environment

1. Buat database test:
```bash
CREATE DATABASE jamukita_test;
```

2. Configure `.env.test`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/jamukita_test"
JWT_SECRET="test_secret"
NODE_ENV=test
```

3. Run migrations:
```bash
DATABASE_URL="mysql://user:password@localhost:3306/jamukita_test" npx prisma migrate dev
```

📖 **Dokumentasi lengkap testing:** [TESTING.md](./TESTING.md)

```

## � Security

Aplikasi ini dilengkapi dengan berbagai proteksi keamanan:

### ✅ Proteksi yang Sudah Diimplementasikan
- **SQL Injection Protection:** Menggunakan Prisma ORM dengan parameterized queries
- **Input Validation & Sanitization:** Validasi ketat dengan Joi untuk semua input
- **XSS Protection:** JSON API dengan sanitization pada semua string input
- **Authentication:** JWT dengan bcrypt password hashing (salt rounds 10)
- **Authorization:** Role-based access control (Anggota vs Admin)
- **Security Headers:** Helmet.js untuk HTTP security headers
- **Request Size Limits:** Body parser dengan limit 10MB
- **CORS:** Configured untuk cross-origin requests

### 📚 Dokumentasi Security
Untuk detail lengkap tentang security measures, lihat [SECURITY.md](./SECURITY.md)

### 🔐 Best Practices
- Semua password di-hash menggunakan bcryptjs
- Token JWT dengan expiry time
- Tidak ada raw SQL queries
- Error messages tidak mengekspos detail sistem
- Validasi tipe data ketat
- Input sanitization (trim, lowercase untuk email, dll)

### 🚀 Production Checklist
- [ ] Gunakan HTTPS
- [ ] Set strong JWT_SECRET di environment
- [ ] Enable rate limiting
- [ ] Setup monitoring & logging
- [ ] Regular security audits (`npm audit`)

## �📄 License

SEE LICENSE IN LICENSE

## 👥 Team

Jamu Kita Development Team

---

> Platform untuk melestarikan dan berbagi warisan resep jamu tradisional Indonesia 🇮🇩
