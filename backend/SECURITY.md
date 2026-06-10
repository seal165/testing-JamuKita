# Security Measures - Jamu Kita API

Dokumen ini menjelaskan implementasi keamanan pada Jamu Kita API untuk melindungi dari berbagai jenis serangan.

## 🔒 SQL Injection Protection

### ✅ Prisma ORM
Backend ini menggunakan **Prisma ORM** yang secara otomatis memberikan perlindungan terhadap SQL Injection:

- **Parameterized Queries**: Semua query menggunakan prepared statements
- **No Raw SQL**: Tidak ada penggunaan `$queryRaw` atau `$executeRaw` yang tidak aman
- **Type-Safe**: Query builder dengan TypeScript type safety

### ✅ Contoh Implementasi Aman

```javascript
// ❌ TIDAK AMAN (jika menggunakan raw SQL)
const query = `SELECT * FROM resep WHERE judul = '${userInput}'`;

// ✅ AMAN (menggunakan Prisma)
await prisma.resep.findMany({
  where: {
    judul: { contains: userInput, mode: "insensitive" }
  }
});
```

## 🛡️ Input Validation & Sanitization

### ✅ Joi Validation
Semua input divalidasi menggunakan **Joi** schema validation:

#### String Sanitization
- **`.trim()`**: Menghapus whitespace di awal dan akhir
- **`.lowercase()`**: Normalisasi email ke lowercase
- **Min/Max Length**: Membatasi panjang input
- **Pattern Validation**: Email, URL, dll.

#### Number Validation
- **`.integer()`**: Memastikan tipe integer
- **`.positive()`**: Hanya angka positif
- **`.min()` / `.max()`**: Batasan nilai

#### Array Validation
- **`.items()`**: Validasi setiap item dalam array
- **`.min()`**: Minimal jumlah item
- **Type checking**: Memastikan tipe data konsisten

### ✅ Contoh Validator

```javascript
// src/validators/resep.validator.js
export const createResepSchema = Joi.object({
  judul: Joi.string().trim().min(3).max(255).required(),
  deskripsi: Joi.string().trim().min(10).required(),
  gambarURL: Joi.string().uri().trim().allow(null, "").optional(),
  bahan: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  kategoriId: Joi.number().integer().positive().required(),
});
```

## 🔐 Authentication & Authorization

### ✅ JWT (JSON Web Token)
- **Password Hashing**: Menggunakan bcryptjs dengan salt rounds 10
- **Token-based Auth**: JWT dengan secret key
- **Role-based Access**: Pemisahan anggota dan admin

### ✅ Middleware Protection

```javascript
// Autentikasi token
authenticateToken(req, res, next)

// Otorisasi admin
requireAdmin(req, res, next)
```

### ✅ Protected Routes
```javascript
// Hanya admin yang bisa akses
router.post('/admin/resep', authenticateToken, requireAdmin, AdminResepController.create);

// Hanya user terautentikasi
router.post('/favorit', authenticateToken, FavoritController.add);

// Public access
router.get('/resep', ResepController.getAll);
```

## 🚫 XSS (Cross-Site Scripting) Protection

### ✅ Content-Type Enforcement
- Response header `Content-Type: application/json`
- Tidak ada HTML rendering dari user input

### ✅ Input Sanitization
- Semua string input di-trim
- Validasi format (email, URL)
- Array items divalidasi individual

### ✅ Safe Data Storage
- Data disimpan as-is di database
- Escaping dilakukan di frontend saat rendering
- JSON response aman dari injection

## 🔒 NoSQL Injection Protection

Meskipun menggunakan SQL database (MySQL), prinsip yang sama diterapkan:
- Tidak ada dynamic query building dari user input
- Semua filter menggunakan Prisma where clause
- Parameterized queries untuk semua operasi

## 🛡️ Additional Security Measures

### ✅ CORS Configuration
```javascript
// src/app.js
app.use(cors());
```

### ✅ Error Handling
- Error messages tidak mengekspos detail sistem
- Custom error handling untuk production
- Sensitive data tidak di-log

### ✅ Rate Limiting (Recommended)
**TODO**: Implementasi rate limiting untuk mencegah brute force:
```javascript
// Tambahkan express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100 // limit 100 requests per windowMs
});

app.use('/v1/', limiter);
```

## 📋 Security Checklist

- [x] SQL Injection - Protected (Prisma ORM)
- [x] Input Validation - Protected (Joi)
- [x] XSS - Protected (JSON API + sanitization)
- [x] Authentication - Protected (JWT + bcrypt)
- [x] Authorization - Protected (Role-based)
- [x] CORS - Configured
- [x] Error Handling - Safe messages
- [ ] Rate Limiting - Recommended to implement
- [ ] HTTPS - Required in production
- [ ] Security Headers - Recommended (helmet.js)

## 🔐 Password Security

### ✅ Hashing Implementation
```javascript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.password);
```

### ✅ Password Requirements
- Minimal 6 karakter (dapat ditingkatkan)
- Disimpan dalam bentuk hash (bcrypt)
- Tidak pernah di-return dalam response

## 🚀 Production Security Recommendations

### 1. Environment Variables
```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/jamukita"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3000
NODE_ENV=production
```

### 2. HTTPS
- Gunakan HTTPS di production
- Redirect HTTP ke HTTPS
- HSTS headers

### 3. Security Headers (helmet.js)
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 4. Input Size Limits
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 5. Logging & Monitoring
- Log semua authentication attempts
- Monitor untuk suspicious activities
- Alert untuk failed login attempts

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Security](https://jwt.io/introduction)

## 🔄 Regular Security Audits

### Rekomendasi:
1. Update dependencies secara berkala (`npm audit`)
2. Review kode untuk security vulnerabilities
3. Penetration testing
4. Security code review
5. Monitor CVE untuk dependencies

## 📞 Security Issues

Jika menemukan security vulnerability, silakan laporkan ke:
- Email: security@jamukita.com
- Jangan publish security issue di public repository
