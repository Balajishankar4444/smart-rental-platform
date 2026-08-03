"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Search,
  SlidersHorizontal,
  MapPin,
  PlusCircle,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Star,
  Bell,
  Heart,
  Package,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // 1. AUTHENTICATION STATE (Toggle `isLoggedIn` to test both modes)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock User Details (Used when logged in)
  const user = {
    name: "Alex Morgan",
    email: "alex.m@example.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Lender & Borrower",
  };

  // Close profile dropdown when clicking outside
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

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    // Clear your tokens / cookies here
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 shadow-inner focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all w-80 lg:w-96">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cameras, tools, camping gear..."
              className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* RIGHT SIDE ACTIONS: SWITCHES BASED ON `isLoggedIn` */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              /* ================= AFTER LOGIN VIEW ================= */
              <>
                <Link
                  href="/items/new"
                  className="hidden sm:flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563EB] transition hover:bg-blue-100 font-heading"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>List an Item</span>
                </Link>

                <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                    </div>
                    <div className="hidden text-left md:block">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {user.name}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Options */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="border-b border-slate-100 px-3 py-2.5">
                        <p className="text-xs font-bold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2563EB]"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          href="/my-listings"
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2563EB]"
                        >
                          <Package className="h-4 w-4 text-slate-400" />
                          My Listings
                        </Link>
                        <Link
                          href="/saved"
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2563EB]"
                        >
                          <Heart className="h-4 w-4 text-slate-400" />
                          Saved Gear
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2563EB]"
                        >
                          <Settings className="h-4 w-4 text-slate-400" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-rose-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ================= BEFORE LOGIN VIEW ================= */
              <>
                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 font-heading"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className="rounded-2xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 font-heading"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Dynamic Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl mb-10">
          <div className="relative z-10 max-w-2xl">
            {isLoggedIn ? (
              <>
                <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/20 mb-3 font-heading">
                  Welcome back, {user.name.split(" ")[0]} 👋
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-heading">
                  Ready to rent or list today?
                </h1>
              </>
            ) : (
              <>
                <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/20 mb-3 font-heading">
                  Peer-to-Peer Rental Network
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-heading">
                  Rent anything nearby, or turn idle items into income.
                </h1>
              </>
            )}
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Discover camera gear, tools, and outdoor equipment available from verified local owners.
            </p>
          </div>
        </div>

        {/* Temporary Toggle Button to preview state in development */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="rounded-full border border-dashed border-blue-400 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100 cursor-pointer"
          >
            [Dev Switch] Toggle Authentication State: Currently {isLoggedIn ? "LOGGED IN" : "LOGGED OUT"}
          </button>
        </div>

        {/* Listings Grid */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
              Available Near You
            </h2>
            <p className="text-xs text-slate-500">
              Popular equipment available for instant rent in your area
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 font-heading">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Rental Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 1,
              title: "Sony FX3 Cinema Camera Kit",
              category: "Photography",
              price: "₹2,500",
              unit: "/day",
              rating: "4.9",
              location: "Indiranagar, 1.2km away",
              img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
            },
            {
              id: 2,
              title: "DeWalt Cordless Drill & Driver Kit",
              category: "Tools",
              price: "₹450",
              unit: "/day",
              rating: "4.8",
              location: "Koramangala, 2.5km away",
              img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-slate-900 backdrop-blur shadow-sm font-heading">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="mt-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-heading">
                  {item.category}
                </span>
                <h3 className="mt-1 line-clamp-1 text-sm font-extrabold text-slate-900 font-heading">
                  {item.title}
                </h3>

                <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 font-heading">
                      {item.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {item.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!isLoggedIn) router.push("/login");
                    }}
                    className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#2563EB] cursor-pointer font-heading"
                  >
                    {isLoggedIn ? "Book Now" : "Log in to Rent"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}