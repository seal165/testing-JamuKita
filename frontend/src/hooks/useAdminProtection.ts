"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook untuk melindungi halaman admin dari user non-admin
 * Hook ini akan redirect user yang bukan admin ke halaman beranda
 */
export function useAdminProtection() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Tunggu sampai loading selesai
    if (isLoading) return;

    // Jika tidak terautentikasi, redirect ke login
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Jika user bukan admin, redirect ke beranda
    if (user.role !== "admin") {
      router.push("/beranda");
      return;
    }
  }, [user, isLoading, isAuthenticated, router]);

  return { 
    isAuthorized: !isLoading && isAuthenticated && user?.role === "admin",
    isLoading 
  };
}
