import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createReportSchema } from "../validators/report.validator.js";

const router = Router();

// User routes
router.post("/", authenticateToken, validate({ body: createReportSchema }), ReportController.create);

// Admin routes
router.get("/", [authenticateToken, requireAdmin], ReportController.getAll);
router.post("/:id/ban", [authenticateToken, requireAdmin], ReportController.banUser);
router.post("/:id/reject", [authenticateToken, requireAdmin], ReportController.reject);

export default router;
