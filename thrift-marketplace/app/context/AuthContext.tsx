"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Read saved user session from localStorage when page loads
  useEffect(() => {
    const savedUser = localStorage.getItem("rentit_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handlePostAuthRedirect = () => {
    if (typeof window === "undefined") return;
    const redirectUrl = sessionStorage.getItem("auth_redirect_url");
    if (redirectUrl) {
      sessionStorage.removeItem("auth_redirect_url");
      router.push(redirectUrl);
    } else {
      router.push("/");
    }
  };

  const login = (email: string, name?: string) => {
    const userData: UserProfile = {
      name: name || email.split("@")[0] || "User",
      email,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setUser(userData);
    localStorage.setItem("rentit_user", JSON.stringify(userData));
    handlePostAuthRedirect();
  };

  const signup = (name: string, email: string) => {
    const userData: UserProfile = {
      name,
      email,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setUser(userData);
    localStorage.setItem("rentit_user", JSON.stringify(userData));
    handlePostAuthRedirect();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rentit_user");
    router.push("/");
  };

  const authStatus: AuthStatus = isLoading
    ? "loading"
    : user
    ? "authenticated"
    : "guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        authStatus,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}