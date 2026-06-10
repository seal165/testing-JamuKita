import { Router } from "express";
import {
  logEvent,
  getStatistics,
} from "../controllers/analytics.controller.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Public endpoint to log analytics events
router.post("/log", logEvent);

// Admin-only endpoint to get statistics
router.get("/statistics", [authenticateToken, requireAdmin], getStatistics);

export default router;
