// app/components/AnalyticsTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, GA_MEASUREMENT_ID } from "@/lib/gtag";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = typeof window !== "undefined" ? localStorage.getItem("cookie-consent") : null;
    if (pathname && consent === "accepted") {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }

    const trackInternalPageView = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";
        await fetch(`${API_BASE_URL}/analytics/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "page_view",
            eventData: { path: pathname, title: document.title, referrer: document.referrer },
          }),
        });
      } catch (error) {
        console.debug("Analytics tracking error:", error);
      }
    };

    trackInternalPageView();
  }, [pathname, searchParams]);

  return null;
}