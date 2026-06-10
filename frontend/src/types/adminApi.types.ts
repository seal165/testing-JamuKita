// res.json({
//             success: true,
//             data: {
//                 summary: {
//                     totalVisitors,
//                     averageDaily,
//                     highestVisitors,
//                     lowestVisitors,
//                     period: `${days} days`,
//                 },
//                 dailyVisitors,
//                 topCategories,
//                 topRecipes,
//                 topSearchTerms,
//             },
//         });

/**
 * Admin API Types
 */

export interface AnalyticsResponse {
  summary: {
    totalVisitors: number;
    averageDaily: number;
    highestVisitors: number;
    lowestVisitors: number;
    period: string;
  };
  dailyVisitors: { date: string; visitors: number }[];
  topCategories: { name: string; count: number }[];
  topRecipes: { id: string; title: string; count: number }[];
  topSearchTerms: { term: string; count: number }[];
}

export interface AdminStats extends AnalyticsResponse {}
