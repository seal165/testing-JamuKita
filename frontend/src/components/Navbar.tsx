"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchMobile(false);
      setMenuOpen(false);
    }
  };

  // Jika pathname belum tersedia (rendering sementara), jangan render navbar
  if (!pathname) return null;
  const is404 = pathname === "/404" || pathname.includes("/404");
  const isAuthRoute =
    pathname.toLowerCase() === "/login" ||
    pathname.toLowerCase() === "/register" ||
    pathname.toLowerCase().startsWith("/login") ||
    pathname.toLowerCase().startsWith("/register");

  if (is404 || isAuthRoute) return null;

  return (
    <nav className="top-0 z-50 h-16 bg-yellow-100 sticky w-full shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/images/jamu-logo.png"
              alt="Logo"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="font-semibold text-[#b6770F] text-base sm:text-lg whitespace-nowrap">
              Jamu Kita
            </span>
          </Link>

          {/* Search Bar - Desktop (Only for logged in users) */}
          {isAuthenticated && (
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari resep jamu..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-[#B6771D] focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B6771D] hover:text-[#945d15] transition"
                >
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 lg:space-x-6 items-center flex-shrink-0">
            <Link
              href="/beranda"
              className="font-bold text-[#B6771D] hover:text-[#945d15] transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Beranda
            </Link>
            <Link
              href="/sejarah"
              className="font-bold text-[#B6771D] hover:text-[#945d15] transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Artikel
            </Link>
            <Link
              href="/about-us"
              className="font-bold text-[#B6771D] hover:text-[#945d15] transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Tentang Kami
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <a className="circler-full text-[#B6771D] hover:text-[#945d15] font-bold text-sm lg:text-base cursor-pointer" onClick={() => router.push("/profile")}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                </a>
                <button
                  onClick={() => logout()}
                  className="bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold text-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#B6771D] text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-[#945d15] transition font-bold text-sm whitespace-nowrap"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search button - Mobile (Only for logged in users) */}
            {isAuthenticated && (
              <button
                onClick={() => setShowSearchMobile(!showSearchMobile)}
                className="text-[#B6771D] focus:outline-none p-2 hover:bg-yellow-200 rounded-lg transition"
                aria-label="Toggle search"
              >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
              </button>
            )}

            {/* Menu button - Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#B6771D] focus:outline-none p-2 hover:bg-yellow-200 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Only for logged in users) */}
      {showSearchMobile && isAuthenticated && (
        <div className="md:hidden bg-yellow-50 px-4 py-3 border-t border-yellow-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari resep jamu..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-[#B6771D] focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B6771D] hover:text-[#945d15] transition"
              >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-yellow-50 px-4 pt-2 pb-4 space-y-2 shadow-lg border-t border-yellow-200">
          <Link
            href="/beranda"
            onClick={() => setMenuOpen(false)}
            className="block text-[#B6771D] hover:bg-yellow-200 font-semibold py-3 px-3 rounded-lg transition"
          >
            Beranda
          </Link>
          <Link
            href="/sejarah"
            onClick={() => setMenuOpen(false)}
            className="block text-[#B6771D] hover:bg-yellow-200 font-semibold py-3 px-3 rounded-lg transition"
          >
            Artikel
          </Link>
          <Link
            href="/about-us"
            onClick={() => setMenuOpen(false)}
            className="block text-[#B6771D] hover:bg-yellow-200 font-semibold py-3 px-3 rounded-lg transition"
          >
            Tentang Kami
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block text-[#B6771D] hover:bg-yellow-200 font-semibold py-3 px-3 rounded-lg transition"
              >
                Profil Saya
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block bg-[#B6771D] text-white text-center py-3 rounded-lg hover:bg-[#945d15] font-semibold transition"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
