// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Lucide Icon Imports
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Star,
  Heart,
  ChevronRight,
  ChevronDown,
  Camera,
  Gamepad2,
  Bike,
  Wrench,
  Music,
  Tent,
  Sofa,
  Smartphone,
  BookOpen,
  Dog,
  PartyPopper,
  Plane,
  Plus,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CreditCard,
  Building2,
  SmartphoneNfc,
  Sparkles,
} from "lucide-react";

// --- Mock Data ---
const CATEGORIES = [
  { name: "Photography", icon: Camera, count: "12,400+ items" },
  { name: "Gaming", icon: Gamepad2, count: "8,900+ items" },
  { name: "Vehicles", icon: Bike, count: "15,100+ items" },
  { name: "Tools", icon: Wrench, count: "6,200+ items" },
  { name: "Music", icon: Music, count: "4,800+ items" },
  { name: "Camping", icon: Tent, count: "5,300+ items" },
  { name: "Furniture", icon: Sofa, count: "9,700+ items" },
  { name: "Electronics", icon: Smartphone, count: "18,500+ items" },
  { name: "Books", icon: BookOpen, count: "3,100+ items" },
  { name: "Pets Gear", icon: Dog, count: "1,900+ items" },
  { name: "Party", icon: PartyPopper, count: "7,400+ items" },
  { name: "Drones", icon: Plane, count: "4,200+ items" },
];

