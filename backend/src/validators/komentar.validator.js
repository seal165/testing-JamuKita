import Joi from "joi";

export const createKomentarSchema = Joi.object({
  isiKomentar: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "Isi komentar wajib diisi",
    "string.min": "Isi komentar minimal 5 karakter",
    "string.max": "Isi komentar maksimal 1000 karakter",
    "any.required": "Isi komentar wajib diisi",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating harus berupa angka",
    "number.min": "Rating minimal 1",
    "number.max": "Rating maksimal 5",
    "any.required": "Rating wajib diisi",
  }),
});
