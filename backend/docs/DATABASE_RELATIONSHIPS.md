# Database Relationship Documentation - Jamu Kita

## Overview
Dokumentasi ini menjelaskan secara detail tentang struktur database, relasi antar tabel, dan aturan bisnis yang diterapkan dalam sistem Jamu Kita.

## Table of Contents
1. [Database Tables](#database-tables)
2. [Table Relationships](#table-relationships)
3. [Data Types and Constraints](#data-types-and-constraints)
4. [Business Rules](#business-rules)
5. [Indexes and Performance](#indexes-and-performance)

---

## Database Tables

### 1. User
Tabel untuk menyimpan informasi pengguna sistem (Anggota dan Admin).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik pengguna |
| nama | VARCHAR | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR | UNIQUE, NOT NULL | Email pengguna (digunakan untuk login) |
| password | VARCHAR | NOT NULL | Password ter-hash (bcrypt) |
| role | ENUM('anggota', 'admin') | DEFAULT 'anggota' | Role pengguna |
| isBanned | BOOLEAN | DEFAULT false | Status banned pengguna |
| createdAt | DATETIME | DEFAULT now() | Tanggal registrasi |
| userToken | TEXT | NULLABLE | JWT token untuk autentikasi |

**Relationships:**
- Has Many: Komentar, Favorit, RecentSearch
- Has Many (as reporter): Report
- Has Many (as reportedUser): Report

---

### 2. Kategori
Tabel untuk menyimpan kategori resep jamu.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik kategori |
| nama | VARCHAR | UNIQUE, NOT NULL | Nama kategori (contoh: "Pegal Linu", "Flu & Batuk") |

**Relationships:**
- Has Many: Resep

**Examples:**
- Pegal Linu
- Flu & Batuk
- Kesehatan Wanita
- Kecantikan
- Stamina

---

### 3. Resep
Tabel untuk menyimpan resep jamu tradisional.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR (UUID) | PRIMARY KEY | ID unik resep dalam format UUID |
| judul | VARCHAR | NOT NULL | Judul resep |
| deskripsi | TEXT | NOT NULL | Deskripsi singkat resep |
| gambarURL | VARCHAR | NULLABLE | URL gambar resep |
| sumberLiteratur | TEXT | NULLABLE | Sumber referensi resep |
| kategoriId | INT | FOREIGN KEY | Referensi ke tabel Kategori |
| bahan | TEXT (JSON) | NOT NULL | Array bahan-bahan dalam format JSON |
| langkahPembuatan | TEXT (JSON) | NOT NULL | Array langkah pembuatan dalam format JSON |
| createdAt | DATETIME | DEFAULT now() | Tanggal dibuat |
| updatedAt | DATETIME | AUTO UPDATE | Tanggal terakhir diupdate |

**Relationships:**
- Belongs To: Kategori
- Has Many: Komentar, Favorit

**JSON Format Example:**
```json
{
  "bahan": ["Beras 100gr", "Kencur 50gr", "Gula Merah secukupnya"],
  "langkahPembuatan": ["1. Cuci bersih beras", "2. Tumbuk kencur", "3. Rebus semua bahan"]
}
```

---

### 4. Komentar
Tabel untuk menyimpan komentar dan rating pengguna terhadap resep.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik komentar |
| resepId | VARCHAR | FOREIGN KEY | Referensi ke tabel Resep |
| userId | INT | FOREIGN KEY | Referensi ke tabel User |
| isiKomentar | TEXT | NOT NULL | Isi komentar |
| rating | INT | NOT NULL, CHECK (1-5) | Rating 1-5 bintang |
| tanggalPosting | DATETIME | DEFAULT now() | Tanggal komentar diposting |

**Relationships:**
- Belongs To: Resep (CASCADE DELETE)
- Belongs To: User (CASCADE DELETE)

**Business Rules:**
- Rating harus antara 1-5
- Satu user hanya bisa memberikan satu komentar per resep
- Minimal panjang komentar: 5 karakter
- Maksimal panjang komentar: 1000 karakter

---

### 5. Favorit
Tabel untuk menyimpan resep favorit pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik favorit |
| userId | INT | FOREIGN KEY | Referensi ke tabel User |
| resepId | VARCHAR | FOREIGN KEY | Referensi ke tabel Resep |
| createdAt | DATETIME | DEFAULT now() | Tanggal ditambahkan ke favorit |

**Relationships:**
- Belongs To: User (CASCADE DELETE)
- Belongs To: Resep (CASCADE DELETE)

**Unique Constraint:**
- (userId, resepId) - Satu user tidak bisa memfavoritkan resep yang sama lebih dari sekali

---

### 6. RecentSearch
Tabel untuk menyimpan riwayat pencarian pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik pencarian |
| userId | INT | FOREIGN KEY | Referensi ke tabel User |
| query | VARCHAR(255) | NOT NULL | Kata kunci pencarian |
| resultCount | INT | DEFAULT 0 | Jumlah hasil pencarian |
| createdAt | DATETIME | DEFAULT now() | Tanggal pencarian dilakukan |

**Relationships:**
- Belongs To: User (CASCADE DELETE)

**Business Rules:**
- Sistem menyimpan maksimal riwayat pencarian terakhir per user
- Pencarian disimpan untuk analisis pattern pencarian dan rekomendasi

---

### 7. AnalyticsEvent
Tabel untuk menyimpan event analytics dan tracking user behavior.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik event |
| eventType | VARCHAR(50) | NOT NULL | Jenis event (page_view, search, recipe_view, dll) |
| eventData | TEXT (JSON) | NULLABLE | Data tambahan event dalam format JSON |
| userId | INT | NULLABLE | Referensi ke tabel User (optional) |
| sessionId | VARCHAR(255) | NULLABLE | Session ID untuk tracking |
| ipAddress | VARCHAR(45) | NULLABLE | IP address pengguna |
| userAgent | TEXT | NULLABLE | User agent browser |
| createdAt | DATETIME | DEFAULT now() | Tanggal event terjadi |

**Event Types:**
- `page_view` - Kunjungan halaman
- `search` - Pencarian
- `recipe_view` - Melihat detail resep
- `category_view` - Melihat kategori
- `article_view` - Melihat artikel

**Business Rules:**
- Data analytics bersifat append-only (tidak diupdate atau dihapus)
- userId nullable untuk mendukung tracking user yang belum login
- eventData menyimpan informasi kontekstual dalam format JSON

---

### 8. Report
Tabel untuk menyimpan laporan pengguna terhadap pengguna lain.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik laporan |
| reporterId | INT | FOREIGN KEY | ID user yang melaporkan |
| reportedUserId | INT | FOREIGN KEY | ID user yang dilaporkan |
| reason | TEXT | NOT NULL | Alasan laporan |
| status | ENUM | DEFAULT 'pending' | Status laporan |
| createdAt | DATETIME | DEFAULT now() | Tanggal laporan dibuat |
| updatedAt | DATETIME | AUTO UPDATE | Tanggal terakhir diupdate |

**Relationships:**
- Belongs To: User as reporter (CASCADE DELETE)
- Belongs To: User as reportedUser (CASCADE DELETE)

**Status Values:**
- `pending` - Laporan baru, belum direview
- `reviewed` - Sudah direview oleh admin
- `resolved` - Laporan disetujui dan tindakan sudah diambil
- `rejected` - Laporan ditolak

**Business Rules:**
- Minimal panjang alasan: 10 karakter
- Maksimal panjang alasan: 1000 karakter
- User tidak bisa melaporkan diri sendiri
- Admin dapat melakukan ban terhadap user yang dilaporkan

---

### 9. Artikel
Tabel untuk menyimpan artikel edukatif tentang jamu dan kesehatan.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik artikel |
| judul | VARCHAR(255) | NOT NULL | Judul artikel |
| konten | LONGTEXT | NOT NULL | Konten lengkap artikel |
| gambarURL | TEXT | NULLABLE | URL gambar header artikel |
| kategori | VARCHAR(100) | NOT NULL | Kategori artikel |
| penulis | VARCHAR(100) | NOT NULL | Nama penulis |
| tanggalPublikasi | DATETIME | DEFAULT now() | Tanggal publikasi |
| views | INT | DEFAULT 0 | Jumlah views artikel |
| createdAt | DATETIME | DEFAULT now() | Tanggal dibuat |
| updatedAt | DATETIME | AUTO UPDATE | Tanggal terakhir diupdate |

**Business Rules:**
- Minimal panjang judul: 5 karakter
- Minimal panjang konten: 50 karakter
- Views bertambah otomatis setiap kali artikel diakses
- Hanya admin yang dapat membuat, mengupdate, dan menghapus artikel

---

## Table Relationships

### Relationship Diagram Summary

```
User (1) ─────────── (N) Komentar
User (1) ─────────── (N) Favorit
User (1) ─────────── (N) RecentSearch
User (1) ─────────── (N) Report (as reporter)
User (1) ─────────── (N) Report (as reportedUser)

Kategori (1) ──────── (N) Resep

Resep (1) ─────────── (N) Komentar
Resep (1) ─────────── (N) Favorit

AnalyticsEvent (Independent)
Artikel (Independent)
```

### Cascade Delete Rules

| Parent Table | Child Table | Action |
|--------------|-------------|--------|
| User | Komentar | CASCADE DELETE |
| User | Favorit | CASCADE DELETE |
| User | RecentSearch | CASCADE DELETE |
| User | Report | CASCADE DELETE |
| Resep | Komentar | CASCADE DELETE |
| Resep | Favorit | CASCADE DELETE |

**Impact:**
- Jika User dihapus: Semua komentar, favorit, riwayat pencarian, dan laporan terkait akan ikut terhapus
- Jika Resep dihapus: Semua komentar dan favorit terkait resep tersebut akan ikut terhapus
- Kategori tidak dapat dihapus jika masih ada Resep yang menggunakannya (RESTRICT)

---

## Data Types and Constraints

### Primary Keys
- **User, Kategori, Komentar, Favorit, RecentSearch, AnalyticsEvent, Report, Artikel**: Auto-increment INT
- **Resep**: UUID (VARCHAR) untuk keamanan dan skalabilitas yang lebih baik

### Unique Constraints
1. **User.email** - Mencegah duplikasi email
2. **Kategori.nama** - Mencegah duplikasi nama kategori
3. **Favorit (userId, resepId)** - Mencegah user memfavoritkan resep yang sama lebih dari sekali

### NOT NULL Constraints
Semua field yang bersifat mandatory harus diisi:
- User: nama, email, password
- Kategori: nama
- Resep: judul, deskripsi, kategoriId, bahan, langkahPembuatan
- Komentar: resepId, userId, isiKomentar, rating
- Favorit: userId, resepId
- RecentSearch: userId, query
- Report: reporterId, reportedUserId, reason
- Artikel: judul, konten, kategori, penulis

---

## Business Rules

### User Management
1. Email harus unik dan valid
2. Password harus minimal 6 karakter dan di-hash menggunakan bcrypt
3. Default role adalah 'anggota'
4. Admin dapat melakukan ban terhadap user dengan mengubah flag isBanned
5. User yang di-ban tidak dapat login ke sistem

### Resep Management
1. Setiap resep harus memiliki kategori
2. Bahan dan langkah pembuatan disimpan sebagai JSON array
3. Rating resep dihitung dari rata-rata semua rating komentar
4. Gambar resep bersifat opsional
5. Hanya admin yang dapat membuat, mengupdate, dan menghapus resep

### Komentar & Rating
1. Satu user hanya dapat memberikan satu komentar per resep
2. Rating harus antara 1-5 bintang
3. Panjang komentar minimal 5 karakter, maksimal 1000 karakter
4. User harus login untuk memberikan komentar
5. Komentar tidak dapat diupdate setelah dibuat (only create and delete)

### Favorit
1. User harus login untuk menambahkan favorit
2. User tidak dapat memfavoritkan resep yang sama lebih dari sekali
3. Tidak ada batasan jumlah resep favorit per user

### Search & Analytics
1. Pencarian disimpan untuk analisis dan rekomendasi
2. Analytics event dicatat untuk semua aktivitas penting
3. Data analytics bersifat append-only
4. Tracking bisa dilakukan untuk user yang login maupun guest

### Report System
1. User harus login untuk melaporkan pengguna lain
2. User tidak dapat melaporkan diri sendiri
3. Alasan laporan minimal 10 karakter
4. Hanya admin yang dapat mereview dan memproses laporan
5. Admin dapat melakukan ban atau reject laporan

### Artikel
1. Hanya admin yang dapat CRUD artikel
2. Views bertambah otomatis setiap artikel diakses
3. Artikel dapat difilter berdasarkan kategori
4. Konten artikel menggunakan LONGTEXT untuk mendukung artikel panjang

---

## Indexes and Performance

### Indexed Columns

| Table | Indexed Columns | Purpose |
|-------|----------------|---------|
| Resep | kategoriId | Filter resep by kategori |
| Komentar | resepId, userId | Query komentar per resep & per user |
| Favorit | userId, resepId | Query favorit per user & per resep |
| RecentSearch | userId, createdAt | Query riwayat pencarian per user & sorting |
| AnalyticsEvent | eventType, createdAt, userId | Filter & query analytics data |
| Report | reporterId, reportedUserId, status | Filter & query laporan |
| Artikel | kategori, tanggalPublikasi | Filter artikel & sorting |

### Performance Considerations

1. **Resep Search**: Full-text search diimplementasikan pada kolom judul, deskripsi, bahan, dan langkahPembuatan
2. **Pagination**: Semua endpoint list menggunakan pagination untuk performance
3. **Caching**: Rating rata-rata resep dihitung secara real-time (tidak di-cache di database)
4. **Cascade Delete**: Perhatikan impact cascade delete pada tabel dengan banyak relasi
5. **JSON Fields**: Bahan dan langkahPembuatan disimpan sebagai TEXT/JSON untuk fleksibilitas query

---

## Database Migrations

Database menggunakan Prisma ORM untuk migration management. Schema definition ada di file `prisma/schema.prisma`.

### Migration Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migration to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Seed database
npm run prisma db seed
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-18 | Initial database design |
| 1.1 | 2025-10-20 | Added RecentSearch table |
| 1.2 | 2025-10-25 | Added AnalyticsEvent table |
| 1.3 | 2025-11-01 | Added Report table |
| 1.4 | 2025-11-05 | Added Artikel table |

---

## Contact & Support

Untuk pertanyaan atau dukungan terkait database, hubungi:
- Email: support@jamukita.com
- Team: Jamu Kita Development Team
