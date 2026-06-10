# Documentation Index - Jamu Kita API

Selamat datang di dokumentasi Jamu Kita API! Halaman ini akan membantu Anda menemukan dokumentasi yang Anda butuhkan.

## 📚 Dokumentasi Tersedia

### 1. [API Documentation](./API_DOCUMENTATION.md)
**Untuk: Developers yang ingin mengintegrasikan dengan API**

Dokumentasi lengkap untuk semua REST API endpoints, termasuk:
- Daftar lengkap semua endpoints (30+ endpoints)
- Format request dan response
- Contoh penggunaan dengan curl
- Autentikasi dan authorization
- Pagination, filtering, dan searching
- Data models dan schemas

**Mulai di sini jika Anda:**
- Baru menggunakan Jamu Kita API
- Ingin melihat endpoint apa saja yang tersedia
- Membutuhkan contoh penggunaan API

---

### 2. [Interactive Swagger UI](../../../README.md#api-documentation)
**Untuk: Testing dan eksplorasi API secara interaktif**

Akses Swagger UI untuk:
- Testing API secara langsung dari browser
- Melihat request/response schema secara interaktif
- Mencoba endpoint tanpa menulis code

**URL:**
- Development: `http://localhost:3000/api-docs/`
- Production: `https://api.jamukita.com/api-docs/`

---

### 3. [Entity Relationship Diagram (ERD)](./ERD.md)
**Untuk: Memahami struktur database**

Visual diagram yang menunjukkan:
- 9 tabel database dan relasinya
- Primary keys, foreign keys, unique constraints
- Relationship cardinality (1:N, N:1)
- Cascade delete rules
- Indexes untuk performance

**Mulai di sini jika Anda:**
- Ingin memahami struktur database
- Perlu melihat bagaimana tabel-tabel saling berhubungan
- Melakukan database migration atau optimization

---

### 4. [Database Relationships](./DATABASE_RELATIONSHIPS.md)
**Untuk: Dokumentasi detail tentang database**

Dokumentasi komprehensif mencakup:
- Detail setiap tabel (9 tabel)
- Deskripsi field, tipe data, dan constraints
- Business rules dan validasi
- Performance considerations
- Migration guide

**Mulai di sini jika Anda:**
- Membutuhkan detail teknis tentang database
- Perlu memahami business rules
- Melakukan database development atau troubleshooting

---

### 5. [OpenAPI Specification](./swagger-ui.json)
**Untuk: Code generation dan tools integration**

File OpenAPI 3.0 specification yang bisa digunakan untuk:
- Generate client libraries (berbagai bahasa)
- Import ke Postman atau tools testing lainnya
- Automate API documentation
- CI/CD integration

---

## 🚀 Quick Start Guide

### Untuk Developer Baru:

1. **Pahami struktur API** → Baca [API Documentation](./API_DOCUMENTATION.md)
2. **Eksplorasi endpoints** → Buka [Swagger UI](http://localhost:3000/api-docs/)
3. **Mulai coding** → Lihat contoh di [API Documentation - Example Usage](./API_DOCUMENTATION.md#example-usage)

### Untuk Database Developer:

1. **Lihat struktur database** → Baca [ERD](./ERD.md)
2. **Pahami detail tabel** → Baca [Database Relationships](./DATABASE_RELATIONSHIPS.md)
3. **Cek business rules** → Baca [Database Relationships - Business Rules](./DATABASE_RELATIONSHIPS.md#business-rules)

### Untuk QA/Testing:

1. **Buka Swagger UI** → `http://localhost:3000/api-docs/`
2. **Test endpoints interaktif** → Gunakan "Try it out" di Swagger
3. **Referensi format data** → Cek [API Documentation - Data Models](./API_DOCUMENTATION.md#data-models)

---

## 📋 Endpoint Categories Overview

| Category | Jumlah Endpoints | Deskripsi |
|----------|------------------|-----------|
| **Auth** | 3 | Registrasi, login, logout |
| **Resep** | 4 | Daftar resep, search, detail, top weekly |
| **Kategori** | 1 | Kategori resep |
| **Komentar** | 2 | Komentar dan rating resep |
| **Favorit** | 3 | Manajemen resep favorit |
| **Profile** | 4 | Profil user dan aktivitas |
| **Recent Search** | 4 | Riwayat pencarian |
| **Analytics** | 2 | Event logging dan statistik |
| **Report** | 4 | Sistem pelaporan user |
| **Artikel** | 8 | Artikel edukatif |
| **Upload** | 2 | Upload gambar |
| **Admin - Resep** | 3 | CRUD resep (admin) |
| **Admin - Pengguna** | 2 | Manajemen user (admin) |

**Total: 42 endpoints**

---

## 📊 Database Tables Overview

| Table | Primary Key | Deskripsi |
|-------|-------------|-----------|
| **User** | INT | Data pengguna (anggota & admin) |
| **Kategori** | INT | Kategori resep jamu |
| **Resep** | UUID | Resep jamu tradisional |
| **Komentar** | INT | Komentar dan rating resep |
| **Favorit** | INT | Resep favorit user |
| **RecentSearch** | INT | Riwayat pencarian user |
| **AnalyticsEvent** | INT | Event analytics dan tracking |
| **Report** | INT | Laporan antar user |
| **Artikel** | INT | Artikel edukatif |

---

## 🔐 Authentication Quick Reference

Semua endpoint yang memerlukan autentikasi perlu header:
```
Authorization: Bearer <your_jwt_token>
```

Dapatkan token dari:
- `POST /v1/auth/register` - Registrasi user baru
- `POST /v1/auth/login` - Login dengan email & password

---

## 💡 Tips

### Testing API
1. Gunakan Swagger UI untuk quick testing
2. Gunakan Postman untuk advanced testing scenarios
3. Import OpenAPI spec ke tools favorit Anda

### Database Development
1. Selalu cek ERD sebelum membuat perubahan
2. Perhatikan cascade delete rules
3. Gunakan indexes untuk query performance

### Code Generation
1. Gunakan `swagger-ui.json` untuk generate client code
2. Banyak tools support OpenAPI 3.0 spec
3. Contoh tools: openapi-generator, swagger-codegen

---

## 🆘 Support

Jika Anda memiliki pertanyaan:
- **Email**: support@jamukita.com
- **GitHub Issues**: [Buka issue baru](https://github.com/yourusername/Jamu-Kita/issues)
- **Documentation**: Cek 4 dokumentasi di atas

---

## 📝 Version Information

- **API Version**: 1.0.0
- **OpenAPI Version**: 3.0.0
- **Last Updated**: 2025-01-08

---

## 🎯 Next Steps

Pilih dokumentasi yang sesuai dengan kebutuhan Anda:

- 🔰 **Baru mulai?** → [API Documentation](./API_DOCUMENTATION.md)
- 🧪 **Ingin testing?** → [Swagger UI](http://localhost:3000/api-docs/)
- 🗄️ **Database work?** → [ERD](./ERD.md) & [Database Relationships](./DATABASE_RELATIONSHIPS.md)
- 🛠️ **Generate code?** → [OpenAPI Spec](./swagger-ui.json)

---

**Happy Coding! 🚀**
