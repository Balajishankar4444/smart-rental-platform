// app/product/[id]/page.tsx
"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, Zap, Camera, Laptop, Gamepad2, Smartphone, 
  Projector, Wrench, Compass, Music, Armchair, Package, Sparkles, 
  Check, X, Calendar, ChevronLeft, ChevronRight, ChevronDown, 
  MapPin, Heart, Share2, ArrowRightLeft, User, MessageSquare, 
  Flag, Award, Clock, Shield, Truck, RotateCcw, ThumbsUp, 
  Maximize2, Eye, Play, Info, AlertCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ==========================================
// MOCK DATA & TYPES
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
    fullDescription: "The Sony Alpha 7 IV redefines full-frame performance with breathtaking 33MP image quality, 4K 60p recording, and industry-leading real-time autofocus. Meticulously maintained and stored in a climate-controlled Pelican case. Fully sanitized before every handover.",
    owner: {
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      rating: 4.9,
      rentalsCompleted: 120,
      responseTime: "Under 15 mins",
      memberSince: "January 2024",
      languages: ["English", "Hindi", "Kannada"],
      verified: true,
    },
    specs: {
      weight: "658 g (with battery and card)",
      color: "Matte Black",
      power: "Rechargeable NP-FZ100 Lithium-ion",
      warranty: "Manufacturer Warranty Active",
      pickup: "Available at Indiranagar Metro Station",
      delivery: "Home delivery available within 10 km",
    },
    included: [
      "Sony A7IV Body",
      "FE 24-70mm f/2.8 GM Lens",
      "2x NP-FZ100 Batteries",
      "Dual Slot Battery Charger",
      "128GB V90 SDXC Memory Card",
      "Peak Design Camera Strap",
      "Weatherproof Carrying Backpack",
    ],
    reviews: [
      {
        id: "r1",
        author: "Vikram Malhotra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolute pristine condition! Aarav was extremely helpful with pickup coordination and even included an extra battery. Shot a complete commercial project with zero issues.",
        verifiedRental: true,
        photos: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400"],
        helpfulCount: 14,
      },
      {
        id: "r2",
        author: "Neha Sen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        date: "1 month ago",
        comment: "Smooth transaction, instant booking worked seamlessly. The gear was spotless and packed securely. Highly recommended host!",
        verifiedRental: true,
        helpfulCount: 8,
      },
    ],
  },
  "playstation-5-bundle": {
    id: "playstation-5-bundle",
    title: "PlayStation 5 Console + 2 Controllers & 4 Games",
    category: "Gaming Consoles",
    brand: "Sony",
    model: "PS5 Disc Edition (CFI-1215A)",
    condition: "Like New",
    age: "6 months",
    dailyPrice: 450,
    weeklyPrice: 2600,
    monthlyPrice: 8500,
    securityDeposit: 2000,
    platformProtection: 79,
    lateFee: 150,
    rating: 4.9,
    reviewsCount: 64,
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?auto=format&fit=crop&q=80&w=1200",
    ],
    city: "Bengaluru, KA",
    area: "Koramangala",
    distance: "0.8 km away",
    verifiedHost: true,
    instantBook: true,
    rentalCount: 52,
    viewsCount: 2100,
    wishlistCount: 142,
    shortDescription: "Next-gen gaming experience with ultra-high speed SSD, ray tracing, and haptic feedback DualSense controllers. Pre-loaded with top titles.",
    fullDescription: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio. Comes with 2 DualSense wireless controllers and physical/digital game discs including Spider-Man 2, God of War Ragnarök, EA FC 24, and Gran Turismo 7.",
    owner: {
      name: "Karthik Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      rating: 4.8,
      rentalsCompleted: 95,
      responseTime: "Under 10 mins",
      memberSince: "November 2023",
      languages: ["English", "Telugu", "Kannada"],
      verified: true,
    },
    specs: {
      weight: "4.5 kg",
      color: "White / Black",
      power: "Standard AC 110-240V",
      warranty: "Under Store Warranty",
      pickup: "Koramangala 4th Block",
      delivery: "Doorstep delivery & setup available",
    },
    included: [
      "PS5 Console (Disc Edition)",
      "2x DualSense Wireless Controllers",
      "High-Speed HDMI Cable",
      "Power Cord & Charging Station",
      "4x Physical Game Discs",
    ],
    reviews: [
      {
        id: "r3",
        author: "Rahul Verma",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        date: "3 weeks ago",
        comment: "Weekend gaming session was amazing. Karthik dropped it off on time and helped hook it up.",
        verifiedRental: true,
        helpfulCount: 5,
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
function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;
  const product = (productId && MOCK_PRODUCTS[productId]) || DEFAULT_PRODUCT;

  // Gallery State
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Wishlist & Share State
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Same-page Booking Drawer / State (Instead of route navigation)
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);

  // Booking & Date State
  const [startDate, setStartDate] = useState("2026-08-05");
  const [endDate, setEndDate] = useState("2026-08-08");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(7); // August
  const [currentYear, setCurrentYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Reviews Filter & Sort State
  const [reviewSort, setReviewSort] = useState("helpful");
  const [reviewFilterRating, setReviewFilterRating] = useState<number | null>(null);

  // Similar Products Carousel Ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate duration & pricing
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

  // Calendar Helpers
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto w-full space-y-12">
        
        {/* ==========================================
            1. BREADCRUMB
        ========================================== */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <a href="/" className="hover:text-[#2563EB] transition-colors">Home</a>
          <span>/</span>
          <a href="/search" className="hover:text-[#2563EB] transition-colors">{product.category}</a>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[250px]">{product.title}</span>
        </nav>

        {/* ==========================================
            2. PRODUCT GALLERY
        ========================================== */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Hero Image */}
            <div className="lg:col-span-8 relative rounded-[32px] overflow-hidden bg-slate-950 aspect-[16/10] shadow-2xl group">
              <img 
                src={product.images[activeImageIdx]} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                onClick={() => setIsFullscreenOpen(true)}
              />

              {/* Top Badges & Actions */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {activeImageIdx + 1} / {product.images.length}
                </span>
                {product.instantBook && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Instant Book
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist item"
                  className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors shadow-lg cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  aria-label="Share item"
                  className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors shadow-lg cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsFullscreenOpen(true)}
                  aria-label="Fullscreen gallery"
                  className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors shadow-lg cursor-pointer"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Quick Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert("360° View is currently in development and coming soon!")}
                    className="bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#2563EB]" /> 360° View (Coming Soon)
                  </button>
                  <button 
                    onClick={() => alert("Video preview demo mode active.")}
                    className="bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" /> Video Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Column */}
            <div className="lg:col-span-4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-[calc(25%-12px)] bg-slate-100 cursor-pointer border-2 transition-all ${
                    activeImageIdx === idx ? "border-[#2563EB] shadow-lg scale-[1.02]" : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            3. PRODUCT INFORMATION & PRICING GRID
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Info, Specs, Owner, Reviews (Span 8) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Product Information Header */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Condition: {product.condition}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Age: {product.age}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-[#2563EB]" /> {product.viewsCount} views</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> {product.wishlistCount} wishlists</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-slate-900 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#2563EB]" /> {product.city} ({product.area}) • {product.distance}</span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {product.shortDescription}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Verified Badge & Rentals Count */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Platform Verified Gear</h4>
                    <p className="text-[11px] text-slate-500">Inspected for full working condition before dispatch</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#2563EB] block">{product.rentalCount} Successful Rentals</span>
                  <span className="text-[11px] text-slate-400">Zero default record</span>
                </div>
              </div>
            </div>

            {/* ==========================================
                4. OWNER CARD
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={product.owner.avatar} 
                    alt={product.owner.name} 
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{product.owner.name}</h3>
                      {product.owner.verified && <ShieldCheck className="w-4 h-4 text-[#2563EB]" />}
                    </div>
                    <p className="text-xs text-slate-500">Member since {product.owner.memberSince} • Responds in {product.owner.responseTime}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {product.owner.rating}
                      </span>
                      <span>•</span>
                      <span>{product.owner.rentalsCompleted} Rentals Completed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Opening chat window with ${product.owner.name}...`)}
                    className="px-4 py-2.5 rounded-2xl bg-blue-50 text-[#2563EB] font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Owner
                  </button>
                  <button 
                    onClick={() => alert("Profile modal preview")}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Languages spoken: <strong className="text-slate-800">{product.owner.languages.join(", ")}</strong></span>
                <button 
                  onClick={() => alert("Listing reported successfully.")}
                  className="text-red-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Flag className="w-3.5 h-3.5" /> Report Listing
                </button>
              </div>
            </div>

            {/* ==========================================
                5. TRUST SECTION
            ========================================== */}
            <div className="bg-gradient-to-r from-blue-900 to-[#1E3A8A] rounded-[32px] p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Platform Trust & Protection Guarantee</h3>
                  <p className="text-xs text-blue-200">Rent with 100% confidence backed by comprehensive coverage</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-xs font-bold">Identity Verified</h4>
                  <p className="text-[11px] text-blue-200">All hosts and renters verified with KYC</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-1">
                  <Zap className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="text-xs font-bold">Secure Payments</h4>
                  <p className="text-[11px] text-blue-200">Encrypted transactions & escrow deposit</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-1">
                  <Award className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-xs font-bold">Damage Protection</h4>
                  <p className="text-[11px] text-blue-200">Comprehensive accidental coverage included</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-1">
                  <Clock className="w-5 h-5 text-purple-400 mb-2" />
                  <h4 className="text-xs font-bold">24/7 Support</h4>
                  <p className="text-[11px] text-blue-200">Dedicated assistance throughout your rental</p>
                </div>
              </div>
            </div>

            {/* ==========================================
                6. PRODUCT SPECIFICATIONS
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/85 space-y-6">
              <h3 className="font-bold text-lg text-slate-900">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Brand</span>
                  <span className="text-xs font-bold text-slate-900">{product.brand}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Model</span>
                  <span className="text-xs font-bold text-slate-900">{product.model}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Condition</span>
                  <span className="text-xs font-bold text-slate-900">{product.condition}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Weight</span>
                  <span className="text-xs font-bold text-slate-900">{product.specs.weight}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Color</span>
                  <span className="text-xs font-bold text-slate-900">{product.specs.color}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Power / Battery</span>
                  <span className="text-xs font-bold text-slate-900">{product.specs.power}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Warranty Status</span>
                  <span className="text-xs font-bold text-slate-900">{product.specs.warranty}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Pickup Point</span>
                  <span className="text-xs font-bold text-slate-900">{product.specs.pickup}</span>
                </div>
              </div>
            </div>

            {/* ==========================================
                7. AVAILABILITY CALENDAR & RULES
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Availability & Booking Rules</h3>
                  <p className="text-xs text-slate-500">Select your preferred dates to reserve this equipment</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Available Now
                </div>
              </div>

              {/* Inline Interactive Calendar Preview */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{MONTH_NAMES[currentMonth]} {currentYear}</h4>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => {
                        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                        else setCurrentMonth(currentMonth - 1);
                      }}
                      aria-label="Previous month"
                      className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button 
                      onClick={() => {
                        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                        else setCurrentMonth(currentMonth + 1);
                      }}
                      aria-label="Next month"
                      className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAYS.map((w) => (
                    <span key={w} className="text-[11px] font-bold text-slate-400">{w}</span>
                  ))}
                  {getDaysInMonth(currentYear, currentMonth).map(({ day, dateStr, isCurrentMonth }, idx) => {
                    const isSelected = dateStr === startDate || dateStr === endDate;
                    const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleDateClick(dateStr)}
                        className={`h-9 flex items-center justify-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          isSelected ? "bg-[#2563EB] text-white font-bold shadow-md" :
                          isInRange ? "bg-blue-100 text-[#2563EB]" :
                          isCurrentMonth ? "bg-white text-slate-800 hover:bg-blue-50 border border-slate-100" : "text-slate-300"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Min Period</span>
                  <span>1 Day minimum</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Max Period</span>
                  <span>90 Days maximum</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Delivery</span>
                  <span>Available (₹150)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Pickup</span>
                  <span>Free of charge</span>
                </div>
              </div>
            </div>

            {/* ==========================================
                8. FEATURES & WHAT'S INCLUDED
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-6">
              <h3 className="font-bold text-lg text-slate-900">What's Included in the Box</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.included.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ==========================================
                9. REVIEWS & RATINGS SECTION
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Customer Reviews & Ratings</h3>
                  <p className="text-xs text-slate-500">Based on {product.reviewsCount} verified rentals</p>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#2563EB]"
                  >
                    <option value="helpful">Sort by: Most Helpful</option>
                    <option value="recent">Sort by: Most Recent</option>
                    <option value="highest">Highest Rating</option>
                  </select>
                </div>
              </div>

              {/* Rating Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 items-center">
                <div className="md:col-span-4 text-center md:border-r border-slate-200 pr-4">
                  <span className="text-4xl font-extrabold text-slate-900 block">{product.rating}</span>
                  <div className="flex items-center justify-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">Out of 5.0 overall rating</span>
                </div>

                <div className="md:col-span-8 space-y-2">
                  {[
                    { stars: 5, count: 38, pct: "90%" },
                    { stars: 4, count: 4, pct: "10%" },
                    { stars: 3, count: 0, pct: "0%" },
                    { stars: 2, count: 0, pct: "0%" },
                    { stars: 1, count: 0, pct: "0%" },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                      <span className="w-10 text-right">{row.stars} stars</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }}></div>
                      </div>
                      <span className="w-8 text-right text-slate-400">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews List */}
              <div className="space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{rev.author}</h4>
                            {rev.verifiedRental && (
                              <span className="bg-blue-50 text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Verified Rental
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2">
                        {rev.photos.map((p, idx) => (
                          <img key={idx} src={p} alt="Review attachment" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs text-slate-500">
                      <span>Was this review helpful?</span>
                      <button 
                        onClick={() => alert("Marked as helpful!")}
                        className="flex items-center gap-1 font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==========================================
                10. LOCATION MAP PREVIEW
            ========================================== */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-lg text-slate-900">Pickup Location & Area</h3>
              <p className="text-xs text-slate-500">Exact meetup instructions provided instantly upon booking confirmation</p>
              
              <div className="relative rounded-2xl overflow-hidden h-64 bg-blue-50 border border-slate-200 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                <div className="z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-slate-200 text-center space-y-1">
                  <MapPin className="w-6 h-6 text-[#2563EB] mx-auto animate-bounce" />
                  <h4 className="text-xs font-bold text-slate-900">{product.city} ({product.area})</h4>
                  <p className="text-[11px] text-slate-500">Pickup Point: {product.specs.pickup}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Pricing & Booking Card (Span 4) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-200/90 space-y-6">
              
              {/* Pricing Tiers Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-2xl font-extrabold text-[#2563EB]">₹{product.dailyPrice}</span>
                  <span className="text-xs text-slate-500"> / day</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">₹{product.weeklyPrice} / week</span>
                  <span className="text-[11px] text-slate-400 block">₹{product.monthlyPrice} / month</span>
                </div>
              </div>

              {/* Interactive Booking Summary Widget */}
              <div className="space-y-4">
                
                {/* Date Selector Trigger */}
                <div className="relative" ref={calendarRef}>
                  <div 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Rental Dates</span>
                      <span className="text-xs font-bold text-slate-900">
                        {formatDisplayDate(startDate)} {endDate ? `- ${formatDisplayDate(endDate)}` : ""} ({rentalDays} days)
                      </span>
                    </div>
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                  </div>

                  {/* Dropdown Calendar Popup */}
                  {isCalendarOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{MONTH_NAMES[currentMonth]} {currentYear}</h4>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}
                            aria-label="Previous month"
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}
                            aria-label="Next month"
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                        {WEEKDAYS.map(w => <span key={w}>{w}</span>)}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {getDaysInMonth(currentYear, currentMonth).map(({ day, dateStr, isCurrentMonth }, idx) => {
                          const isSelected = dateStr === startDate || dateStr === endDate;
                          const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleDateClick(dateStr)}
                              className={`h-7 text-xs rounded-lg font-semibold cursor-pointer ${
                                isSelected ? "bg-[#2563EB] text-white" :
                                isInRange ? "bg-blue-100 text-[#2563EB]" :
                                isCurrentMonth ? "hover:bg-slate-100 text-slate-800" : "text-slate-300"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button 
                          onClick={() => setIsCalendarOpen(false)}
                          className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Apply Dates
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown Calculation */}
                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>₹{product.dailyPrice} × {rentalDays} days</span>
                    <span className="text-slate-900 font-bold">₹{rentalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refundable Security Deposit</span>
                    <span className="text-slate-900 font-bold">₹{product.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Protection Fee</span>
                    <span className="text-slate-900 font-bold">₹{product.platformProtection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee</span>
                    <span className="text-slate-900 font-bold">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (GST 18%)</span>
                    <span className="text-slate-900 font-bold">₹{taxes}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-[#2563EB]">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Cancellation Policy Note */}
                <div className="p-3 rounded-xl bg-blue-50 text-[11px] font-semibold text-[#2563EB] flex items-start gap-2">
                  <RotateCcw className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Free cancellation up to 48 hours before rental start date.</span>
                </div>

                {/* Action Buttons (Opens same-page drawer instead of navigating away) */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => {
                      setBookingStep(1);
                      setShowBookingDrawer(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
                  >
                    Rent Now
                  </button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} /> Wishlist
                    </button>
                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button 
                      onClick={() => alert("Compare feature activated.")}
                      className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" /> Compare
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            11. SIMILAR PRODUCTS SECTION
        ========================================== */}
        <section className="space-y-6 pt-10 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold font-heading text-slate-900">Similar Products You Might Like</h3>
              <p className="text-xs text-slate-500">Recommended rentals available nearby in {product.city}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button 
                onClick={() => carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
            {[
              {
                id: "macbook-pro-m3",
                title: "MacBook Pro 16\" M3 Max (32GB RAM, 1TB SSD)",
                category: "Laptops",
                dailyPrice: 1200,
                rating: 5.0,
                reviewsCount: 28,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
                city: "Bengaluru, KA",
                distance: "2.4 km away",
              },
              {
                id: "dji-mavic-3-pro",
                title: "DJI Mavic 3 Pro Drone Fly More Combo",
                category: "Electronics",
                dailyPrice: 950,
                rating: 4.8,
                reviewsCount: 35,
                image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
                city: "Bengaluru, KA",
                distance: "3.1 km away",
              },
              {
                id: "playstation-5-bundle",
                title: "PlayStation 5 Console + 2 Controllers & 4 Games",
                category: "Gaming Consoles",
                dailyPrice: 450,
                rating: 4.9,
                reviewsCount: 64,
                image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
                city: "Bengaluru, KA",
                distance: "0.8 km away",
              },
              {
                id: "4k-laser-projector",
                title: "Anker Nebula Cosmos Laser 4K Projector",
                category: "Projectors",
                dailyPrice: 700,
                rating: 4.7,
                reviewsCount: 19,
                image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800",
                city: "Bengaluru, KA",
                distance: "4.5 km away",
              },
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => window.location.href = `/product/${item.id}`}
                className="w-[300px] shrink-0 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#2563EB]" /> {item.distance}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full">{item.category}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-[#2563EB] transition-colors">{item.title}</h4>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-[#2563EB]">₹{item.dailyPrice}</span>
                      <span className="text-xs text-slate-500"> / day</span>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ==========================================
          SAME-PAGE BOOKING DRAWER / MODAL
      ========================================== */}
      {showBookingDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 lg:p-8">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">Secure Checkout</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Complete Your Rental</h3>
                </div>
                <button 
                  onClick={() => setShowBookingDrawer(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className={`h-1.5 rounded-full ${bookingStep >= 1 ? "bg-[#2563EB]" : "bg-slate-200"}`} />
                <div className={`h-1.5 rounded-full ${bookingStep >= 2 ? "bg-[#2563EB]" : "bg-slate-200"}`} />
                <div className={`h-1.5 rounded-full ${bookingStep >= 3 ? "bg-[#2563EB]" : "bg-slate-200"}`} />
              </div>
            </div>

            {/* Step Content */}
            <div className="py-6 space-y-6 flex-1">
              {bookingStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-sm text-slate-800">1. Confirm Rental Period & Delivery</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Selected Dates:</span>
                      <span className="text-slate-900 font-bold">{formatDisplayDate(startDate)} to {formatDisplayDate(endDate)} ({rentalDays} days)</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Fulfillment Method:</span>
                      <span className="text-slate-900 font-bold">In-person Pickup (Free)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2 text-xs text-[#2563EB]">
                    <p className="font-bold">Host Meetup Location:</p>
                    <p>{product.city} ({product.area}) — {product.specs.pickup}</p>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-sm text-slate-800">2. Review Pricing & Deposit</h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-600 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between">
                      <span>Rental Fee ({rentalDays} days)</span>
                      <span className="text-slate-900 font-bold">₹{rentalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refundable Security Deposit</span>
                      <span className="text-slate-900 font-bold">₹{product.securityDeposit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Protection</span>
                      <span className="text-slate-900 font-bold">₹{product.platformProtection}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                      <span>Total Payable Now</span>
                      <span className="text-[#2563EB]">₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-4 text-center py-8 animate-in fade-in">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">Booking Confirmed!</h4>
                  <p className="text-xs text-slate-500">Your reservation for {product.title} has been successfully registered. The host has been notified.</p>
                </div>
              )}
            </div>

            {/* Footer Buttons - Stays on same page instead of redirecting away */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              {bookingStep > 1 && bookingStep < 3 && (
                <button 
                  onClick={() => setBookingStep((bookingStep - 1) as any)}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}
              {bookingStep < 2 ? (
                <button 
                  onClick={() => setBookingStep(2)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  Continue to Payment
                </button>
              ) : bookingStep === 2 ? (
                <button 
                  onClick={() => setBookingStep(3)}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Confirm & Pay ₹{grandTotal}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setShowBookingDrawer(false);
                    setBookingStep(1);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#2563EB] text-white font-extrabold text-xs cursor-pointer"
                >
                  Done (Stay on Page)
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          SHARE MODAL
      ========================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Share this rental listing</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Help your friends find top-quality equipment for rent.</p>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <input type="text" readOnly value={window.location.href} className="w-full bg-transparent text-xs text-slate-700 outline-none" />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          FULLSCREEN GALLERY MODAL
      ========================================== */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6">
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <span className="text-white text-sm font-bold">{activeImageIdx + 1} / {product.images.length}</span>
            <button 
              onClick={() => setIsFullscreenOpen(false)}
              aria-label="Close fullscreen gallery"
              className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <img src={product.images[activeImageIdx]} alt="Fullscreen view" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
          </div>
          <div className="flex gap-3 mt-6">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImageIdx === idx ? "border-[#2563EB] scale-105" : "border-transparent opacity-50"}`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}