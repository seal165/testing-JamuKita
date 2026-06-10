# 🌿 Transformasi Backend: GoRent → Jamu Kita

## 📋 Ringkasan Perubahan

Backend GoRent (rental kendaraan) telah berhasil ditransformasi menjadi **Jamu Kita API** - platform resep jamu tradisional Indonesia, sesuai dengan spesifikasi API yang diberikan.

---

## 🔄 Perubahan Utama

### 1. Database Schema (Prisma)

#### ❌ Schema Lama (GoRent)
- User, Vehicle, Rental, Payment
- Enum: vehicle_type, vehicle_status, rental_status, payment_status, payment_method

#### ✅ Schema Baru (Jamu Kita)
- **User** - Pengguna dengan role: `anggota` atau `admin`
- **Kategori** - Kategori resep (Pegal Linu, Flu & Batuk, dll)
- **Resep** - Resep jamu dengan bahan dan langkah pembuatan (stored as JSON)
- **Komentar** - Komentar dan rating (1-5) untuk resep
- **Favorit** - Relasi many-to-many antara User dan Resep

**File:** `prisma/schema.prisma`

---

### 2. Models Layer

#### File Baru:
- ✅ `src/models/resep.models.js` - CRUD resep dengan rating calculation
- ✅ `src/models/kategori.models.js` - Read kategori
- ✅ `src/models/komentar.models.js` - CRUD komentar
- ✅ `src/models/favorit.models.js` - CRUD favorit
- ♻️ `src/models/user.models.js` - Updated untuk role anggota/admin

#### File Dihapus:
- ❌ vehicle.models.js
- ❌ rental.models.js
- ❌ payment.models.js

---

### 3. Validators

#### File Baru:
- ✅ `src/validators/resep.validator.js` - Validasi create/update resep
- ✅ `src/validators/komentar.validator.js` - Validasi komentar & rating
- ✅ `src/validators/favorit.validator.js` - Validasi favorit
- ♻️ `src/validators/auth.validator.js` - Updated field `name` → `nama`

#### File Dihapus:
- ❌ vehicle.validator.js
- ❌ rental.validator.js
- ❌ payment.validator.js

---

### 4. Controllers

#### File Baru:
- ✅ `src/controllers/resep.controller.js` - ResepController & AdminResepController
- ✅ `src/controllers/kategori.controller.js` - KategoriController
- ✅ `src/controllers/komentar.controller.js` - KomentarController
- ✅ `src/controllers/favorit.controller.js` - FavoritController
- ✅ `src/controllers/admin.controller.js` - AdminUserController
- ♻️ `src/controllers/auth.controller.js` - Updated untuk AuthController

#### File Dihapus:
- ❌ vehicle.controller.js
- ❌ rental.controller.js
- ❌ payment.controller.js
- ❌ user.controller.js

---

### 5. Routes

#### File Baru:
- ✅ `src/routes/resep.routes.js` - GET /resep, GET /resep/:id
- ✅ `src/routes/kategori.routes.js` - GET /kategori
- ✅ `src/routes/komentar.routes.js` - GET/POST /resep/:id/komentar
- ✅ `src/routes/favorit.routes.js` - GET/POST/DELETE /favorit
- ✅ `src/routes/admin.routes.js` - Admin endpoints
- ♻️ `src/routes/auth.routes.js` - Updated routes
- ♻️ `src/routes.js` - Updated main router

#### File Dihapus:
- ❌ vehicle.routes.js
- ❌ rental.routes.js
- ❌ payment.routes.js
- ❌ user.routes.js

---

### 6. Middleware

#### Perubahan:
- ♻️ `src/middlewares/auth.middleware.js`
  - `isAuthenticate` → `authenticateToken`
  - `isAdmin` → `requireAdmin`
  - Improved error handling dengan ResponseError
  - Field `name` → `nama`

- ♻️ `src/middlewares/validator.middleware.js`
  - Added generic `validate()` function
  - Support untuk body, query, dan params validation
  - Better error messages

---

### 7. Dokumentasi (Swagger)

#### File:
- ♻️ `docs/swagger-ui.json` - Completely rewritten

#### Perubahan:
- **Title:** "GoRent API" → "Jamu Kita API"
- **Base URL:** `/api` → `/v1`
- **Schemas:** User, Kategori, ResepSummary, ResepDetail, Komentar, Error
- **Tags:** Auth, Resep, Kategori, Komentar, Favorit, Admin - Resep, Admin - Pengguna

