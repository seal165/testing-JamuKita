import prisma from "../lib/prisma.js";

export const logAnalyticsEvent = async (req, eventType, eventData = null) => {
    try {
        const userId = req.user?.id || null;
        const sessionId = req.sessionID || req.headers['x-session-id'] || null;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await prisma.analyticsEvent.create({
            data: {
                eventType,
                eventData: eventData ? JSON.stringify(eventData) : null,
                userId,
                sessionId,
                ipAddress,
                userAgent,
            },
        });
    } catch (error) {
        // Log error but don't throw - analytics should not break the app
        console.error('Analytics logging error:', error);
    }
};

// Get visitor statistics for the last N days
export const getVisitorStats = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily visitor counts
    const dailyVisitors = await prisma.$queryRaw`
        SELECT 
            DATE(createdAt) as date,
            COUNT(DISTINCT sessionId) as visitors
        FROM analytics_events
        WHERE eventType = 'page_view'
            AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
    `;

    // Get total unique visitors
    const totalVisitors = await prisma.analyticsEvent.findMany({
        where: {
            eventType: 'page_view',
            createdAt: { gte: startDate },
        },
        distinct: ['sessionId'],
        select: { sessionId: true },
    });

    return {
        dailyVisitors,
        totalVisitors: totalVisitors.length,
    };
};

// Get most searched categories
export const getMostSearchedCategories = async (limit = 10) => {
    const searches = await prisma.analyticsEvent.findMany({
        where: {
            eventType: 'search',
        },
        select: {
            eventData: true,
        },
    });

    // Parse and aggregate category searches
    const categoryCount = {};
    searches.forEach(event => {
        try {
            const data = JSON.parse(event.eventData);
            if (data.category) {
                categoryCount[data.category] = (categoryCount[data.category] || 0) + 1;
            }
        } catch (e) {
            // Skip invalid JSON
        }
    });

    // Convert to array and sort
    const sortedCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    return sortedCategories;
};

// Get most searched recipes
export const getMostSearchedRecipes = async (limit = 10) => {
    const recipeViews = await prisma.analyticsEvent.findMany({
        where: {
            eventType: 'recipe_view',
        },
        select: {
            eventData: true,
        },
    });

    // Parse and aggregate recipe views
    const recipeCount = {};
    recipeViews.forEach(event => {
        try {
            const data = JSON.parse(event.eventData);
            if (data.recipeId && data.recipeTitle) {
                const key = data.recipeId;
                if (!recipeCount[key]) {
                    recipeCount[key] = {
                        id: data.recipeId,
                        title: data.recipeTitle,
                        count: 0,
                    };
                }
                recipeCount[key].count++;
            }
        } catch (e) {
            // Skip invalid JSON
        }
    });

    // Convert to array and sort
    const sortedRecipes = Object.values(recipeCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    return sortedRecipes;
};

// Get most searched terms from RecentSearch
export const getMostSearchedTerms = async (limit = 10) => {
    const searchTerms = await prisma.$queryRaw`
        SELECT 
            query,
            COUNT(*) as count
        FROM recent_search
        GROUP BY query
        ORDER BY count DESC
        LIMIT ${limit}
    `;

    return searchTerms;
};
