// Analytics tracking hook
import { useEffect } from 'react';
import { pageview } from '@/lib/gtag';

export const useAnalytics = () => {
  const trackEvent = async (eventType: string, eventData?: any) => {
    try {
      const response = await fetch('http://localhost:3000/v1/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          eventData,
        }),
      });

      if (!response.ok) {
        console.error('Failed to log analytics event');
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackEvent };
};

export const usePageTracking = () => {
  useEffect(() => {
    // Track page view on mount
    const trackPageView = async () => {
      const eventData = {
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      };

      try {
        await fetch('http://localhost:3000/v1/analytics/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'page_view',
            eventData,
          }),
        });
      } catch (error) {
        console.error('Page tracking error:', error);
      }
    };

    trackPageView();
  }, []);
};
