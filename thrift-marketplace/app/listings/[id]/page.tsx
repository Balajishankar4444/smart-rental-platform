// app/product/[id]/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Zap,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  Share2,
  MessageSquare,
  ThumbsUp,
  Maximize2,
  Eye,
  Play,
  Send,
  Lock,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedRental: boolean;
  photos?: string[];
  helpfulCount: number;
}

interface ProductDetail {
  id: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  age: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  securityDeposit: number;
  platformProtection: number;
  lateFee: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  city: string;
  area: string;
  distance: string;
  verifiedHost: boolean;
  instantBook: boolean;
  rentalCount: number;
  viewsCount: number;
  wishlistCount: number;
  shortDescription: string;
  fullDescription: string;
  owner: {
    name: string;
    avatar: string;
    rating: number;
    rentalsCompleted: number;
    responseTime: string;
    memberSince: string;
    languages: string[];
    verified: boolean;
  };
  specs: {
    weight: string;
    color: string;
    power: string;
    warranty: string;
    pickup: string;
    delivery: string;
  };
  included: string[];
  reviews: Review[];
}

const MOCK_PRODUCTS: Record<string, ProductDetail> = {
  "sony-alpha-7iv": {
    id: "sony-alpha-7iv",
    title: "Sony Alpha 7IV Mirrorless Camera with 24-70mm Lens",
    category: "Cameras",
    brand: "Sony",
    model: "Alpha 7 IV (ILCE-7M4)",
    condition: "Like New",
    age: "8 months",
    dailyPrice: 850,
    weeklyPrice: 4800,
    monthlyPrice: 15000,
    securityDeposit: 3000,
    platformProtection: 99,
    lateFee: 200,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1200",
    ],
    city: "Bengaluru, KA",
    area: "Indiranagar",
    distance: "1.2 km away",
    verifiedHost: true,
    instantBook: true,
    rentalCount: 38,
    viewsCount: 1245,
    wishlistCount: 94,
    shortDescription: "Professional full-frame mirrorless camera equipped with a versatile 24-70mm f/2.8 zoom lens. Ideal for weddings, commercial shoots, and cinematic videography.",
    fullDescription: "The Sony Alpha 7 IV redefines full-frame performance with breathtaking 33MP image quality, 4K 60p recording, and industry-leading real-time autofocus.",
    owner: {
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      rentalsCompleted: 120,
      responseTime: "Under 15 mins",
      memberSince: "January 2024",
      languages: ["English", "Hindi"],
      verified: true,
    },
    specs: {
      weight: "658 g",
      color: "Matte Black",
      power: "NP-FZ100",
      warranty: "Active",
      pickup: "Indiranagar Metro",
      delivery: "Available",
    },
    included: ["Body", "24-70mm Lens", "2x Batteries", "Charger", "128GB SD"],
    reviews: [
      {
        id: "r1",
        author: "Vikram Malhotra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolute pristine condition! Aarav was extremely helpful with pickup coordination.",
        verifiedRental: true,
        helpfulCount: 14,
      },
    ],
  },
};

