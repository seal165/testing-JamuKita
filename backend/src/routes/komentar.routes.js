import { Router } from "express";
import { KomentarController } from "../controllers/komentar.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createKomentarSchema } from "../validators/komentar.validator.js";

const router = Router();

// GET /resep/:id/komentar - Get all comments for resep (PUBLIC)
router.get("/:id/komentar", KomentarController.getByResepId);

// POST /resep/:id/komentar - Add comment (ANGGOTA)
router.post(
  "/:id/komentar",
  authenticateToken,
  validate({ body: createKomentarSchema }),
  KomentarController.create
);

// GET /resep/:id/komentar/me - Get current user's comment (ANGGOTA)
router.get(
  "/:id/komentar/me",
  authenticateToken,
  KomentarController.getUserComment
);

// PUT /resep/:resepId/komentar/:komentarId - Update comment (ANGGOTA)
router.put(
  "/:resepId/komentar/:komentarId",
  authenticateToken,
  validate({ body: createKomentarSchema }),
  KomentarController.update
);

export default router;
