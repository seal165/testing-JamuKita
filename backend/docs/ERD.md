# Entity Relationship Diagram (ERD) - Jamu Kita

## Database Schema Visualization

Berikut adalah representasi ERD dari database Jamu Kita dalam format teks:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JAMU KITA DATABASE                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│         User             │
├──────────────────────────┤
│ PK  id (INT)            │
│     nama (VARCHAR)       │
│ UK  email (VARCHAR)      │
│     password (VARCHAR)   │
│     role (ENUM)          │
│     isBanned (BOOLEAN)   │
│     createdAt (DATETIME) │
│     userToken (TEXT)     │
└──────────────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────┐
         │                                     │
         │ 1:N                                 │ 1:N
         ▼                                     ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│       Komentar           │         │        Favorit           │
├──────────────────────────┤         ├──────────────────────────┤
│ PK  id (INT)            │         │ PK  id (INT)            │
│ FK  resepId (VARCHAR)   │         │ FK  userId (INT)        │
│ FK  userId (INT)        │         │ FK  resepId (VARCHAR)   │
│     isiKomentar (TEXT)   │         │     createdAt (DATETIME)│
│     rating (INT)         │         └──────────────────────────┘
│     tanggalPosting       │                  │
│         (DATETIME)       │                  │ N:1
└──────────────────────────┘                  ▼
         │                           ┌──────────────────────────┐
         │ N:1                       │         Resep            │
         │                           ├──────────────────────────┤
         └──────────────────────────▶│ PK  id (UUID)           │
                                     │     judul (VARCHAR)      │
┌──────────────────────────┐         │     deskripsi (TEXT)     │
│       Kategori           │         │     gambarURL (VARCHAR)  │
├──────────────────────────┤         │     sumberLiteratur      │
│ PK  id (INT)            │         │         (TEXT)           │
│ UK  nama (VARCHAR)      │         │ FK  kategoriId (INT)    │
└──────────────────────────┘         │     bahan (TEXT/JSON)    │
         │                           │     langkahPembuatan     │
         │ 1:N                       │         (TEXT/JSON)      │
         └──────────────────────────▶│     createdAt (DATETIME)│
                                     │     updatedAt (DATETIME)│
                                     └──────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│      RecentSearch        │         │    AnalyticsEvent        │
├──────────────────────────┤         ├──────────────────────────┤
│ PK  id (INT)            │         │ PK  id (INT)            │
│ FK  userId (INT)        │         │     eventType (VARCHAR) │
│     query (VARCHAR)      │         │     eventData (TEXT)     │
│     resultCount (INT)    │         │     userId (INT)         │
│     createdAt (DATETIME) │         │     sessionId (VARCHAR)  │
└──────────────────────────┘         │     ipAddress (VARCHAR)  │
         │                           │     userAgent (TEXT)     │
         │ N:1                       │     createdAt (DATETIME) │
         └──────────────────────────▶└──────────────────────────┘
                User

┌──────────────────────────┐         ┌──────────────────────────┐
│         Report           │         │         Artikel          │
├──────────────────────────┤         ├──────────────────────────┤
│ PK  id (INT)            │         │ PK  id (INT)            │
│ FK  reporterId (INT)    │         │     judul (VARCHAR)      │
│ FK  reportedUserId (INT)│         │     konten (LONGTEXT)    │
│     reason (TEXT)        │         │     gambarURL (TEXT)     │
│     status (ENUM)        │         │     kategori (VARCHAR)   │
│     createdAt (DATETIME) │         │     penulis (VARCHAR)    │
│     updatedAt (DATETIME) │         │     tanggalPublikasi     │
└──────────────────────────┘         │         (DATETIME)       │
         │                           │     views (INT)          │
         │ N:1                       │     createdAt (DATETIME) │
         └──────────────────────────▶│     updatedAt (DATETIME) │
                User                 └──────────────────────────┘
                (reporter & reportedUser)

═══════════════════════════════════════════════════════════════════

LEGEND:
-------
PK  = Primary Key
FK  = Foreign Key  
UK  = Unique Key
1:N = One to Many relationship
N:1 = Many to One relationship
```

## Relationship Details

### 1. User ↔ Komentar (1:N)
- Satu User dapat membuat banyak Komentar
- Setiap Komentar dimiliki oleh satu User
- Cascade Delete: Jika User dihapus, semua Komentar-nya akan ikut terhapus

### 2. User ↔ Favorit (1:N)
- Satu User dapat memiliki banyak Resep Favorit
- Setiap Favorit dimiliki oleh satu User
- Cascade Delete: Jika User dihapus, semua Favorit-nya akan ikut terhapus

### 3. User ↔ RecentSearch (1:N)
- Satu User dapat memiliki banyak riwayat pencarian
- Setiap RecentSearch dimiliki oleh satu User
- Cascade Delete: Jika User dihapus, semua riwayat pencarian-nya akan ikut terhapus

### 4. User ↔ Report (1:N, Self-Referencing)
- Satu User dapat membuat banyak Report (sebagai reporter)
- Satu User dapat menerima banyak Report (sebagai reportedUser)
- Cascade Delete: Jika User dihapus, semua Report terkait akan ikut terhapus

### 5. Resep ↔ Komentar (1:N)
- Satu Resep dapat memiliki banyak Komentar
- Setiap Komentar merujuk pada satu Resep
- Cascade Delete: Jika Resep dihapus, semua Komentar-nya akan ikut terhapus

### 6. Resep ↔ Favorit (1:N)
- Satu Resep dapat difavoritkan oleh banyak User
- Setiap Favorit merujuk pada satu Resep
- Cascade Delete: Jika Resep dihapus, semua Favorit terkait akan ikut terhapus

### 7. Kategori ↔ Resep (1:N)
- Satu Kategori dapat memiliki banyak Resep
- Setiap Resep memiliki satu Kategori

### 8. AnalyticsEvent (Independent)
- Tabel independen untuk mencatat semua event analytics
- Dapat memiliki relasi optional dengan User (userId nullable)

### 9. Artikel (Independent)
- Tabel independen untuk artikel edukatif
- Tidak memiliki foreign key ke tabel lain

## Key Features

### Unique Constraints
1. **User.email** - Email harus unik untuk setiap pengguna
2. **Kategori.nama** - Nama kategori harus unik
3. **Favorit (userId, resepId)** - Satu user tidak bisa memfavoritkan resep yang sama lebih dari sekali

### Indexes
- Indeks dibuat pada kolom-kolom yang sering digunakan untuk query:
  - `Komentar`: resepId, userId
  - `Favorit`: userId, resepId
  - `RecentSearch`: userId, createdAt
  - `Report`: reporterId, reportedUserId, status
  - `AnalyticsEvent`: eventType, createdAt, userId
  - `Artikel`: kategori, tanggalPublikasi
  - `Resep`: kategoriId

### Enums
1. **UserRole**: `anggota`, `admin`
2. **ReportStatus**: `pending`, `reviewed`, `resolved`, `rejected`

## Notes
- Field `bahan` dan `langkahPembuatan` pada tabel Resep disimpan sebagai JSON array dalam format TEXT
- Field `eventData` pada tabel AnalyticsEvent disimpan sebagai JSON object dalam format TEXT
- Semua tabel menggunakan MySQL sebagai database engine
- UUID digunakan sebagai primary key untuk tabel Resep untuk keamanan dan skalabilitas yang lebih baik