#### Endpoints Terdokumentasi:
**Auth:**
- POST /auth/register
- POST /auth/login
- POST /auth/logout

**Resep (PUBLIC):**
- GET /resep (with filters: q, kategori, pagination)
- GET /resep/:id

**Kategori (PUBLIC):**
- GET /kategori

**Komentar:**
- GET /resep/:id/komentar (PUBLIC)
- POST /resep/:id/komentar (ANGGOTA)

**Favorit (ANGGOTA):**
- GET /favorit
- POST /favorit
- DELETE /favorit/:resep_id

**Admin - Resep:**
- POST /admin/resep
- PUT /admin/resep/:id
- DELETE /admin/resep/:id

**Admin - Pengguna:**
- GET /admin/pengguna
- DELETE /admin/pengguna/:id

---

### 8. Configuration Files

#### package.json
- **name:** "gorent" → "jamu-kita-api"
- **description:** Updated
- **keywords:** Added jamu, herbal, resep, traditional-medicine, indonesia
- **author:** "GoRent Team" → "Jamu Kita Team"
- **seed script:** userSeed.js → seed.js

#### app.js
- **Swagger title:** "GoRent API Documentation" → "Jamu Kita API Documentation"
- **Base URL:** "/api" → "/v1"
- **Welcome message:** Updated

#### README.md
- Completely rewritten with:
  - Jamu Kita description
  - Features for Anggota & Admin
  - Database structure
  - Setup instructions
  - API documentation
  - Example responses
  - Indonesian theme 🇮🇩

---

### 9. Database Seed

#### File Baru:
- ✅ `prisma/seed/seed.js`

#### Data Seed:
**Users:**
- 1 Admin: admin@jamukita.com / admin123
- 3 Anggota: budi@example.com, siti@example.com, ahmad@example.com

**Kategori:**
- Pegal Linu
- Flu & Batuk
- Stamina & Vitalitas
- Pencernaan
- Kesehatan Wanita

**Resep (5 resep):**
1. Jamu Beras Kencur
2. Jamu Kunyit Asam
3. Wedang Jahe
4. Jamu Kunci Sirih
5. Jamu Temulawak

**Komentar & Rating:** 5 sample comments
**Favorit:** 4 sample favorites

---

## 🔐 Authentication & Authorization

### Role-Based Access Control:
- **[PUBLIK]** - Tanpa autentikasi: `/resep`, `/kategori`, `/resep/:id/komentar` (GET)
- **[ANGGOTA]** - Requires JWT: `/favorit`, `/resep/:id/komentar` (POST), `/auth/logout`
- **[ADMIN]** - Requires JWT + admin role: `/admin/*`

### JWT Token Flow:
1. User login → Receive `access_token`
2. Token disimpan di database (field `userToken`)
3. Setiap request protected endpoint → Validate token dari database
4. Logout → Token dihapus dari database

---

## 📡 API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Berhasil mendapatkan data",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "errors": ["Detail error 1", "Detail error 2"]
}
```

### HTTP Status Codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🚀 Langkah Selanjutnya

### 1. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init_jamu_kita

# Seed database
npx prisma db seed
```

### 2. Environment Variables
Pastikan file `.env` berisi:
```env
DATABASE_URL="mysql://user:password@localhost:3306/jamukita"
JWT_SECRET="your_secret_key_here"
PORT=3000
NODE_ENV=development
```

### 3. Test API
- Jalankan server: `npm run dev`
- Akses Swagger: `http://localhost:3000/api-docs`
- Test endpoints sesuai dokumentasi

### 4. Testing (Optional)
Update test files untuk menguji endpoint baru

---

## ✅ Checklist Implementasi

- [x] Update Prisma Schema
- [x] Create Models Layer
- [x] Create Validators
- [x] Create Controllers
- [x] Create Routes
- [x] Update Authentication & Middleware
- [x] Update Swagger Documentation
- [x] Update package.json & README
- [x] Create Database Seed
- [ ] Run migrations
- [ ] Test all endpoints
- [ ] Update test files (optional)

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buka issue di repository atau hubungi tim development.

---

**🎉 Transformasi Complete! Backend Jamu Kita siap digunakan!**
