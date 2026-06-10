# API Documentation - Jamu Kita

## Overview

Dokumentasi lengkap untuk Jamu Kita REST API. API ini menyediakan endpoint untuk manajemen resep jamu tradisional Indonesia, komentar, rating, favorit, artikel edukatif, dan fitur lainnya.

## Akses Dokumentasi Interaktif

Dokumentasi API interaktif tersedia melalui Swagger UI:

- **Development**: http://localhost:3000/api-docs/
- **Production**: https://api.jamukita.com/api-docs/

## Base URL

- **Development**: `http://localhost:3000/v1`
- **Production**: `https://api.jamukita.com/v1`

## Autentikasi

API menggunakan JWT (JSON Web Token) untuk autentikasi. Token harus disertakan dalam header Authorization untuk endpoint yang memerlukan autentikasi.

```
Authorization: Bearer <your_jwt_token>
```

### Mendapatkan Token

Gunakan endpoint `/auth/login` atau `/auth/register` untuk mendapatkan token JWT.

## Endpoint Categories

### 1. Authentication (Auth)
Endpoint untuk registrasi, login, dan logout.

- `POST /auth/register` - Registrasi akun Anggota baru
- `POST /auth/login` - Login untuk Anggota dan Admin
- `POST /auth/logout` - Logout (invalidate token) 🔒

### 2. Resep (Recipes)
Endpoint publik untuk mengakses resep jamu.

- `GET /resep` - Mendapatkan daftar semua resep
- `GET /resep/top/weekly` - **NEW** Mendapatkan Top 7 resep minggu ini
- `GET /resep/search` - Pencarian resep lanjutan (Advanced Search)
- `GET /resep/{id}` - Mendapatkan detail resep

### 3. Kategori (Categories)
Endpoint publik untuk kategori resep.

- `GET /kategori` - Mendapatkan daftar semua kategori

### 4. Komentar (Comments & Ratings)
Endpoint untuk komentar dan rating resep.

- `GET /resep/{id}/komentar` - Mendapatkan semua komentar untuk resep
- `POST /resep/{id}/komentar` - Menambahkan komentar dan rating 🔒

### 5. Favorit (Favorites)
Endpoint untuk mengelola resep favorit (memerlukan autentikasi).

- `GET /favorit` - Mendapatkan daftar resep favorit 🔒
- `POST /favorit` - Menambahkan resep ke favorit 🔒
- `DELETE /favorit/{resep_id}` - Menghapus resep dari favorit 🔒

### 6. Profile
**NEW** - Endpoint untuk manajemen profil pengguna.

- `GET /me` - Mendapatkan profil pengguna yang sedang login 🔒
- `PATCH /me` - Memperbarui profil pengguna yang sedang login 🔒
- `GET /me/activity` - Mendapatkan riwayat aktivitas pengguna 🔒
- `GET /me/{userId}` - Mendapatkan profil publik pengguna lain

### 7. Recent Search
**NEW** - Endpoint untuk mengelola riwayat pencarian.

- `GET /recent-search` - Mendapatkan riwayat pencarian pengguna 🔒
- `POST /recent-search` - Menyimpan pencarian baru 🔒
- `DELETE /recent-search` - Menghapus semua riwayat pencarian 🔒
- `DELETE /recent-search/{id}` - Menghapus satu riwayat pencarian 🔒

### 8. Analytics
**NEW** - Endpoint untuk analytics dan statistik.

- `POST /analytics/log` - Mencatat event analytics (PUBLIC)
- `GET /analytics/statistics` - Mendapatkan statistik analytics 🔒👑

### 9. Report
**NEW** - Endpoint untuk melaporkan pengguna.

- `GET /report` - Mendapatkan semua laporan 🔒👑
- `POST /report` - Melaporkan pengguna 🔒
- `POST /report/{id}/ban` - Ban pengguna yang dilaporkan 🔒👑
- `POST /report/{id}/reject` - Menolak laporan 🔒👑

### 10. Artikel
**NEW** - Endpoint untuk artikel edukatif.

- `GET /artikel` - Mendapatkan daftar artikel
- `POST /artikel` - Menambahkan artikel baru 🔒👑
- `GET /artikel/popular` - Mendapatkan artikel populer
- `GET /artikel/recent` - Mendapatkan artikel terbaru
- `GET /artikel/categories` - Mendapatkan daftar kategori artikel
- `GET /artikel/{id}` - Mendapatkan detail artikel
- `PUT /artikel/{id}` - Memperbarui artikel 🔒👑
- `DELETE /artikel/{id}` - Menghapus artikel 🔒👑

### 11. Upload
**NEW** - Endpoint untuk upload gambar (Admin only).

- `POST /upload/image` - Upload single image 🔒👑
- `POST /upload/images` - Upload multiple images 🔒👑

### 12. Admin - Resep
Endpoint admin untuk manajemen resep.

- `POST /admin/resep` - Menambahkan resep baru 🔒👑
- `PUT /admin/resep/{id}` - Memperbarui resep 🔒👑
- `DELETE /admin/resep/{id}` - Menghapus resep 🔒👑

