# Types Directory

Folder ini berisi semua definisi tipe TypeScript yang digunakan di aplikasi.

## Struktur File

### `api.types.ts`
Tipe-tipe umum untuk API response dan pagination:
- `ApiResponse<T>` - Generic response wrapper
- `Pagination` - Info pagination

### `auth.types.ts`
Tipe-tipe terkait autentikasi:
- `User` - Data user
- `AuthResponse` - Response login/register
- `RegisterData` - Request data register
- `LoginData` - Request data login

### `kategori.types.ts`
Tipe-tipe kategori:
- `Kategori` - Data kategori resep

### `resep.types.ts`
Tipe-tipe resep:
- `Resep` - Data resep
- `ResepDetail` - Data resep lengkap
- `ResepListResponse` - Response list resep dengan pagination
- `SearchResepParams` - Parameter search resep
- `GetResepParams` - Parameter get resep list

### `activity.types.ts`
Tipe-tipe aktivitas user:
- `ActivityFavoritesItem` - Item favorit
- `ActivityCommentsItem` - Item komentar
- `ActivityHistory` - Gabungan favorit & komentar

### `search.types.ts`
Tipe-tipe pencarian:
- `RecentSearchItem` - Item recent search
- `SaveRecentSearchData` - Data untuk save recent search

### `index.ts`
Central export untuk semua tipe. **Gunakan file ini untuk import**:

```typescript
// ✅ Baik - Import dari index
import type { User, Resep, ApiResponse } from "@/types";

// ❌ Tidak disarankan - Import langsung
import type { User } from "@/types/auth.types";
```

## Penggunaan

Selalu gunakan `type` keyword saat import:
```typescript
import type { Resep, User } from "@/types";
```

Atau gunakan `import type` untuk import seluruh namespace:
```typescript
import type * as Types from "@/types";
```

## Manfaat Pemisahan

1. **Maintainability** - Mudah menemukan dan update tipe
2. **Reusability** - Tipe bisa digunakan di mana saja
3. **Type Safety** - Konsistensi tipe di seluruh aplikasi
4. **Clean Code** - Memisahkan concern antara tipe dan logic
5. **Tree Shaking** - TypeScript akan remove unused types di production
