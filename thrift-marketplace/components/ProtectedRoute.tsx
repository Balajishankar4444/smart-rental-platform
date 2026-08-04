// components/ProtectedRoute.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Lock, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authStatus } = useAuth();
  const [showLoginModal] = useState(true);

  if (authStatus === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // If the user is a guest, show the popup modal
  if (authStatus === "guest") {
    // Save current path so they can return after login
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname + window.location.search;
      sessionStorage.setItem("auth_redirect_url", currentUrl);
    }

    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4">
        {/* Background Blur of Protected Content Mock */}
        <div className="absolute inset-0 filter blur-sm opacity-30 pointer-events-none select-none p-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Login Popup Modal Overlay */}
        {showLoginModal && (
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-inner">
              <Lock className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-heading">
              Authentication Required
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              You must be logged in to view this page and access your rental dashboard items.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In to Proceed</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/"
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 py-2 transition"
              >
                Return to Home Page
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If authenticated, render the protected page content
  return <>{children}</>;
}