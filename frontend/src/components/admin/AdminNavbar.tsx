"use client";

import { useRouter } from "next/navigation";

interface AdminNavbarProps {
  onMenuClick?: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/admin/profil");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-[#B6771D] hover:bg-yellow-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src="/images/jamu-logo.png"
              alt="Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
            />
          </div>

          {/* Profile Icon */}
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B6771D] flex items-center justify-center hover:bg-[#8B5A15] transition-colors flex-shrink-0"
            aria-label="Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
