# Code Organization: Types Refactoring

**Tanggal**: 8 Desember 2025
**Status**: ✅ Completed

## 📋 Overview

Melakukan refactoring untuk memisahkan interface/types dari file api.ts ke dalam folder terpisah `src/types/` untuk meningkatkan maintainability dan mengikuti best practice TypeScript.

## 🎯 Tujuan

1. **Separation of Concerns**: Memisahkan definisi types dari implementation code
2. **Better Organization**: Mengelompokkan types berdasarkan domain (auth, resep, activity, dll)
3. **Reusability**: Types dapat digunakan di mana saja tanpa import logic
4. **Type Safety**: Konsistensi tipe di seluruh aplikasi
5. **Clean Code**: File lebih mudah dibaca dan maintain

## 📁 Struktur Baru

```
frontend/src/types/
├── index.ts              # Central export (gunakan ini untuk import)
├── api.types.ts          # ApiResponse, Pagination
├── auth.types.ts         # User, AuthResponse, RegisterData, LoginData
├── kategori.types.ts     # Kategori
├── resep.types.ts        # Resep, ResepDetail, ResepListResponse, dll
├── activity.types.ts     # ActivityHistory, ActivityFavoritesItem, dll
├── search.types.ts       # RecentSearchItem, SaveRecentSearchData
└── README.md             # Dokumentasi penggunaan types
```

## 🔧 Perubahan Files

### Files Baru Dibuat

1. **src/types/api.types.ts**
   - `ApiResponse<T>` - Generic response wrapper
   - `Pagination` - Info pagination

2. **src/types/auth.types.ts**
   - `User` - Data user
   - `AuthResponse` - Response login/register
   - `RegisterData` - Request register
   - `LoginData` - Request login

3. **src/types/kategori.types.ts**
   - `Kategori` - Data kategori

4. **src/types/resep.types.ts**
   - `Resep` - Data resep
   - `ResepDetail` - Data resep lengkap
   - `ResepListResponse` - Response list dengan pagination
   - `SearchResepParams` - Parameter search
   - `GetResepParams` - Parameter get list

5. **src/types/activity.types.ts**
   - `ActivityFavoritesItem` - Item favorit
   - `ActivityCommentsItem` - Item komentar
   - `ActivityHistory` - Gabungan history

6. **src/types/search.types.ts**
   - `RecentSearchItem` - Item recent search
   - `SaveRecentSearchData` - Data save search

7. **src/types/index.ts**
   - Central export untuk semua types

8. **src/types/README.md**
   - Dokumentasi penggunaan types folder

### Files Yang Diubah

#### 1. src/lib/api.ts ⚡
**Sebelum**: 361 lines (interfaces + implementation)
**Sesudah**: ~280 lines (hanya implementation)

```typescript
// ❌ Sebelum
export interface User {
  id: number;
  nama: string;
  email: string;
  role: "anggota" | "admin";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  // ... methods
}

// ✅ Sesudah
import type {
  ApiResponse,
  User,
  AuthResponse,
  RegisterData,
  LoginData,
  // ... dll
} from "@/types";

class ApiService {
  // ... methods
}
```

**Perubahan**:
- Hapus semua interface definitions (80 lines)
- Tambah import dari `@/types`
- Update method signatures menggunakan imported types
- `getResepList(params?: GetResepParams)`
- `searchResep(params?: SearchResepParams)`
- `getRecentSearches(): Promise<ApiResponse<RecentSearchItem[]>>`

#### 2. src/lib/recentSearch.ts
**Perubahan**:
```typescript
// ❌ Sebelum
export interface RecentSearchItem {
  id: number;
  userId: number;
  query: string;
  resultCount: number;
  createdAt: string;
}

// ✅ Sesudah
import type { RecentSearchItem } from "@/types";
export type { RecentSearchItem }; // Re-export untuk backward compatibility
```

#### 3. Component Files (9 files updated)

