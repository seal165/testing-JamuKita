import { Router } from "express";
import { RecentSearchController } from "../controllers/recentSearch.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/recent-search - Get user's recent searches
router.get("/", RecentSearchController.getRecentSearches);

// POST /api/recent-search - Save a new search
router.post("/", RecentSearchController.saveSearch);

// DELETE /api/recent-search/:id - Delete one search
router.delete("/:id", RecentSearchController.deleteSearch);

// DELETE /api/recent-search - Clear all searches
router.delete("/", RecentSearchController.clearAllSearches);

export default router;
