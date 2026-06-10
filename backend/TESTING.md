# Testing Guide - Jamu Kita API

Dokumentasi lengkap untuk menjalankan unit testing pada Jamu Kita API menggunakan Mocha, Chai, dan Supertest.

## 📋 Testing Stack

- **Mocha** - Test runner framework
- **Chai** - Assertion library (BDD/TDD styles)
- **Supertest** - HTTP assertion library
- **Prisma** - Database testing dengan test database

## 🚀 Setup Testing Environment

### Option 1: SQLite (Recommended for CI/CD)

**Fastest and easiest - no database server needed!**

```bash
# 1. Copy .env.test.example
cp .env.test.example .env.test

# 2. Use SQLite in-memory (already configured)
# DATABASE_URL="file::memory:?socket_timeout=10&connection_limit=1"

# 3. Push schema
npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma

# 4. Run tests
npm test
```

**Perfect for:**
- ✅ CI/CD environments (GitHub Actions, GitLab CI, etc.)
- ✅ Quick local testing
- ✅ When you don't have MySQL

### Option 2: MySQL (Production-like Testing)

**Use if you want to test against real MySQL:**

```bash
# 1. Create test database
mysql -u root -p
CREATE DATABASE jamukita_test;
exit;

# 2. Configure .env.test
DATABASE_URL="mysql://root:password@localhost:3306/jamukita_test"
JWT_SECRET="test_jwt_secret"
PORT=3001
NODE_ENV=test

# 3. Run migrations
DATABASE_URL="mysql://root:password@localhost:3306/jamukita_test" npx prisma migrate dev

# 4. Run tests
npm test
```

**⚠️ PENTING:** Gunakan database terpisah untuk testing!

📖 **Detailed CI/CD Setup:** See [CI_CD_TESTING.md](./CI_CD_TESTING.md)

## 🧪 Running Tests

### Run All Tests

```bash
# Standard run
npm test

# With SQLite (CI/CD mode)
npm run test:sqlite

# With watch mode
npm run test:watch
```

### Run Specific Test File

```bash
npx mocha tests/auth.test.js
npx mocha tests/resep.test.js
npx mocha tests/validation.test.js
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage (jika nyc terinstall)

```bash
npm run test:coverage
```

## 📁 Test Structure

```
tests/
├── setup.js              # Test setup & helper functions
├── auth.test.js          # Auth endpoints (register, login, logout)
├── resep.test.js         # Resep endpoints (CRUD, search)
├── kategori.test.js      # Kategori endpoints
├── komentar.test.js      # Komentar & rating endpoints
├── favorit.test.js       # Favorit management endpoints
└── admin.test.js         # Admin endpoints (user & resep management)
```

## 📝 Test Coverage

### Auth Tests (auth.test.js)
✅ **POST /v1/auth/register**
- Register new user successfully
- Fail with duplicate email
- Fail with invalid email format
- Fail with short password
- Fail with missing fields

✅ **POST /v1/auth/login**
- Login with correct credentials
- Fail with incorrect password
- Fail with non-existent email
- Fail with invalid format
- Fail with missing credentials

✅ **POST /v1/auth/logout**
- Logout successfully with valid token
- Fail without authorization
- Fail with invalid token

**Total: 13 tests**

---

### Resep Tests (resep.test.js)
✅ **GET /v1/resep**
- Get all resep with pagination
- Filter by keyword
- Filter by kategori
- Custom pagination

✅ **GET /v1/resep/search**
- Search by keyword
- Filter by kategoriId
- Filter by minRating
- Sort by rating
- Validation errors

✅ **GET /v1/resep/:id**
- Get detail by ID
- 404 for non-existent

✅ **POST /v1/admin/resep**
- Create as admin
- Fail without auth
- Fail with anggota token
- Fail with invalid kategoriId
- Fail with missing fields

✅ **PUT /v1/admin/resep/:id**
- Update as admin
- Fail without auth
- Fail with anggota token
- 404 for non-existent

✅ **DELETE /v1/admin/resep/:id**
- Delete as admin
- Fail without auth
- Fail with anggota token

**Total: 20 tests**

---

### Kategori Tests (kategori.test.js)
✅ **GET /v1/kategori**
- Get all categories
- Correct structure
- Include test data

**Total: 3 tests**

---

### Komentar Tests (komentar.test.js)
✅ **GET /v1/resep/:id/komentar**
- Get all komentar
- Correct structure
- 404 for non-existent resep

✅ **POST /v1/resep/:id/komentar**
- Create komentar successfully
- Fail without auth
- Fail with short comment
- Fail with invalid rating (> 5)
- Fail with invalid rating (< 1)
- Fail with missing fields
- Fail for non-existent resep
- Fail with duplicate comment

**Total: 11 tests**

---

### Favorit Tests (favorit.test.js)
✅ **GET /v1/favorit**
- Get empty list initially
- Fail without auth
- Get list after adding
- Correct structure

✅ **POST /v1/favorit**
- Add to favorit successfully
- Fail without auth
- Fail with missing resepId
- Fail with non-existent resep
- Fail with duplicate

✅ **DELETE /v1/favorit/:resep_id**
- Remove successfully
- Fail without auth
- 404 for non-existent
- Cannot delete other user's favorit

**Total: 13 tests**

---

### Admin Tests (admin.test.js)
✅ **GET /v1/admin/pengguna**
- Get all anggota
- Correct structure
- Only return anggota (not admin)
- Fail without auth
- Fail with anggota token

✅ **DELETE /v1/admin/pengguna/:id**
- Delete anggota successfully
- Fail without auth
- Fail with anggota token
- 404 for non-existent
- Fail when deleting admin
- Fail when deleting self

✅ **Admin Resep Management**
- Validate kategoriId exists
- Trim and sanitize input

**Total: 13 tests**

---

## 📊 Summary

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Auth | 13 | Registration, Login, Logout |
| Resep | 20 | CRUD, Search, Pagination, Filters |
| Kategori | 3 | Get all categories |
| Komentar | 11 | Create, Read, Validations |
| Favorit | 13 | Add, Remove, List favorit |
| Admin | 13 | User & Resep management |
| **TOTAL** | **73** | **All endpoints covered** |

## 🔧 Test Helper Functions

### `setup.js`

```javascript
// Clean database before tests
await cleanDatabase();

