import { Router } from "express";
import UploadController from "../controllers/upload.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// All upload routes require admin authentication
router.post(
  "/image",
  [ authenticateToken, requireAdmin ],
  UploadController.uploadImage
);

router.post(
  "/images",
  [ authenticateToken, requireAdmin ],
  UploadController.uploadMultipleImages
);

export default router;
