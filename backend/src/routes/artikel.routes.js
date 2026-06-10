import { Router } from "express";
import ArtikelController from "../controllers/artikel.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  artikelCreateSchema,
  artikelUpdateSchema,
} from "../validators/artikel.validator.js";

const router = Router();

// Public routes
router.get("/", ArtikelController.getAll);
router.get("/popular", ArtikelController.getPopular);
router.get("/recent", ArtikelController.getRecent);
router.get("/categories", ArtikelController.getCategories);
router.get("/:id", ArtikelController.getById);

// Admin routes
router.post(
  "/",
  [authenticateToken, requireAdmin],
  validate(artikelCreateSchema),
  ArtikelController.create
);

router.put(
  "/:id",
  [authenticateToken, requireAdmin],
  validate(artikelUpdateSchema),
  ArtikelController.update
);

router.delete("/:id", [authenticateToken, requireAdmin], ArtikelController.delete);

export default router;