const FEATURED_RENTALS = [
  {
    id: "1",
    title: "Sony Alpha a7 IV + 24-70mm f/2.8 GM Lens",
    category: "Photography",
    pricePerDay: 1850,
    marketValue: "₹2,40,000",
    rating: 4.96,
    reviews: 42,
    location: "Indiranagar, Bengaluru",
    distance: "2.4 km away",
    owner: "Rohan V.",
    ownerBadge: "Super Lender",
    ownerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "2",
    title: "Sony PlayStation 5 Disc Edition + 2 Controllers",
    category: "Gaming",
    pricePerDay: 690,
    marketValue: "₹54,990",
    rating: 4.98,
    reviews: 89,
    location: "Koramangala, Bengaluru",
    distance: "1.1 km away",
    owner: "Priya S.",
    ownerBadge: "Top Rated",
    ownerImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "3",
    title: "DJI Mini 3 Pro Fly More Combo (4K HDR)",
    category: "Drones",
    pricePerDay: 1450,
    marketValue: "₹89,000",
    rating: 4.92,
    reviews: 31,
    location: "Bandra West, Mumbai",
    distance: "3.8 km away",
    owner: "Aman K.",
    ownerBadge: "Super Lender",
    ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "4",
    title: "Ather 450X Gen 3 Electric Scooter",
    category: "Vehicles",
    pricePerDay: 490,
    marketValue: "₹1,45,000",
    rating: 4.89,
    reviews: 57,
    location: "Connaught Place, New Delhi",
    distance: "0.8 km away",
    owner: "Karan M.",
    ownerBadge: "Verified Pro",
    ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
];

const FAQS = [
  {
    q: "What happens if my item gets damaged or lost?",
    a: "Every verified rental is backed by our ₹50,000 Comprehensive Protection Plan. We hold an escrow security deposit from the renter and handle all repair or replacement claims within 48 hours.",
  },
  {
    q: "How do I know the renter is trustworthy?",
    a: "All renters undergo a 3-step mandatory verification process including Aadhaar/Passport Instant KYC, mobile OTP verification, and social graph scoring before they can initiate any booking request.",
  },
  {
    q: "How and when do I get paid?",
    a: "Payouts are transferred directly into your linked UPI or Bank Account via automated instant transfers within 2 hours of handover confirmation.",
  },
  {
    q: "Can I set custom availability and security deposits?",
    a: "Yes! As a lender, you retain complete control over daily rates, minimum rental periods, security deposit amounts, and calendar availability.",
  },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [calcDays, setCalcDays] = useState(10);
  const [calcItemType, setCalcItemType] = useState(1200); // Daily avg yield
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Track scroll for floating blur navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const monthlyEarnings = calcDays * calcItemType;
  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111827] overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* ---------------------------------------------------
          HEADER / NAVBAR
      --------------------------------------------------- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-panel border-b border-gray-200/80 py-3 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {["Browse Rentals", "Categories", "Become a Lender", "How it Works", "Trust & Safety"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-gray-600 transition hover:text-[#2563EB]"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-semibold text-gray-700 hover:text-[#2563EB] sm:block">
              Log In
            </button>
            <Link
              href="/post"
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Start Earning</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------
          HERO SECTION
      --------------------------------------------------- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Soft background ambient gradient shapes */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-1/3 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-[100px]" />

        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-[#2563EB] mb-6 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>India’s Most Trusted Peer-to-Peer Rental Network</span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.08] font-heading">
                Your Things. <br />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-emerald-500 bg-clip-text text-transparent">
                  Your Income.
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-2xl leading-relaxed">
                Turn your unused camera, gaming console, bike, or drone into a steady passive income stream. Fully insured, instant UPI payouts, and 100% verified renters.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/post"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>List Your Item</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#browse"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[18px] border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                >
                  <span>Browse Items</span>
                </Link>
              </div>

              {/* Hero Key Metrics Bar */}
              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-gray-200/80 pt-8 w-full">
                <div>
                  <p className="text-3xl font-extrabold text-gray-900 font-num">₹12Cr+</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Lender Earnings</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900 font-num">50K+</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Verified Users</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900 font-num">1L+</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Items Rented</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-extrabold text-gray-900 font-num">4.9</p>
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-1">Average Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Floating Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]"
            >
              <div className="relative w-full max-w-md aspect-4/5 rounded-[32px] overflow-hidden shadow-2xl border border-white/60 bg-white p-3">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000"
                  alt="Sony Camera Gear"
                  className="w-full h-full object-cover rounded-[24px]"
                />

                {/* Floating Glass Overlay Card 1: Instant Payout alert */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-6 left-6 glass-panel rounded-[20px] p-3.5 shadow-xl flex items-center gap-3 border border-white/80 max-w-[220px]"
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Payout Released</p>
                    <p className="text-sm font-bold text-emerald-600 font-num">+₹3,400 credited</p>
                  </div>
                </motion.div>

                {/* Floating Glass Overlay Card 2: Verified Item Badge */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 right-6 glass-panel rounded-[20px] p-4 shadow-xl flex items-center gap-3 border border-white/80"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">₹50,000 Guaranteed</p>
                    <p className="text-xs text-gray-500">Damage Coverage Active</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          SEARCH BAR WIDGET (FLOATING MASSIVE)
      --------------------------------------------------- */}
      <section className="relative z-30 -mt-8 mx-auto max-w-[1200px] px-6">
        <div className="rounded-[28px] glass-panel bg-white/90 p-4 lg:p-5 shadow-2xl shadow-blue-900/10 border border-white/80">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="What would you like to rent? (e.g., PS5, DSLR, Tent)"
                className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Location Selector */}
            <div className="md:col-span-3 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="w-full">
                <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Location</span>
                <input
                  type="text"
                  defaultValue="Bengaluru, KA"
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Dates Selector */}
            <div className="md:col-span-2 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="w-full">
                <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Dates</span>
                <span className="text-sm font-semibold text-gray-900 block truncate">Aug 5 - Aug 8</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button className="w-full flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition active:scale-95 cursor-pointer">
                <Search className="h-4 w-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          CATEGORIES HORIZONTAL SCROLL
      --------------------------------------------------- */}
      <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="categories">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Explore Categories</h2>
            <p className="text-gray-500 text-sm mt-2">Find high-quality gear available near you for immediate rent.</p>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:underline">
            <span>View All Categories</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col items-center justify-center p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer text-center"
              >
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{cat.name}</h3>
                <span className="text-xs text-gray-400 font-medium mt-1">{cat.count}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------
          HOW IT WORKS SECTION
      --------------------------------------------------- */}
      <section className="py-20 bg-white border-y border-gray-200/80" id="how-it-works">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Seamless Process</span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">How RentIt Works</h2>
            <p className="text-gray-500 text-sm mt-3">Start earning or renting in less than 5 minutes with complete peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "List Your Item",
                desc: "Upload photo, set daily price, and set instant availability parameters.",
                icon: Plus,
              },
              {
                step: "02",
                title: "Approve Verification",
                desc: "Renter completes automated KYC & pays security escrow before handover.",
                icon: UserCheck,
              },
              {
                step: "03",
                title: "Handover & Rent",
                desc: "Meet locally or use doorstep verified pickup & OTP exchange.",
                icon: SmartphoneNfc,
              },
              {
                step: "04",
                title: "Get Paid Instantly",
                desc: "Payout is auto-credited to your bank account upon rental completion.",
                icon: Zap,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex flex-col items-start p-8 rounded-[24px] bg-[#FAFAFA] border border-gray-200/60">
                  <span className="text-xs font-black text-[#2563EB] font-num bg-blue-100/80 px-3 py-1 rounded-full mb-6">
                    STEP {item.step}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-900 mb-4">
                    <Icon className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          FEATURED RENTALS
      --------------------------------------------------- */}
      <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="browse">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Trending Listings Near You</h2>
            <p className="text-gray-500 text-sm mt-2">Verified quality gear backed by 100% buyer protection.</p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {["all", "photography", "gaming", "drones", "vehicles"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_RENTALS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="group rounded-[24px] bg-white border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-gray-300 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image & Wishlist Button Header */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 h-9 w-9 rounded-full glass-panel flex items-center justify-center text-gray-700 hover:text-red-500 transition shadow-2xs">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    Value: {item.marketValue}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-[#2563EB]">{item.category}</span>
                    <div className="flex items-center gap-1 font-num text-gray-900 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-gray-400">({item.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.location} • {item.distance}</span>
                  </p>

                  {/* Owner Info Row */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.ownerImage}
                        alt={item.owner}
                        className="h-7 w-7 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-none">{item.owner}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{item.ownerBadge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-900 font-num">₹{item.pricePerDay}</span>
                  <span className="text-xs text-gray-400 font-medium"> / day</span>
                </div>
                <button className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  Quick Rent
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------
          INTERACTIVE EARN MONEY CALCULATOR (DARK CARD)
      --------------------------------------------------- */}
      <section className="py-16 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="rounded-[32px] bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Passive Income Estimator</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                Calculate how much your idle belongings can earn.
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-4 leading-relaxed">
                Most electronics, cameras, and leisure gear sit unused 25 days a month. Turn those idle days into guaranteed monthly income.
              </p>

              <div className="mt-8 space-y-6">
                {/* Item Category Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Select Item Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "DSLR / Camera", yield: 1500 },
                      { label: "PS5 Console", yield: 700 },
                      { label: "4K Drone", yield: 1800 },
                    ].map((type) => (
                      <button
                        key={type.label}
                        onClick={() => setCalcItemType(type.yield)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                          calcItemType === type.yield
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days slider */}
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold mb-2">
                    <span className="text-gray-300">Days rented per month:</span>
                    <span className="text-blue-400 font-num font-extrabold text-base">{calcDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-[#2563EB] bg-gray-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Income Output Box */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-md rounded-[28px] glass-dark p-8 text-center border border-white/10 shadow-2xl">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Monthly Earnings</span>
                <p className="text-5xl sm:text-6xl font-black text-emerald-400 font-num my-4 tracking-tight">
                  ₹{monthlyEarnings.toLocaleString("en-IN")}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                  <span>Projected Annual Income:</span>
                  <strong className="text-white font-num text-sm">₹{yearlyEarnings.toLocaleString("en-IN")} / yr</strong>
                </div>

                <Link
                  href="/post"
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 hover:opacity-95 transition"
                >
                  <span>Become a Lender Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          TRUST & SAFETY SECTION
      --------------------------------------------------- */}
      <section className="py-20 bg-white border-t border-gray-200/80" id="trust-&-safety">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">Bank-Grade Protection</span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">Designed for 100% Peace of Mind</h2>
            <p className="text-gray-500 text-sm mt-3">We handle the risk so you can focus on earning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Government ID Verification",
                desc: "Automated Aadhaar, PAN, and Passport check required for every user prior to renting.",
                icon: ShieldCheck,
              },
              {
                title: "₹50,000 Damage Guarantee",
                desc: "In the rare case of accidental damage or theft, our rapid insurance fund covers repairs.",
                icon: Lock,
              },
              {
                title: "Escrow Deposit System",
                desc: "Security deposits are held in a regulated escrow account until the item is returned safely.",
                icon: CreditCard,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="p-8 rounded-[28px] bg-[#FAFAFA] border border-gray-200/80 shadow-2xs">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          FAQ ACCORDION
      --------------------------------------------------- */}
      <section className="py-20 mx-auto max-w-[900px] px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 font-heading">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm mt-2">Have questions? We’ve got answers.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-[20px] bg-white border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 text-base cursor-pointer hover:text-[#2563EB]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-[#2563EB]" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-sm text-gray-500 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------
          FOOTER
      --------------------------------------------------- */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="text-xl font-black text-white font-heading">RentIt</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              India’s premier peer-to-peer rental marketplace. Monetize unused belongings or access high-end gear at a fraction of retail prices.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-white transition">Browse All Gear</Link></li>
              <li><Link href="#" className="hover:text-white transition">Photography</Link></li>
              <li><Link href="#" className="hover:text-white transition">Gaming Consoles</Link></li>
              <li><Link href="#" className="hover:text-white transition">Vehicles & EVs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Lend & Earn</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-white transition">List an Item</Link></li>
              <li><Link href="#" className="hover:text-white transition">Earnings Calculator</Link></li>
              <li><Link href="#" className="hover:text-white transition">Lender Protection Guarantee</Link></li>
              <li><Link href="#" className="hover:text-white transition">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-white transition">About RentIt</Link></li>
              <li><Link href="#" className="hover:text-white transition">Trust & Security</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RentIt India Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-gray-300">Twitter</Link>
            <Link href="#" className="hover:text-gray-300">Instagram</Link>
            <Link href="#" className="hover:text-gray-300">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}