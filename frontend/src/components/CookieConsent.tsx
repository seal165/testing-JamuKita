"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Enable Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Disable Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? "opacity-30" : "opacity-0"
        }`}
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      />

      {/* Cookie Consent Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white shadow-2xl border-t-4 border-[#B6771D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-[#B6771D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      🍪 Kami Menggunakan Cookie
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Website Jamu Kita menggunakan cookie dan teknologi serupa untuk
                      meningkatkan pengalaman Anda, menganalisis penggunaan website, dan
                      membantu kami memahami preferensi pengunjung. Cookie kami{" "}
                      <strong>tidak mengumpulkan data pribadi</strong> seperti email atau
                      informasi sensitif. Data yang kami kumpulkan bersifat anonim dan
                      digunakan untuk statistik pengunjung serta peningkatan layanan.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Dengan mengklik &quot;Terima&quot;, Anda menyetujui penggunaan cookie kami.
                      Untuk informasi lebih lanjut, lihat{" "}
                      <a href="/privacy" className="text-[#B6771D] hover:underline">
                        Kebijakan Privasi
                      </a>{" "}
                      kami.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDecline}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Tolak
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#B6771D] rounded-lg hover:bg-[#9a6118] transition-colors duration-200 shadow-lg"
                >
                  Terima Semua Cookie
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
