import Joi from "joi";

export const createResepSchema = Joi.object({
  judul: Joi.string().min(3).max(255).trim().required().messages({
    "string.empty": "Judul resep wajib diisi",
    "string.min": "Judul resep minimal 3 karakter",
    "string.max": "Judul resep maksimal 255 karakter",
    "any.required": "Judul resep wajib diisi",
  }),
  deskripsi: Joi.string().min(10).trim().required().messages({
    "string.empty": "Deskripsi resep wajib diisi",
    "string.min": "Deskripsi resep minimal 10 karakter",
    "any.required": "Deskripsi resep wajib diisi",
  }),
  gambarURL: Joi.string().uri().trim().allow(null, "").optional().messages({
    "string.uri": "Gambar URL harus berupa URL yang valid",
  }),
  sumberLiteratur: Joi.string().trim().allow(null, "").optional(),
  kategoriId: Joi.number().integer().positive().required().messages({
    "number.base": "Kategori ID harus berupa angka",
    "number.positive": "Kategori ID harus berupa angka positif",
    "any.required": "Kategori ID wajib diisi",
  }),
  bahan: Joi.array().items(Joi.string().trim().min(1)).min(1).required().messages({
    "array.base": "Bahan harus berupa array",
    "array.min": "Minimal harus ada 1 bahan",
    "any.required": "Bahan wajib diisi",
  }),
  langkahPembuatan: Joi.array().items(Joi.string().trim().min(1)).min(1).required().messages({
    "array.base": "Langkah pembuatan harus berupa array",
    "array.min": "Minimal harus ada 1 langkah pembuatan",
    "any.required": "Langkah pembuatan wajib diisi",
  }),
});

export const updateResepSchema = Joi.object({
  judul: Joi.string().min(3).max(255).trim().optional().messages({
    "string.min": "Judul resep minimal 3 karakter",
    "string.max": "Judul resep maksimal 255 karakter",
  }),
  deskripsi: Joi.string().min(10).trim().optional().messages({
    "string.min": "Deskripsi resep minimal 10 karakter",
  }),
  gambarURL: Joi.string().uri().trim().allow(null, "").optional().messages({
    "string.uri": "Gambar URL harus berupa URL yang valid",
  }),
  sumberLiteratur: Joi.string().trim().allow(null, "").optional(),
  kategoriId: Joi.number().integer().positive().optional().messages({
    "number.base": "Kategori ID harus berupa angka",
    "number.positive": "Kategori ID harus berupa angka positif",
  }),
  bahan: Joi.array().items(Joi.string().trim().min(1)).min(1).optional().messages({
    "array.base": "Bahan harus berupa array",
    "array.min": "Minimal harus ada 1 bahan",
  }),
  langkahPembuatan: Joi.array().items(Joi.string().trim().min(1)).min(1).optional().messages({
    "array.base": "Langkah pembuatan harus berupa array",
    "array.min": "Minimal harus ada 1 langkah pembuatan",
  }),
}).min(1).messages({
  "object.min": "Minimal harus ada 1 field yang diupdate",
});

export const getResepQuerySchema = Joi.object({
  q: Joi.string().trim().optional().allow(""),
  kategori: Joi.string().trim().optional().allow(""),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
});

export const searchResepQuerySchema = Joi.object({
  keyword: Joi.string().trim().min(2).optional().allow("").messages({
    "string.min": "Kata kunci pencarian minimal 2 karakter",
  }),
  kategoriId: Joi.number().integer().positive().optional().messages({
    "number.base": "Kategori ID harus berupa angka",
    "number.positive": "Kategori ID harus berupa angka positif",
  }),
  minRating: Joi.number().min(0).max(5).optional().messages({
    "number.base": "Rating minimal harus berupa angka",
    "number.min": "Rating minimal tidak boleh kurang dari 0",
    "number.max": "Rating minimal tidak boleh lebih dari 5",
  }),
  sortBy: Joi.string().valid("createdAt", "rating", "judul").optional().default("createdAt").messages({
    "any.only": "Sort by hanya boleh: createdAt, rating, atau judul",
  }),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc").messages({
    "any.only": "Sort order hanya boleh: asc atau desc",
  }),
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page harus berupa angka",
    "number.min": "Page minimal 1",
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    "number.base": "Limit harus berupa angka",
    "number.min": "Limit minimal 1",
    "number.max": "Limit maksimal 100",
  }),
});
