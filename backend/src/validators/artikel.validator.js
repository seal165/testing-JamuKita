import Joi from "joi";

const artikelCreateSchema = Joi.object({
  judul: Joi.string().min(5).max(255).required().messages({
    "string.empty": "Judul tidak boleh kosong",
    "string.min": "Judul minimal 5 karakter",
    "string.max": "Judul maksimal 255 karakter",
    "any.required": "Judul wajib diisi",
  }),
  konten: Joi.string().min(50).required().messages({
    "string.empty": "Konten tidak boleh kosong",
    "string.min": "Konten minimal 50 karakter",
    "any.required": "Konten wajib diisi",
  }),
  gambarURL: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "Gambar URL harus berupa URL yang valid",
  }),
  kategori: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Kategori tidak boleh kosong",
    "string.min": "Kategori minimal 2 karakter",
    "string.max": "Kategori maksimal 100 karakter",
    "any.required": "Kategori wajib diisi",
  }),
  penulis: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Penulis tidak boleh kosong",
    "string.min": "Penulis minimal 2 karakter",
    "string.max": "Penulis maksimal 100 karakter",
    "any.required": "Penulis wajib diisi",
  }),
  tanggalPublikasi: Joi.date().optional().messages({
    "date.base": "Tanggal publikasi harus berupa tanggal yang valid",
  }),
});

const artikelUpdateSchema = Joi.object({
  judul: Joi.string().min(5).max(255).optional().messages({
    "string.empty": "Judul tidak boleh kosong",
    "string.min": "Judul minimal 5 karakter",
    "string.max": "Judul maksimal 255 karakter",
  }),
  konten: Joi.string().min(50).optional().messages({
    "string.empty": "Konten tidak boleh kosong",
    "string.min": "Konten minimal 50 karakter",
  }),
  gambarURL: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "Gambar URL harus berupa URL yang valid",
  }),
  kategori: Joi.string().min(2).max(100).optional().messages({
    "string.empty": "Kategori tidak boleh kosong",
    "string.min": "Kategori minimal 2 karakter",
    "string.max": "Kategori maksimal 100 karakter",
  }),
  penulis: Joi.string().min(2).max(100).optional().messages({
    "string.empty": "Penulis tidak boleh kosong",
    "string.min": "Penulis minimal 2 karakter",
    "string.max": "Penulis maksimal 100 karakter",
  }),
  tanggalPublikasi: Joi.date().optional().messages({
    "date.base": "Tanggal publikasi harus berupa tanggal yang valid",
  }),
});

export { artikelCreateSchema, artikelUpdateSchema };
