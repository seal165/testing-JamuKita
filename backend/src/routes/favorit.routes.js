import { Router } from "express";
import { FavoritController } from "../controllers/favorit.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { addFavoritSchema } from "../validators/favorit.validator.js";

const router = Router();

// GET /favorit - Get all favorites (ANGGOTA)
router.get("/", authenticateToken, FavoritController.getAll);

// POST /favorit - Add to favorites (ANGGOTA)
router.post(
  "/",
  authenticateToken,
  validate({ body: addFavoritSchema }),
  FavoritController.create
);

// DELETE /favorit/:resep_id - Remove from favorites (ANGGOTA)
router.delete("/:resep_id", authenticateToken, FavoritController.delete);

export default router;
