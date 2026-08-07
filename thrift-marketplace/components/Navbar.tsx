// components/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  BookmarkCheck,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { RippleButton } from "./ui/RippleButton";
import { useAuth } from "@/app/context/AuthContext";
import { useBookingRequests } from "@/hooks/useBookingRequests";
import { deriveRequestStatus } from "@/utils/bookingRequests";

const NAV_LINKS = [
  { name: "Home", href: "/#hero", id: "hero" },
  { name: "Find Rooms", href: "/#browse", id: "browse" },
  { name: "Categories", href: "/#categories", id: "categories" },
  { name: "How It Works", href: "/#how-it-works", id: "how-it-works" },
  { name: "Become a Host", href: "/#calculator", id: "calculator" },
  { name: "Safety", href: "/#trust-and-safety", id: "trust-and-safety" },
  { name: "Help", href: "/#faq", id: "faq" },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";

  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const { user, isLoggedIn, logout, isLoading } = useAuth();
  
  // Fetch incoming/outgoing requests and 'now' to compute the badge globally
  const { incoming, outgoing, now } = useBookingRequests();

  const pendingIncomingCount = incoming.filter(
    (req) => deriveRequestStatus(req, now) === "pending"
  ).length;

  const approvedOutgoingCount = outgoing.filter(
    (req) => deriveRequestStatus(req, now) === "approved"
  ).length;

  const actionableCount = pendingIncomingCount + approvedOutgoingCount;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach((link) => {
      const element = document.getElementById(link.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(link.name);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isHome]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartEarningRedirect = () => {
    router.push("/list-item");
  };

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
    router.push(pathname);
  };

  const filteredNavLinks = NAV_LINKS.filter(
    (link) => isHome || link.name !== "Home"
  );

  const profilePath = "/profile/demo";
  const listingPath = "/dashboard/view-booking";
  const settingPath = "/setting";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-45 transition-all duration-300 ${
          isScrolled
            ? "glass-panel border-b border-gray-200/80 py-3 shadow-xs bg-white/80 backdrop-blur-md"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
            >
              <Zap className="h-5 w-5 fill-current" />
            </motion.div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {filteredNavLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(link.name)}
                  className={`relative text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-[#2563EB]"
                      : "text-gray-600 hover:text-[#2563EB]"
                  }`}
                >
                  {link.name}
                  {isActive && isHome && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#2563EB]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {!isLoading &&
              (isLoggedIn && user ? (
                <>
                <Link
                  href="/dashboard/view-booking?tab=notifications"
                  aria-label="Notifications"
                  className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/90 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Bell className="h-4 w-4 text-gray-700" />
                  {actionableCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {actionableCount}
                    </span>
                  )}
                </Link>
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2.5 rounded-full border bg-white py-1.5 pl-1.5 pr-3.5 shadow-sm transition-all duration-200 cursor-pointer ${
                      isProfileOpen
                        ? "border-blue-300 ring-4 ring-blue-500/10 bg-gray-50/50"
                        : "border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-100 shadow-xs">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <span className="text-xs font-bold tracking-tight text-gray-800">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${
                        isProfileOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-3xl border border-gray-100 bg-white/95 p-2.5 shadow-2xl shadow-blue-900/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                      <div className="flex items-center gap-3 rounded-2xl bg-gray-50/80 px-3 py-3 border border-gray-100/60 mb-1.5">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 shadow-xs">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold tracking-tight text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="px-3 py-1 pb-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-100/50">
                          <ShieldCheck className="h-3 w-3 text-blue-500" />
                          Verified Account
                        </div>
                      </div>

                      <div className="space-y-0.5 border-t border-gray-100/80 pt-2 pb-1">
                        <Link
                          href={profilePath}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-blue-50/60 hover:text-blue-600 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-100/60 group-hover:text-blue-600 transition-colors">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                          </div>
                          Dashboard & Profile
                        </Link>
                        <Link
                          href={listingPath}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-blue-50/60 hover:text-blue-600 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-100/60 group-hover:text-blue-600 transition-colors">
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </div>
                          My Rentals & Listings
                        </Link>
                        <Link
                          href="/saved"
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-blue-50/60 hover:text-blue-600 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-100/60 group-hover:text-blue-600 transition-colors">
                            <BookmarkCheck className="h-3.5 w-3.5" />
                          </div>
                          Favorites & Saved Items
                        </Link>
                        <Link
                          href={settingPath}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-blue-50/60 hover:text-blue-600 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-100/60 group-hover:text-blue-600 transition-colors">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </div>
                          Settings & Preferences
                        </Link>
                      </div>

                      <div className="border-t border-gray-100/80 pt-1.5 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-50/80 group cursor-pointer"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
                            <LogOut className="h-3.5 w-3.5" />
                          </div>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                  className="hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#2563EB] transition"
                >
                  Log In
                </Link>
              ))}

            {!isLoading && (
              <RippleButton
                onClick={handleStartEarningRedirect}
                className="hidden sm:inline-flex gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Become a Host</span>
              </RippleButton>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-white/95 backdrop-blur-xl px-6 pt-28 pb-10 lg:hidden"
          >
            <nav className="flex flex-col gap-5">
              {filteredNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className="text-2xl font-bold text-gray-900 hover:text-[#2563EB] transition-colors font-heading"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
              {!isLoading &&
                (isLoggedIn && user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href={profilePath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 text-center block cursor-pointer hover:bg-gray-50"
                    >
                      Dashboard & Profile
                    </Link>

                    <Link
                      href={listingPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 text-center block cursor-pointer hover:bg-gray-50"
                    >
                      My Rentals & Listings
                    </Link>

                    <Link
                      href={settingPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 text-center block cursor-pointer hover:bg-gray-50"
                    >
                      Setting
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 rounded-2xl bg-rose-50 text-sm font-bold text-rose-600 text-center cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 text-center block cursor-pointer hover:bg-gray-50"
                    >
                      Log In
                    </Link>

                    <RippleButton
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleStartEarningRedirect();
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#2563EB] text-sm font-bold text-white shadow-lg shadow-blue-500/25 cursor-pointer"
                    >
                      Become a Host
                    </RippleButton>
                  </>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};