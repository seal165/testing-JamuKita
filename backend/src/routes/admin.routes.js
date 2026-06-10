import { Router } from "express";
import { AdminResepController } from "../controllers/resep.controller.js";
import { AdminUserController } from "../controllers/admin.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createResepSchema, updateResepSchema } from "../validators/resep.validator.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Admin Resep Management
// POST /admin/resep - Create resep
router.post("/resep", validate({ body: createResepSchema }), AdminResepController.create);

// PUT /admin/resep/:id - Update resep
router.put("/resep/:id", validate({ body: updateResepSchema }), AdminResepController.update);

// DELETE /admin/resep/:id - Delete resep
router.delete("/resep/:id", AdminResepController.delete);

// Admin User Management
// GET /admin/pengguna - Get all users
router.get("/pengguna", AdminUserController.getAll);

// DELETE /admin/pengguna/:id - Delete user
router.delete("/pengguna/:id", AdminUserController.delete);

export default router;
