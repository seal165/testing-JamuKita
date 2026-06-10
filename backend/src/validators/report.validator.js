import Joi from "joi";

export const createReportSchema = Joi.object({
  reportedUserId: Joi.number().integer().positive().required().messages({
    "number.base": "ID pengguna yang dilaporkan harus berupa angka",
    "number.positive": "ID pengguna yang dilaporkan harus positif",
    "any.required": "ID pengguna yang dilaporkan wajib diisi",
  }),
  reason: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Alasan laporan wajib diisi",
    "string.min": "Alasan laporan minimal 10 karakter",
    "string.max": "Alasan laporan maksimal 500 karakter",
    "any.required": "Alasan laporan wajib diisi",
  }),
});
