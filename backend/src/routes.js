/**
 * Routes configuration for Jamu Kita API
 * Base URL: /v1
 */
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import resepRoutes from "./routes/resep.routes.js";
import kategoriRoutes from "./routes/kategori.routes.js";
import komentarRoutes from "./routes/komentar.routes.js";
import favoritRoutes from "./routes/favorit.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import recentSearchRoutes from "./routes/recentSearch.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import reportRoutes from "./routes/report.routes.js";
import artikelRoutes from "./routes/artikel.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
router.use("/resep", komentarRoutes); // /resep/:id/komentar
router.use("/resep", resepRoutes);
router.use("/kategori", kategoriRoutes);

// Protected routes (Anggota)
router.use("/favorit", favoritRoutes);
router.use("/me", profileRoutes);
router.use("/recent-search", recentSearchRoutes);

// Admin routes
router.use("/admin", adminRoutes);

// Analytics routes
router.use("/analytics", analyticsRoutes);

// Report routes
router.use("/report", reportRoutes);

// Artikel routes
router.use("/artikel", artikelRoutes);

// Upload routes (Admin only)
router.use("/upload", uploadRoutes);

export default router;
