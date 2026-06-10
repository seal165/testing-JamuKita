import { Router } from "express";
import { ResepController } from "../controllers/resep.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getResepQuerySchema, searchResepQuerySchema } from "../validators/resep.validator.js";

const router = Router();

// GET /resep - Get all resep (PUBLIC)
router.get("/", validate({ query: getResepQuerySchema }), ResepController.getAll);

// GET /resep/top/weekly - Get top 7 resep minggu ini (PUBLIC)
router.get("/top/weekly", ResepController.getTop7Weekly);

// GET /resep/search - Advanced search (PUBLIC)
router.get("/search", authenticateToken, validate({ query: searchResepQuerySchema }), ResepController.search);

// GET /resep/:id - Get resep by ID (PUBLIC)
router.get("/:id", ResepController.getById);

export default router;