### 13. Admin - Pengguna
Endpoint admin untuk manajemen pengguna.

- `GET /admin/pengguna` - Mendapatkan daftar semua Anggota 🔒👑
- `DELETE /admin/pengguna/{id}` - Menghapus akun Anggota 🔒👑

**Legend:**
- 🔒 = Memerlukan autentikasi (Login required)
- 👑 = Memerlukan role Admin (Admin only)

## Response Format

Semua endpoint mengembalikan response dalam format JSON dengan struktur berikut:

### Success Response
```json
{
  "success": true,
  "message": "Berhasil mendapatkan data",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "errors": [
    "Detail error 1",
    "Detail error 2"
  ]
}
```

## HTTP Status Codes

API menggunakan HTTP status code standar:

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Request tidak valid (validasi gagal)
- `401 Unauthorized` - Token tidak valid atau tidak ada
- `403 Forbidden` - User tidak memiliki akses
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Error pada server

## Pagination

Endpoint yang mengembalikan list data mendukung pagination dengan query parameters:

- `page` - Nomor halaman (default: 1, min: 1)
- `limit` - Jumlah item per halaman (default: 10, min: 1, max: 100)

Response pagination:
```json
{
  "success": true,
  "message": "Berhasil mendapatkan data",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Search & Filtering

### Resep Search
Endpoint `/resep/search` mendukung advanced search dengan parameter:

- `keyword` - Kata kunci pencarian (minimal 2 karakter)
- `kategoriId` - Filter berdasarkan ID kategori
- `minRating` - Rating minimal (0-5)
- `sortBy` - Urutan berdasarkan: `createdAt`, `rating`, `judul`
- `sortOrder` - Urutan: `asc` atau `desc`

### Artikel Filter
Endpoint `/artikel` mendukung filter:

- `kategori` - Filter berdasarkan kategori artikel
- `page` & `limit` - Pagination

## Rate Limiting

*Coming soon* - Rate limiting akan diterapkan untuk mencegah abuse.

## CORS

CORS enabled untuk semua origin. Dalam production, ini akan dibatasi hanya untuk domain yang diizinkan.

## Data Models

### User
```typescript
{
  id: number;
  nama: string;
  email: string;
  role: "anggota" | "admin";
}
```

### Resep Summary
```typescript
{
  id: string;
  judul: string;
  deskripsi: string;
  gambarURL: string | null;
  kategori: {
    id: number;
    nama: string;
  };
  rataRataRating: number;
}
```

### Resep Detail
Extends Resep Summary dengan:
```typescript
{
  sumberLiteratur: string | null;
  bahan: string[];
  langkahPembuatan: string[];
}
```

### Komentar
```typescript
{
  id: number;
  isiKomentar: string;
  rating: number; // 1-5
  tanggalPosting: string; // ISO 8601
  pengguna: {
    nama: string;
  };
}
```

### Artikel
```typescript
{
  id: number;
  judul: string;
  konten: string;
  gambarURL: string | null;
  kategori: string;
  penulis: string;
  tanggalPublikasi: string; // ISO 8601
  views: number;
}
```

## Example Usage

### Register New User
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Hartono",
    "email": "budi@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@example.com",
    "password": "password123"
  }'
```

### Get All Resep
```bash
curl http://localhost:3000/v1/resep?page=1&limit=10
```

### Get Top 7 Weekly Resep
```bash
curl http://localhost:3000/v1/resep/top/weekly
```

### Add to Favorites (Authenticated)
```bash
curl -X POST http://localhost:3000/v1/favorit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "resepId": "resep-123"
  }'
```

### Search Resep
```bash
curl "http://localhost:3000/v1/resep/search?keyword=jahe&minRating=4&sortBy=rating&sortOrder=desc"
```

### Log Analytics Event
```bash
curl -X POST http://localhost:3000/v1/analytics/log \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "recipe_view",
    "eventData": {
      "recipeId": "resep-123",
      "recipeTitle": "Jamu Beras Kencur"
    },
    "sessionId": "session-abc123"
  }'
```

## Environment Variables

```env
DATABASE_URL=mysql://user:password@localhost:3306/jamukita
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development

# AWS S3 for image upload (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
```

## Testing

Gunakan tools berikut untuk testing API:

- **Swagger UI** - http://localhost:3000/api-docs/ (Interactive testing)
- **Postman** - Import OpenAPI spec dari `/api-docs/swagger-ui.json`
- **curl** - Command line testing
- **Thunder Client** - VS Code extension

## Additional Documentation

- [ERD (Entity Relationship Diagram)](./ERD.md) - Database schema visualization
- [Database Relationships](./DATABASE_RELATIONSHIPS.md) - Detailed database documentation
- [OpenAPI Spec](./swagger-ui.json) - OpenAPI 3.0 specification

## Support

Untuk pertanyaan atau dukungan:
- Email: support@jamukita.com
- GitHub Issues: https://github.com/yourusername/Jamu-Kita/issues

## Version

Current API Version: **1.0.0**

Last Updated: 2025-01-08
