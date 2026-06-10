import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/context/AuthContext";
import { pageview, GA_MEASUREMENT_ID } from "@/lib/gtag";
import React, { Suspense } from "react";
import AnalyticsTracker from "@/components/AnalyticsTrackerComponent";
import { Elsie } from "next/font/google";

const elsie = Elsie({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-elsie",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={elsie.variable}>
      <head>
        <title>Jamu Kita - Herbal Indonesia</title>
        <meta name="description" content="Sehat dengan jamu alami" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Google Analytics with consent mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Set default consent to 'denied' 
              gtag('consent', 'default', {
                'analytics_storage': 'denied'
              });
              
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
        {/* End Google Analytics */}
      </head>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <Navbar />
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
