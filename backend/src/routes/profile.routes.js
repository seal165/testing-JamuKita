import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { ProfileController } from "../controllers/profile.controller.js";

const router = Router();

// Profil pengguna yang sedang login
router.get("/", authenticateToken, ProfileController.getMe);
router.patch("/", authenticateToken, ProfileController.updateMe);

// Riwayat aktivitas pengguna
router.get("/activity", authenticateToken, ProfileController.getActivity);

// Profil publik user lain (tidak perlu autentikasi)
router.get("/:userId", ProfileController.getPublicProfile);

export default router;