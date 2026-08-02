// app/list-item/preview-publish/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Check, ArrowRight, ArrowLeft, Save, ShieldCheck, 
  MapPin, Calendar, DollarSign, Eye, RefreshCw, X, Sparkles, 
  Star, Zap, AlertCircle, Heart, Share2, Smartphone, Monitor, Tablet,
  Lock, CheckCircle2, TrendingUp, Award, Clock, Package, HelpCircle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PreviewAndPublishPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Simulated listing data reflecting the complete final step
  const listingData = {
    productName: "Sony Alpha 7IV Mirrorless Camera with 24-70mm Lens",
    category: "Cameras",
    subcategory: "Full-Frame Cameras",
    brand: "Sony",
    model: "ILCE-7M4",
    condition: "Like New (Mint Condition)",
    purchaseYear: "2024",
    owner: "Balaji S.",
    location: "Stuttgart, Baden-Württemberg",
    dailyPrice: 900,
    weeklyPrice: 5400,
    monthlyPrice: 18000,
    securityDeposit: 3000,
    deliveryOptions: "Pickup & Doorstep Delivery (up to 15km)",
    responseTime: "Under 1 hour",
    rating: 4.98,
    reviewsCount: 42,
    description: "Professional full-frame mirrorless camera kit in pristine condition. Perfect for cinematic videography and high-resolution photography. Includes UV filter, extra battery, and rugged transport case.",
    accessoriesIncluded: ["2x Rechargeable Batteries", "Dual Slot Charger", "64GB V90 SD Card", "Peak Design Strap", "Waterproof Hard Case"],
    productHighlights: ["Real-time Eye AF for humans/animals", "4K 60p 10-bit 4:2:2 recording", "Active In-Body Image Stabilization"],
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1200"
    ]
  };

  const checklistItems = [
    { label: "Product title added", done: true },
    { label: "Photos uploaded (High-res)", done: true },
    { label: "Description completed", done: true },
    { label: "Rental price set", done: true },
    { label: "Category selected", done: true },
    { label: "Availability configured", done: true },
    { label: "Pickup location added", done: true },
    { label: "Terms accepted", done: true },
  ];

  const trustBadges = [
    { title: "Verified Listing", desc: "Identity and specs checked", icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" /> },
    { title: "Secure Payments", desc: "Escrow protection on deposits", icon: <Lock className="w-5 h-5 text-[#2563EB]" /> },
    { title: "Insurance Eligible", desc: "Up to ₹50,000 damage cover", icon: <Award className="w-5 h-5 text-[#2563EB]" /> },
    { title: "Identity Verified", desc: "Renter background screening", icon: <CheckCircle2 className="w-5 h-5 text-[#2563EB]" /> },
    { title: "High Visibility", desc: "Optimized for search ranking", icon: <TrendingUp className="w-5 h-5 text-[#2563EB]" /> },
  ];

  const suggestions = [
    { text: "Add one more photo from a different angle", done: false },
    { text: "Mention included accessories clearly", done: true },
    { text: "Add pickup timing window", done: true },
    { text: "Explain product condition details", done: true },
    { text: "Better title keyword optimization", done: true },
  ];

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#0F172A]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel max-w-xl w-full p-10 rounded-3xl text-center shadow-2xl border border-gray-200/80 relative overflow-hidden"
          >
            {/* Confetti / Celebration Sparkle Effect */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full">
              🎉 Congratulations!
            </span>

            <h1 className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight mt-3 mb-2">
              Your listing is now live.
            </h1>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Your item is visible to thousands of verified renters. You'll receive instant push notifications and emails when bookings come in.
            </p>

            {/* Live Product Card Snapshot */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 text-left flex items-center gap-4 shadow-xs">
              <img 
                src={listingData.images[0]} 
                alt={listingData.productName} 
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full mb-1">
                  {listingData.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {listingData.productName}
                </h3>
                <p className="text-xs font-extrabold text-[#2563EB] mt-1">
                  ₹{listingData.dailyPrice} <span className="text-xs text-gray-500 font-normal">/ day</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => router.push("/listings/sony-alpha-7iv")}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
              >
                View Listing
              </button>
              <button 
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="py-3.5 px-6 rounded-2xl border border-gray-200 bg-white text-gray-800 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Listing
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="py-3.5 px-6 rounded-2xl border border-gray-200 bg-white text-gray-800 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
              >
                List Another Item
              </button>
              <button 
                onClick={() => alert("Redirecting to Host Dashboard...")}
                className="py-3.5 px-6 rounded-2xl border border-gray-200 bg-white text-gray-800 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-32 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="mb-8">
          {/* Progress Step Indicator */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-3 overflow-x-auto pb-2">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><Check className="w-3 h-3 stroke-[3]" /> Product Details</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><Check className="w-3 h-3 stroke-[3]" /> Pricing</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><Check className="w-3 h-3 stroke-[3]" /> Availability</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><Check className="w-3 h-3 stroke-[3]" /> Photos</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1.5 text-white bg-[#2563EB] px-3.5 py-1 rounded-full shadow-sm shadow-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Preview & Publish
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            Review Your Listing
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Take a final look before publishing your item to thousands of renters.
          </p>
        </div>

        {/* PREVIEW DEVICE TABS */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 bg-white border border-gray-200/80 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Preview Mode:</span>
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActivePreviewDevice("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewDevice === 'desktop' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop Preview
              </button>
              <button 
                onClick={() => setActivePreviewDevice("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewDevice === 'tablet' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet Preview
              </button>
              <button 
                onClick={() => setActivePreviewDevice("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewDevice === 'mobile' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile Preview
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#2563EB] rounded-xl text-xs font-bold">
            <Eye className="w-4 h-4" /> Customer View Active
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDE: LARGE PRODUCT CARD PREVIEW (Span 8) ================= */}
          <div className={`lg:col-span-8 transition-all duration-300 mx-auto w-full ${
            activePreviewDevice === 'mobile' ? 'max-w-sm' : activePreviewDevice === 'tablet' ? 'max-w-2xl' : 'max-w-none'
          }`}>
            <motion.div 
              layout
              className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 bg-white space-y-8"
            >
              
              {/* Image Gallery Showcase */}
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video group">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={listingData.images[activeImageIndex]} 
                    alt={listingData.productName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Verified Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Listing
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                  </button>
                </div>

                {/* Thumbnail selector */}
                <div className="grid grid-cols-3 gap-3">
                  {listingData.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-[#2563EB] ring-2 ring-blue-100 scale-[1.02]' : 'border-transparent opacity-75 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full">
                      {listingData.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">• {listingData.subcategory}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {listingData.rating} ({listingData.reviewsCount} reviews)
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
                  {listingData.productName}
                </h2>

                <div className="flex items-center justify-between flex-wrap gap-4 py-3 border-y border-gray-100 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {listingData.owner[0]}
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Hosted by</span>
                      <span className="font-bold text-gray-900">{listingData.owner}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 text-[#2563EB]" /> {listingData.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <Clock className="w-4 h-4 text-emerald-600" /> Responds {listingData.responseTime}
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Rental Price (Daily)</span>
                  <span className="text-2xl font-extrabold text-[#2563EB]">₹{listingData.dailyPrice}</span>
                  <span className="text-xs text-gray-500"> / day</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Weekly Rate</span>
                  <span className="text-xl font-bold text-gray-900">₹{listingData.weeklyPrice}</span>
                  <span className="text-xs text-emerald-600 font-semibold block">10% discount</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Monthly Rate</span>
                  <span className="text-xl font-bold text-gray-900">₹{listingData.monthlyPrice}</span>
                  <span className="text-xs text-emerald-600 font-semibold block">30% discount</span>
                </div>
              </div>

              {/* Estimated Monthly Earnings Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Estimated Earnings Potential</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">₹18,000 <span className="text-sm font-normal text-blue-100">/ month</span></h3>
                  <p className="text-xs text-blue-100">Based on 20 days average monthly utilization in your region.</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Details & Accessories */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-lg text-gray-900 font-heading">Description & Highlights</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {listingData.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Included Accessories</h4>
                    <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                      {listingData.accessoriesIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Product Highlights</h4>
                    <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                      {listingData.productHighlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Deposit, Delivery & Condition Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block font-medium">Security Deposit</span>
                  <span className="font-bold text-gray-900 mt-0.5 block">₹{listingData.securityDeposit} (Refundable)</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block font-medium">Condition</span>
                  <span className="font-bold text-gray-900 mt-0.5 block">{listingData.condition}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-gray-400 block font-medium">Delivery & Pickup</span>
                  <span className="font-bold text-gray-900 mt-0.5 block">{listingData.deliveryOptions}</span>
                </div>
              </div>

              {/* Map Preview Mock */}
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-sm text-gray-900">Location Preview</h3>
                <div className="h-40 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-md border border-gray-200 text-xs font-bold text-gray-900 z-10">
                    <MapPin className="w-4 h-4 text-[#2563EB]" /> {listingData.location} (Approximate radius)
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* ================= RIGHT SIDE: CHECKLIST, AI SCORE & TRUST (Span 4) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Publishing Checklist Card */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-200/80 bg-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900 font-heading">Publishing Checklist</h3>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> 100% Complete
                </span>
              </div>

              <div className="space-y-3">
                {checklistItems.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">Done</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Listing Quality Score */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-200/80 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">AI Listing Quality Score</h4>
                    <span className="text-xs text-gray-500">Optimized for conversion</span>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-2xl">
                  94 / 100
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Suggestions & Tips</span>
                <div className="space-y-2">
                  {suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${sug.done ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {sug.done ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      </div>
                      <span className={sug.done ? 'line-through text-gray-400' : 'font-medium text-gray-800'}>{sug.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Section */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-200/80 bg-white space-y-4">
              <h3 className="font-bold text-base text-gray-900 font-heading">Host Protection & Trust</h3>
              <div className="space-y-3">
                {trustBadges.map((badge, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{badge.title}</h4>
                      <p className="text-[11px] text-gray-500">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes Information Box */}
            <div className="bg-blue-50/80 border border-blue-200/60 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#2563EB]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-sm">Important Host Notes</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2">✓ Your listing can be edited anytime.</li>
                <li className="flex items-center gap-2">✓ Bookings are fully protected by escrow.</li>
                <li className="flex items-center gap-2">✓ Payments are secure and direct.</li>
                <li className="flex items-center gap-2">✓ You control your availability calendar.</li>
                <li className="flex items-center gap-2">✓ You can pause or deactivate anytime.</li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* ================= STICKY BOTTOM ACTION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 py-4 px-6 lg:px-12 shadow-2xl">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={() => alert("Draft saved successfully!")}
              className="px-6 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer hidden sm:flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-gray-500" /> Save Draft
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden md:inline-block">Ready to earn? Publish in 1 click.</span>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={isPublishing}
              className="relative overflow-hidden px-10 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-extrabold text-base shadow-xl shadow-blue-500/30 hover:opacity-95 transition-all cursor-pointer flex items-center gap-3 animate-pulse"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Publish Listing</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}