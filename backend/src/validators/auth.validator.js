import Joi from "joi";

export const registerSchema = Joi.object({
  nama: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Nama wajib diisi",
    "string.min": "Nama minimal 3 karakter",
    "string.max": "Nama maksimal 100 karakter",
    "any.required": "Nama wajib diisi",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": "Email wajib diisi",
    "string.email": "Email harus valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password wajib diisi",
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": "Email wajib diisi",
    "string.email": "Email harus valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password wajib diisi",
    "any.required": "Password wajib diisi",
  }),
});
