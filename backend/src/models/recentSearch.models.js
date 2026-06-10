import prisma from "../lib/prisma.js";

export const RecentSearchModel = {
  // Get user's recent searches
  async getUserRecentSearches(userId, limit = 10) {
    const searches = await prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return searches;
  },

  // Save new search
  async saveSearch(userId, query, resultCount = 0) {
    // Check if this exact query already exists for this user
    const existing = await prisma.recentSearch.findFirst({
      where: {
        userId,
        query: {
          equals: query
        },
      },
    });

    // If exists, delete it (will be re-added with new timestamp)
    if (existing) {
      await prisma.recentSearch.delete({
        where: { id: existing.id },
      });
    }

    // Create new search record
    const newSearch = await prisma.recentSearch.create({
      data: {
        userId,
        query,
        resultCount,
      },
    });

    // Keep only the last 10 searches
    const allSearches = await prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (allSearches.length > 10) {
      const toDelete = allSearches.slice(10);
      await prisma.recentSearch.deleteMany({
        where: {
          id: {
            in: toDelete.map((s) => s.id),
          },
        },
      });
    }

    return newSearch;
  },

  // Delete one search
  async deleteSearch(id, userId) {
    const search = await prisma.recentSearch.findFirst({
      where: { id, userId },
    });

    if (!search) {
      return null;
    }

    return await prisma.recentSearch.delete({
      where: { id },
    });
  },

  // Clear all searches for user
  async clearAllSearches(userId) {
    return await prisma.recentSearch.deleteMany({
      where: { userId },
    });
  },
};
