import { Router } from "express";
import { KategoriController } from "../controllers/kategori.controller.js";

const router = Router();

// GET /kategori - Get all categories (PUBLIC)
router.get("/", KategoriController.getAll);

export default router;
