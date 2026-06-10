"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import type { User, RegisterData, LoginData } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = apiService.getStoredToken();
        const storedUser = apiService.getStoredUser();
        
        if (!token || !storedUser) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token expiration
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.exp * 1000 <= Date.now()) {
            console.log("[AuthContext] Token expired");
            apiService.clearToken();
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("[AuthContext] Token parsing error:", error);
          apiService.clearToken();
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Sync profile with backend to ensure consistency
        try {
          const profile = await apiService.getProfile();
          if (profile.success && profile.data) {
            setUser(profile.data);
            localStorage.setItem("user_data", JSON.stringify(profile.data));
            setIsAuthenticated(true);
            console.log("[AuthContext] User authenticated on init:", profile.data.email);
          } else {
            // If profile fetch fails, clear everything
            apiService.clearToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("[AuthContext] Profile fetch error:", error);
          // Don't clear token on network errors, keep using stored data
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("[AuthContext] Init auth error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Monitor authentication state changes
  useEffect(() => {
    console.log("[AuthContext] Auth state changed:", {
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email,
      isLoading
    });
  }, [isAuthenticated, user, isLoading]);

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.register(data);

      if (response.success && response.data?.user && response.data?.access_token) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Force a small delay to ensure state propagates
        await new Promise(resolve => setTimeout(resolve, 50));
        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.message || "Registrasi gagal",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat registrasi",
      };
    }
  };

  const login = async (
    data: LoginData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.login(data);
      console.log("[AuthContext] Login response:", response);

      if (response.success && response.data?.user && response.data?.access_token) {
        console.log("[AuthContext] Setting user:", response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Force a small delay to ensure state propagates
        await new Promise(resolve => setTimeout(resolve, 50));
        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.message || "Login gagal",
      };
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat login",
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      apiService.clearToken();
      router.push("/login");
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      if (profile.success && profile.data) {
        setUser(profile.data);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(profile.data));
        }
      }
    } catch (error) {
      console.error("[AuthContext] refreshProfile error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        register,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