const DEFAULT_PRODUCT = MOCK_PRODUCTS["sony-alpha-7iv"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatDateString = (year: number, month: number, day: number) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;
  const product = (productId && MOCK_PRODUCTS[productId]) || DEFAULT_PRODUCT;

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(product.wishlistCount);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [reviewsState, setReviewsState] = useState<Review[]>(product.reviews);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Proper Authentication State Management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [startDate, setStartDate] = useState(() => searchParams.get("startDate") || "2026-08-05");
  const [endDate, setEndDate] = useState(() => searchParams.get("endDate") || "2026-08-08");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(7);
  const [currentYear, setCurrentYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedInFlag = localStorage.getItem("isLoggedIn") === "true";
      // Alternatively, check for an auth token or session cookie if available:
      // const token = localStorage.getItem("auth_token");
      setIsAuthenticated(loggedInFlag);
      setIsCheckingAuth(false);
    };

    checkAuthStatus();

    // Listen for storage changes across tabs/components
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      setIsWishlisted(false);
      setWishlistCount((prev) => prev - 1);
    } else {
      setIsWishlisted(true);
      setWishlistCount((prev) => prev + 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setIsContactModalOpen(false);
    }, 2000);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 3;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const rentalCost = rentalDays * product.dailyPrice;
  const platformFee = Math.round(rentalCost * 0.08);
  const taxes = Math.round((rentalCost + platformFee) * 0.18);
  const grandTotal = rentalCost + product.securityDeposit + product.platformProtection + platformFee + taxes;

  const getDaysInMonth = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      days.push({ day: dayNum, dateStr: formatDateString(prevY, prevM, dayNum), isCurrentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, dateStr: formatDateString(year, month, i), isCurrentMonth: true });
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      days.push({ day: i, dateStr: formatDateString(nextY, nextM, i), isCurrentMonth: false });
    }

    return days;
  };

  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
    } else if (startDate && !endDate) {
      if (dateStr < startDate) {
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
        setIsCalendarOpen(false);
      }
    }
  };

  // ==========================================
  // AUTHENTICATION & BOOKING CHECK HANDLER
  // ==========================================
  const handleProceedToBook = () => {
    // Re-verify auth state directly from storage for absolute accuracy
    const verifiedLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!verifiedLoggedIn) {
      setIsAuthenticated(false);
      // Save current booking destination so the system can redirect back after login
      localStorage.setItem("redirectAfterLogin", `/booking?productId=${productId}&startDate=${startDate}&endDate=${endDate}`);
      setIsLoginModalOpen(true);
    } else {
      setIsAuthenticated(true);
      router.push(`/booking?productId=${productId}&startDate=${startDate}&endDate=${endDate}`);
    }
  };

  const handleNavigateToLoginPage = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 max-w-[1280px] mx-auto w-full space-y-6">
        
        {/* ==========================================
            1. COMPACT HEADER SECTION
        ========================================== */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {product.condition}
              </span>
              {product.instantBook && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Instant Book
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
            <button
              onClick={handleWishlistToggle}
              aria-label="Wishlist item"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              aria-label="Share item"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </section>

        {/* ==========================================
            2. MAIN SPLIT GRID (GALLERY + PRICING SIDEBAR)
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Gallery & Summary Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Compact Image Gallery Grid */}
            <div className="grid grid-cols-4 gap-2 bg-slate-900 p-2 rounded-2xl shadow-md">
              <div className="col-span-4 relative aspect-[16/9] rounded-xl overflow-hidden group">
                <img
                  src={product.images[activeImageIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  onClick={() => setIsFullscreenOpen(true)}
                />
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  aria-label="Fullscreen gallery"
                  className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg hover:bg-[#2563EB] transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Expand Image
                </button>
              </div>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-[16/10] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    activeImageIdx === idx ? "border-[#2563EB] opacity-100 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Concise Description Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <h3 className="text-sm font-bold font-heading text-slate-900">Quick Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {product.included.map((item, i) => (
                  <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Host Snippet Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={product.owner.avatar} alt={product.owner.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hosted by {product.owner.name}</h4>
                  <p className="text-[10px] text-slate-500">Responds {product.owner.responseTime} • {product.distance}</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-xs hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" /> Chat
              </button>
            </div>
          </div>

          {/* Right: Compact Booking & Cost Calculator Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 space-y-4 sticky top-20">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-2xl font-extrabold text-slate-900">₹{product.dailyPrice}</span>
                <span className="text-xs text-slate-500 font-medium"> / day</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Save 20% on weekly
              </span>
            </div>

            {/* Date Picker Trigger */}
            <div className="space-y-1 relative" ref={calendarRef}>
              <label className="text-[11px] font-bold text-slate-700">Select Dates</label>
              <div
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-[#2563EB] transition-colors text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{formatDisplayDate(startDate)} → {formatDisplayDate(endDate)}</span>
                </div>
                <span className="font-extrabold text-[#2563EB]">{rentalDays}d</span>
              </div>

              {/* Popup Calendar Dropdown */}
              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl p-3 shadow-xl border border-slate-100 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1">
                      <button
                        onClick={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-800">
                        {MONTH_NAMES[currentMonth]} {currentYear}
                      </span>
                      <button
                        onClick={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(currentYear + 1);
                          } else {
                            setCurrentMonth(currentMonth + 1);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {WEEKDAYS.map((wd) => (
                        <span key={wd} className="text-[9px] font-extrabold text-slate-400 py-0.5">
                          {wd}
                        </span>
                      ))}
                      {getDaysInMonth(currentYear, currentMonth).map((d, i) => {
                        const isSelected = d.dateStr === startDate || d.dateStr === endDate;
                        const isInRange = startDate && endDate && d.dateStr > startDate && d.dateStr < endDate;

                        return (
                          <button
                            key={i}
                            disabled={!d.isCurrentMonth}
                            onClick={() => handleDateClick(d.dateStr)}
                            className={`py-1 text-[11px] rounded-md transition-all ${
                              !d.isCurrentMonth
                                ? "text-slate-200 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#2563EB] text-white font-bold cursor-pointer"
                                : isInRange
                                ? "bg-blue-50 text-[#2563EB] font-semibold cursor-pointer"
                                : "hover:bg-slate-100 text-slate-700 cursor-pointer"
                            }`}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>₹{product.dailyPrice} × {rentalDays} days</span>
                <span className="font-bold text-slate-800">₹{rentalCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit (Refundable)</span>
                <span className="font-bold text-slate-800">₹{product.securityDeposit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Protection Cover & Fees</span>
                <span className="font-bold text-slate-800">₹{product.platformProtection + platformFee + taxes}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-[#2563EB]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToBook}
              disabled={isCheckingAuth}
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Proceed to Book
            </button>
          </div>
        </div>

      </main>

      {/* ==========================================
          LOGIN POPUP MODAL (PROMPTS SIGN IN IF NOT LOGGED IN)
      ========================================== */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>Authentication Required</span>
                </div>
                <button onClick={() => setIsLoginModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 py-2">
                <h3 className="text-base font-bold text-slate-900">Please log in to book</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are currently signed out. Click below to sign in so you can complete your reservation. Once logged in, you will be redirected straight back here.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNavigateToLoginPage}
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          FULLSCREEN IMAGE LIGHTBOX MODAL
      ========================================== */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <button
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute top-6 right-6 z-50 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
              <img
                src={product.images[activeImageIdx]}
                alt={product.title}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />

              <div className="flex items-center gap-3 mt-4 overflow-x-auto py-2 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIdx === idx ? "border-[#2563EB] scale-105" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals for Share & Contact */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Share Listing</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-[#2563EB] text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0 cursor-pointer"
                >
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900">Message {product.owner.name}</h3>
                <button onClick={() => setIsContactModalOpen(false)} className="cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {messageSent ? (
                <div className="py-6 text-center space-y-1">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Message Sent!</h4>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Ask a question about availability or pickup..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] resize-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}