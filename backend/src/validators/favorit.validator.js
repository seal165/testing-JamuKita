import Joi from "joi";

export const addFavoritSchema = Joi.object({
  resepId: Joi.string().required().messages({
    "string.empty": "Resep ID wajib diisi",
    "any.required": "Resep ID wajib diisi",
  }),
});
