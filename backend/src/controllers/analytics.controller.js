import {
  logAnalyticsEvent,
  getVisitorStats,
  getMostSearchedCategories,
  getMostSearchedRecipes,
  getMostSearchedTerms,
} from "../models/analytics.models.js";
import { ResponseError } from "../models/error.models.js";

// Log an analytics event (can be called from any route)
export const logEvent = async (req, res, next) => {
  try {
    const { eventType, eventData } = req.body;

    if (!eventType) {
      throw new ResponseError(400, "Event type is required");
    }

    await logAnalyticsEvent(req, eventType, eventData);

    res.status(201).json({
      success: true,
      message: "Event logged successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get comprehensive statistics for admin dashboard
export const getStatistics = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;

    // Get visitor statistics
    const visitorStats = await getVisitorStats(days);

    // Calculate metrics
    const dailyVisitors = visitorStats.dailyVisitors.map((v) => ({
      date: v.date,
      visitors: Number(v.visitors),
    }));

    const visitorCounts = dailyVisitors.map((d) => d.visitors);
    const totalVisitors = visitorStats.totalVisitors;
    const averageDaily = Math.round(totalVisitors / days);
    const highestVisitors = Math.max(...visitorCounts, 0);
    const lowestVisitors =
      Math.min(...visitorCounts.filter((v) => v > 0), 0) || 0;

    // Get most searched data
    const topCategories = await getMostSearchedCategories(5);
    const topRecipes = await getMostSearchedRecipes(5);
    const topSearchTerms = (await getMostSearchedTerms(5)).map((t) => ({
      query: t.query,
      count: Number(t.count), // or t.count.toString()
    }));

    res.json(
      {
        success: true,
        data: {
          summary: {
            totalVisitors,
            averageDaily,
            highestVisitors,
            lowestVisitors,
            period: `${days} days`,
          },
          dailyVisitors,
          topCategories,
          topRecipes,
          topSearchTerms,
        },
      },
      (key, value) => (typeof value === "bigint" ? value.toString() : value)
    );
  } catch (error) {
    next(error);
  }
};
