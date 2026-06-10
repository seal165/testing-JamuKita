// Google Analytics GTAG utilities

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Check if user has consented to cookies
const hasConsent = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie-consent') === 'accepted';
};

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && hasConsent()) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag && hasConsent()) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track search events
export const trackSearch = (query: string, resultCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultCount,
  });
};

// Track recipe views
export const trackRecipeView = (recipeId: string, recipeTitle: string) => {
  event({
    action: 'view_recipe',
    category: 'Recipe',
    label: `${recipeTitle} (${recipeId})`,
  });
};

// Track category views
export const trackCategoryView = (categoryName: string) => {
  event({
    action: 'view_category',
    category: 'Category',
    label: categoryName,
  });
};

// Track favorite actions
export const trackFavorite = (action: 'add' | 'remove', recipeTitle: string) => {
  event({
    action: `favorite_${action}`,
    category: 'Favorite',
    label: recipeTitle,
  });
};

// Track comment actions
export const trackComment = (recipeTitle: string, rating: number) => {
  event({
    action: 'add_comment',
    category: 'Comment',
    label: recipeTitle,
    value: rating,
  });
};
