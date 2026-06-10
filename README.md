# Jamu-Kita 🌿

Platform digital untuk melestarikan dan berbagi warisan resep jamu tradisional Indonesia. 

[![Live_Demo](https://img.shields.io/badge/demo-live-success)](https://jamu-kita.vercel.app)
![Typescript](https://img.shields.io/badge/TypeScript-61.3%25-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-36.9%25-yellow)
![Tests](https://github.com/AthallahDzaki/Jamu-Kita/actions/workflows/backendTest.yaml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.%200-brightgreen)

## 📖 Tentang Project

**Jamu-Kita** adalah platform web full-stack yang memungkinkan pengguna untuk mencari, berbagi, dan mengelola resep jamu tradisional Indonesia. Platform ini menggabungkan kearifan lokal dengan teknologi modern untuk melestarikan warisan budaya Indonesia. 

🌐 **Live Demo:** [https://jamu-kita.vercel.app](https://jamu-kita.vercel.app)

## ✨ Fitur Utama

### 👥 Untuk Anggota (Pengguna Umum)
- 🔍 **Pencarian Resep** - Cari resep jamu berdasarkan kata kunci dan kategori
- 📋 **Detail Resep Lengkap** - Informasi bahan, langkah pembuatan, dan sumber literatur
- ⭐ **Komentar & Rating** - Berikan ulasan dan rating untuk resep
- ❤️ **Resep Favorit** - Simpan dan kelola daftar resep favorit
- 🏷️ **Kategori Resep** - Jelajahi berdasarkan manfaat kesehatan (Pegal Linu, Flu & Batuk, dll)

### 👨‍💼 Untuk Admin
- ➕ **Manajemen Resep** - Tambah, edit, dan hapus resep jamu
- 👤 **Manajemen Pengguna** - Kelola akun anggota yang terdaftar

### 🔐 Keamanan
- 🛡️ **Autentikasi JWT** - Login aman dengan JSON Web Token
- 🔒 **Password Hashing** - Bcrypt dengan salt rounds 10
- ✅ **Input Validation** - Validasi ketat dengan Joi
- 🚫 **SQL Injection Protection** - Prisma ORM dengan parameterized queries
- 🔰 **Security Headers** - Helmet.js untuk HTTP security

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (React)
- **Language:** TypeScript
- **Styling:** CSS Modules / Tailwind CSS
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js (≥18.0.0)
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Joi
- **Documentation:** Swagger/OpenAPI 3.0
- **Testing:** Mocha & Chai (73 unit tests)

## 📊 Komposisi Bahasa

- TypeScript: 61.3%
- JavaScript: 36.9%
- CSS: 1.1%
- Other: 0.7%

## 🗄️ Struktur Database

- **User** - Data pengguna (Anggota & Admin)
- **Kategori** - Kategori resep berdasarkan manfaat kesehatan
- **Resep** - Resep jamu dengan detail lengkap
- **Komentar** - Ulasan dan rating dari pengguna
- **Favorit** - Daftar resep favorit pengguna

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js ≥ 18.0.0
- MySQL Server
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/AthallahDzaki/Jamu-Kita. git
cd Jamu-Kita
```

### 2. Setup Backend

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Optional: seed data

# Run backend server
npm run dev  # Development
npm start    # Production
```

Backend akan berjalan di `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Setup environment variables
cp . env.local. example .env.local
# Edit .env.local dengan API URL backend Anda

# Run frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3001`

## 📚 API Documentation

Setelah backend berjalan, akses dokumentasi API interaktif:
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Base URL:** `http://localhost:3000/v1`

### Endpoint Utama

#### 🔐 Autentikasi
```
POST /v1/auth/register  - Registrasi pengguna
POST /v1/auth/login     - Login
POST /v1/auth/logout    - Logout
```

#### 📖 Resep (Public)
```
GET  /v1/resep          - Daftar resep (filter & pagination)
GET  /v1/resep/:id      - Detail resep
```

#### 💬 Komentar
```
GET  /v1/resep/:id/komentar  - Daftar komentar (Public)
POST /v1/resep/:id/komentar  - Tambah komentar (Anggota)
```

#### ❤️ Favorit (Anggota)
```
GET    /v1/favorit              - Daftar favorit
POST   /v1/favorit              - Tambah favorit
DELETE /v1/favorit/:resep_id    - Hapus favorit
```

#### 👨‍💼 Admin
```
POST   /v1/admin/resep          - Tambah resep
PUT    /v1/admin/resep/:id      - Edit resep
DELETE /v1/admin/resep/:id      - Hapus resep
GET    /v1/admin/pengguna       - Daftar pengguna
DELETE /v1/admin/pengguna/:id   - Hapus pengguna
```

## 🧪 Testing

Backend dilengkapi dengan **73 comprehensive unit tests**. 

```bash
cd backend

# Setup test database
CREATE DATABASE jamukita_test;
cp .env.test.example .env.test
DATABASE_URL="mysql://user:password@localhost:3306/jamukita_test" npx prisma migrate dev

# Run tests
npm test

# Run specific test
npx mocha tests/auth. test.js
```

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

## 📂 Struktur Project

```
Jamu-Kita/
├── frontend/           # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── public/        # Static assets
│
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middlewares/  # Custom middlewares
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── validations/  # Joi schemas
│   ├── prisma/          # Database schema & migrations
│   └── tests/           # Test suites
│
└── README.md
```

## 🔒 Security Features

- ✅ SQL Injection Protection (Prisma ORM)
- ✅ Input Validation & Sanitization (Joi)
- ✅ XSS Protection
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Security Headers (Helmet.js)
- ✅ Request Size Limits
- ✅ CORS Configuration
- ✅ Password Hashing (bcryptjs)

📖 **Detail lengkap:** [SECURITY.md](./backend/SECURITY.md)

## 📝 Environment Variables

### Backend (. env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/jamukita"
JWT_SECRET="your_secret_key_here"
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
```

## 🚀 Deployment

### Frontend (Vercel)
Frontend sudah di-deploy di Vercel dan dapat diakses di:
👉 [https://jamu-kita.vercel.app](https://jamu-kita. vercel.app)

### Backend
Dapat di-deploy ke:
- Railway
- Render
- DigitalOcean
- AWS / GCP / Azure

## 📄 Dokumentasi Tambahan

- [Backend README](./backend/README.md) - Dokumentasi lengkap backend API
- [Frontend README](./frontend/README.md) - Dokumentasi frontend
- [Testing Guide](./backend/TESTING.md) - Panduan testing
- [Security Documentation](./backend/SECURITY.md) - Dokumentasi keamanan

## 👥 Team

Irani
Safril Rendiantoro (2318025)
Athallah Dzaki Anggoro Seputro (2318026)
Agung


## 📞 Kontak

- **Repository:** [github.com/AthallahDzaki/Jamu-Kita](https://github.com/AthallahDzaki/Jamu-Kita)
- **Website:** [jamu-kita.vercel.app](https://jamu-kita.vercel.app)

## 📄 License

SEE LICENSE IN LICENSE

---

> 🇮🇩 Platform untuk melestarikan dan berbagi warisan resep jamu tradisional Indonesia

**Dibuat dengan ❤️ untuk Indonesia**
```