// Seed test data
const testData = await seedTestData();

// Close database connection
await closeDatabase();
```

### Test Data Created:
- 1 Admin user (admin@test.com)
- 1 Anggota user (user@test.com)
- 2 Kategori (Pegal Linu, Flu & Batuk)
- 2 Resep (Jamu Beras Kencur, Wedang Jahe)

## 🎯 Best Practices

### 1. Isolate Tests
Setiap test file membersihkan database sebelum dan sesudah test:

```javascript
before(async () => {
  await cleanDatabase();
  testData = await seedTestData();
});

after(async () => {
  await cleanDatabase();
  await closeDatabase();
});
```

### 2. Use Descriptive Test Names

```javascript
it("should fail with invalid email format", async () => {
  // Test code
});
```

### 3. Test Both Success and Error Cases

```javascript
// Success case
it("should create komentar successfully", ...);

// Error cases
it("should fail without authorization", ...);
it("should fail with invalid rating", ...);
```

### 4. Assert Expected Behavior

```javascript
expect(res.status).to.equal(200);
expect(res.body).to.have.property("success", true);
expect(res.body.data).to.be.an("array");
```

## 🐛 Debugging Tests

### Run Single Test

```bash
npx mocha tests/auth.test.js --grep "should register a new user"
```

### Enable Verbose Output

```bash
npm test -- --reporter spec
```

### Check Test Database

```bash
mysql -u root -p
USE jamukita_test;
SHOW TABLES;
SELECT * FROM User;
```

## 🚨 Common Issues

### Issue: "Cannot find module 'app.js'"
**Solution:** Make sure `src/app.js` exports the Express app:
```javascript
export default app;
```

### Issue: "Database connection error"
**Solution:** Check `.env.test` configuration dan pastikan database test sudah dibuat.

### Issue: "Tests timeout"
**Solution:** Increase timeout di `.mocharc.json`:
```json
{
  "timeout": 10000
}
```

### Issue: "Token invalid errors"
**Solution:** Pastikan JWT_SECRET di `.env.test` match dengan yang digunakan app.

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: jamukita_test
        ports:
          - 3306:3306
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run migrations
        run: npx prisma migrate deploy
      - name: Run tests
        run: npm test
```

## 📚 Additional Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Styles](https://www.chaijs.com/guide/styles/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

## ✅ Pre-deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Test database configured correctly
- [ ] No hardcoded credentials in test files
- [ ] Test coverage > 80% (if using coverage tool)
- [ ] CI/CD pipeline running tests
- [ ] Documentation updated

---

**Happy Testing! 🧪✨**
