// app/listings/[id]/page.tsx
"use client";

import React, { use, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Star,
  Heart,
  Share2,
  Clock,
  Check,
  Calendar,
  ArrowLeft,
  Lock,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface ListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PublicLiveListingPage({ params }: ListingPageProps) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });
  const [isBooked, setIsBooked] = useState(false);

  const listingData = {
    id: listingId,
    productName: "Sony Alpha 7IV Mirrorless Camera with 24-70mm Lens",
    category: "Cameras",
    subcategory: "Full-Frame Cameras",
    condition: "Like New (Mint Condition)",
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
    description:
      "Professional full-frame mirrorless camera kit in pristine condition. Perfect for cinematic videography and high-resolution photography. Includes UV filter, extra battery, and rugged transport case.",
    accessoriesIncluded: ["2x Rechargeable Batteries", "Dual Slot Charger", "64GB V90 SD Card", "Peak Design Strap", "Waterproof Hard Case"],
    productHighlights: ["Real-time Eye AF for humans/animals", "4K 60p 10-bit 4:2:2 recording", "Active In-Body Image Stabilization"],
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1200",
    ],
  };

  const handleBooking = () => {
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-32 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-xs text-gray-500">Listing ID: {listingData.id}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            {listingData.productName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">A real listing page for id <strong>{listingId}</strong>.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video shadow-lg group">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={listingData.images[activeImageIndex]}
                  alt={listingData.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Item & Owner
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {listingData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all cursor-pointer shadow-xs ${activeImageIndex === idx ? 'border-[#2563EB] ring-2 ring-blue-100 scale-[1.02]' : 'border-transparent opacity-75 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3.5 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full">
                  {listingData.category} • {listingData.subcategory}
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {listingData.rating} ({listingData.reviewsCount} reviews)
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gray-200/80 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {listingData.owner[0]}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Hosted by</span>
                    <span className="font-bold text-gray-900">{listingData.owner}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs">
                  <MapPin className="w-4 h-4 text-[#2563EB]" /> {listingData.location}
                </div>
                <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs">
                  <Clock className="w-4 h-4 text-emerald-600" /> Responds {listingData.responseTime}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 font-heading">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{listingData.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Included Accessories</h4>
                  <ul className="space-y-2 text-xs text-gray-700 font-medium">
                    {listingData.accessoriesIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Product Highlights</h4>
                  <ul className="space-y-2 text-xs text-gray-700 font-medium">
                    {listingData.productHighlights.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#2563EB]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <h5 className="font-bold text-xs text-gray-900">Secure Escrow</h5>
                  <p className="text-[10px] text-gray-500">Deposit protected</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600" />
                <div>
                  <h5 className="font-bold text-xs text-gray-900">Damage Cover</h5>
                  <p className="text-[10px] text-gray-500">Up to ₹50,000 insured</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
                <Lock className="w-5 h-5 text-indigo-600" />
                <div>
                  <h5 className="font-bold text-xs text-gray-900">Verified ID</h5>
                  <p className="text-[10px] text-gray-500">Trusted host profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/90 bg-white space-y-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-3xl font-extrabold text-[#2563EB]">₹{listingData.dailyPrice}</span>
                  <span className="text-xs text-gray-500 font-medium"> / day</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Available Now
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-4 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
              >
                {isBooked ? "Booked" : "Book Now"}
              </button>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="font-bold">Weekly</p>
                  <p className="mt-2">₹{listingData.weeklyPrice}</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="font-bold">Monthly</p>
                  <p className="mt-2">₹{listingData.monthlyPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}