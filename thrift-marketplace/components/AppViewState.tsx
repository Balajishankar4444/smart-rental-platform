"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileQuestion,
  AlertOctagon,
  SearchX,
  ShoppingCart,
  PackageOpen,
  WifiOff,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";

export type ViewState =
  | "404"
  | "500"
  | "empty-products"
  | "empty-cart"
  | "empty-orders"
  | "loading"
  | "network-error";

interface AppViewStateProps {
  state: ViewState;
  onAction?: () => void;
}

export const AppViewState = ({ state, onAction }: AppViewStateProps) => {
  // 1. Loading Skeleton State matching your exact card layout
  if (state === "loading") {
    return (
      <div className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl mb-3" />
        <div className="h-4 w-40 bg-gray-100 rounded-lg mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[24px] bg-white border border-gray-200/80 overflow-hidden p-5 space-y-4 shadow-2xs">
              <div className="h-60 w-full bg-gray-100 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="h-6 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-blue-50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Configuration map for the remaining 6 message-based states mapped strictly to your theme
  const config = {
    "404": {
      icon: <FileQuestion className="h-9 w-9 text-[#2563EB]" />,
      badge: "Error 404",
      badgeClass: "text-[#2563EB] bg-blue-50",
      iconContainer: "bg-blue-50 border border-blue-100 shadow-inner",
      title: "Page not found",
      description: "Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.",
      showHome: true,
      showBack: true,
      actionText: "Try Again",
    },
    "500": {
      icon: <AlertOctagon className="h-9 w-9 text-rose-600" />,
      badge: "Server Error",
      badgeClass: "text-rose-600 bg-rose-50",
      iconContainer: "bg-rose-50 border border-rose-100 shadow-inner",
      title: "Something went wrong!",
      description: "An unexpected error occurred on our servers. We are already tracking this issue.",
      showHome: true,
      showBack: false,
      actionText: "Try Again",
    },
    "empty-products": {
      icon: <SearchX className="h-8 w-8 text-gray-400" />,
      badge: "",
      badgeClass: "",
      iconContainer: "bg-gray-100 border border-gray-200",
      title: "No products found",
      description: "We couldn't find any listings matching your search or filter criteria. Try checking your spelling or clearing filters.",
      showHome: false,
      showBack: false,
      actionText: "Clear Filters",
    },
    "empty-cart": {
      icon: <ShoppingCart className="h-9 w-9 text-[#2563EB]" />,
      badge: "",
      badgeClass: "",
      iconContainer: "bg-blue-50 border border-blue-100",
      title: "Your cart is empty",
      description: "Looks like you haven't added any gear to your rental cart yet. Explore our listings to find what you need.",
      showHome: false,
      showBack: false,
      actionText: "Browse Gear Now",
      customLink: "/#browse",
    },
    "empty-orders": {
      icon: <PackageOpen className="h-9 w-9 text-gray-700" />,
      badge: "",
      badgeClass: "",
      iconContainer: "bg-gray-100 border border-gray-200",
      title: "No rentals or orders yet",
      description: "You haven't placed any rental bookings. Once you rent equipment, your history and statuses will appear here.",
      showHome: false,
      showBack: false,
      actionText: "Explore Listings",
      customLink: "/#browse",
    },
    "network-error": {
      icon: <WifiOff className="h-9 w-9 text-amber-600" />,
      badge: "Connection Lost",
      badgeClass: "text-amber-600 bg-amber-50",
      iconContainer: "bg-amber-50 border border-amber-100 shadow-inner",
      title: "Network connection error",
      description: "Please check your internet connection and try refreshing or hitting retry.",
      showHome: false,
      showBack: false,
      actionText: "Retry Connection",
    },
  }[state];

  if (!config) return null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto">
        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-[24px] mb-6 shadow-2xs ${config.iconContainer}`}>
          {config.icon}
        </div>

        {config.badge && (
          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${config.badgeClass}`}>
            {config.badge}
          </span>
        )}

        <h3 className="text-2xl font-extrabold text-gray-900 font-heading">{config.title}</h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{config.description}</p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          {config.showBack && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          )}

          {config.showHome && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <Home className="h-4 w-4" /> Home Page
            </Link>
          )}

          {config.customLink ? (
            <Link
              href={config.customLink}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              {config.actionText}
            </Link>
          ) : (
            onAction && (
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {config.actionText}
              </button>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};