**Files Updated**:
- `app/search/page.tsx`
- `app/resep/[id]/page.tsx`
- `app/profile/page.tsx`
- `components/profile/SavedList.tsx`
- `components/profile/ReviewsList.tsx`
- `components/profile/ActivityCard.tsx`
- `components/profile/AccountSettings.tsx`
- `components/dashboard/ResepGridPanel.tsx`
- `components/dashboard/ResepCard.tsx`

**Pattern Perubahan**:
```typescript
// ❌ Sebelum
import { apiService, Resep, User } from "@/lib/api";

// ✅ Sesudah
import { apiService } from "@/lib/api";
import type { Resep, User } from "@/types";
```

#### 4. Components dengan Inline Interface (3 files updated)
- `components/dashboard/Top7Carousel.tsx`
- `components/dashboard/Top7Carousellanding.tsx`
- `components/dashboard/RecentSearchCarousel.tsx`

**Perubahan**:
```typescript
// ❌ Sebelum
interface Resep {
  id: string;
  judul: string;
  // ... lengkap
}

// ✅ Sesudah
import type { Resep } from "@/types";
```

#### 5. app/search/page.tsx (Cleanup)
**Perubahan**:
- Hapus duplicate interface `Resep` (sudah import dari types)
- Hapus duplicate interface `Kategori` (sudah import dari types)
- Retain local interface `SearchFilters` (specific to this page)

## 📊 Metrics

### Before
- **api.ts**: 361 lines
- **Interfaces**: Mixed dengan implementation
- **Duplicate definitions**: 3+ files dengan interface Resep

### After
- **api.ts**: ~280 lines (pure logic)
- **Types folder**: 7 organized files
- **Duplicate definitions**: 0 (centralized)
- **Lines reduced**: ~100+ lines (removed duplicates)

## ✅ Validation

### Type Checking
```bash
# Jalankan TypeScript compiler untuk validasi
npm run build
```

### Import Testing
Semua imports berfungsi dengan baik:
```typescript
import type { Resep, User, ApiResponse } from "@/types";
import { apiService } from "@/lib/api";
```

## 📝 Usage Guidelines

### ✅ Best Practices

1. **Import dari index.ts**:
```typescript
import type { User, Resep, ApiResponse } from "@/types";
```

2. **Gunakan `type` keyword**:
```typescript
import type { User } from "@/types"; // ✅ Good
import { User } from "@/types";      // ❌ Avoid
```

3. **Backward Compatibility**:
```typescript
// Masih bisa digunakan (re-exported)
import type { RecentSearchItem } from "@/lib/recentSearch";
```

### ❌ Avoid

1. **Direct file imports**:
```typescript
import { User } from "@/types/auth.types"; // ❌
```

2. **Mixing types and values**:
```typescript
import { apiService, Resep } from "@/lib/api"; // ❌
```

## 🚀 Benefits

1. **Better Type Safety**: Consistent types across app
2. **Easier Maintenance**: Single source of truth for types
3. **Improved DX**: Clear separation, easier to find types
4. **Reduced Duplication**: No more duplicate interface definitions
5. **Better IDE Support**: Autocomplete works better with organized types
6. **Tree Shaking**: Unused types removed in production build

## 🔄 Migration Path

Untuk file lain yang masih menggunakan inline interfaces:

1. Pindahkan interface ke file yang sesuai di `src/types/`
2. Export dari `src/types/index.ts`
3. Update import di file yang menggunakan
4. Hapus inline interface

## 📚 References

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [React TypeScript Cheatsheet - Types](https://react-typescript-cheatsheet.netlify.app/)
- Best Practice: Separate types from implementation code

## 🎉 Completed

✅ Semua types terorganisir dengan baik
✅ Tidak ada duplicate definitions
✅ Import path konsisten menggunakan `@/types`
✅ Documentation lengkap
✅ Backward compatibility terjaga
