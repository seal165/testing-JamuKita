import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /auth/register - Register (PUBLIC)
router.post("/register", validate({ body: registerSchema }), AuthController.register);

// POST /auth/login - Login (PUBLIC)
router.post("/login", validate({ body: loginSchema }), AuthController.login);

// POST /auth/logout - Logout (ANGGOTA/ADMIN)
router.post("/logout", authenticateToken, AuthController.logout);

export default router;
