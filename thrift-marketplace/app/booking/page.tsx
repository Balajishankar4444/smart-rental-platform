// app/page.tsx
"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Truck, 
  Store, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Clock,
  Sparkles,
  MapPin,
  Info,
  PackageCheck,
  Eye,
  CalendarDays,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link"; // Added Link import
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  BOOKING_REQUEST_LABELS,
  BookingRequest,
  fetchBookingRequests,
} from "@/utils/bookingRequests";
import {
  listingDailyPrice,
  listingImage,
  listingLocation,
  listingTitle,
  ListingSummary,
} from "@/utils/listings";

const PLATFORM_FEE = 100;
const DELIVERY_FEE = 250;
const OPENING_HOURS = "Mon - Sat: 9:00 AM - 8:00 PM (Sun: 10:00 AM - 4:00 PM)";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

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

interface Booking {
  id: string;
  productName: string;
  productImage: string;
  startDate: string;
  endDate: string;
  duration: number;
  fulfillmentType: "pickup" | "home";
  address: string;
  grandTotal: number;
  status: "Active" | "Completed" | "Pending";
  bookingDate: string;
}

function BookingFlow() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const requestId = searchParams.get("requestId");
  const [bookingRequest, setBookingRequest] = useState<BookingRequest | null>(null);
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [isLoadingListing, setIsLoadingListing] = useState(Boolean(requestId));
  const [bookingError, setBookingError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Step 1: Dates
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calendar View State
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  // Step 2: Fulfillment
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "home">("home");
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "#123, 4th Cross, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560034",
  });

  // Step 3: Summary & Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Step 4: Checkout Payment Portal
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet" | "later">("upi");
  const [upiId, setUpiId] = useState("balaji@okhdfcbank");
  const [cardDetails, setCardDetails] = useState({ number: "4242 •••• •••• 4242", expiry: "08/28", cvv: "123", name: "Balaji Shankar" });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("Paytm Wallet");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Dashboard / Booked Items List State
  const [bookedItems, setBookedItems] = useState<Booking[]>([]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Payment always follows an owner-approved request, so that drives the page
  useEffect(() => {
    if (!requestId || !user) return;

    let cancelled = false;

    const load = async () => {
      try {
        const requests = await fetchBookingRequests(user.id);
        const match = requests.find((item) => item.id === requestId) || null;
        if (cancelled) return;

        setBookingRequest(match);
        if (!match) return;

        setStartDate(match.startDate);
        setEndDate(match.endDate);

        const response = await fetch(`/api/auth/products?id=${encodeURIComponent(match.listingId)}`);
        const result = await response.json();
        if (!cancelled && result?.success) setListing(result.data as ListingSummary);
      } catch (err) {
        console.error("Failed to load booking request", err);
      } finally {
        if (!cancelled) setIsLoadingListing(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [requestId, user]);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    const existing = localStorage.getItem("user_bookings");
    if (!existing) {
      localStorage.setItem("user_bookings", JSON.stringify(bookedItems));
    }
  }, [bookedItems]);

  const calculateDuration = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const product = {
    name: listing ? listingTitle(listing) : "",
    image: listing ? listingImage(listing) : "",
    pricePerDay: listing ? listingDailyPrice(listing) : 0,
    securityDeposit: Number(listing?.securityDeposit) || 0,
    platformFee: PLATFORM_FEE,
    deliveryFeeCharge: DELIVERY_FEE,
    pickupAddress: listing ? listingLocation(listing) : "",
    openingHours: OPENING_HOURS,
  };

  const duration = calculateDuration();
  const rentalCost = duration * product.pricePerDay;
  const deliveryFee = fulfillmentType === "home" ? product.deliveryFeeCharge : 0;
  const discountAmount = appliedCoupon ? Math.round((rentalCost * appliedCoupon.discountPercent) / 100) : 0;
  const subtotalBeforeTax = rentalCost + product.platformFee + deliveryFee - discountAmount;
  const taxes = Math.round(subtotalBeforeTax * 0.18);
  const grandTotal = subtotalBeforeTax + taxes + product.securityDeposit;

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleApplyCoupon = () => {
    setIsApplying(true);
    setCouponError("");
    setTimeout(() => {
      setIsApplying(false);
      if (couponCode.trim().toUpperCase() === "RENT10") {
        setAppliedCoupon({ code: "RENT10", discountPercent: 10 });
      } else {
        setCouponError("Invalid promo code. Try 'RENT10'");
      }
    }, 400);
  };

  const handleCompleteOrder = async () => {
    if (!listing || !user || !bookingRequest) return;

    setIsConfirming(true);
    setBookingError("");

    try {
      // Paying an approved request is what starts the rental
      const response = await fetch("/api/auth/booking-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingRequest.id, userId: user.id, action: "pay" }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Payment failed");
      }

      setBookingRequest(result.data as BookingRequest);
      if (result.listing) setListing(result.listing as ListingSummary);
      setIsConfirmed(true);

      // Add to booked items dashboard state & localStorage
      const newBooking: Booking = {
        id: `RNT-${Math.floor(100000 + Math.random() * 900000)}`,
        productName: product.name,
        productImage: product.image,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        fulfillmentType: fulfillmentType,
        address: fulfillmentType === "home" 
          ? `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.pincode}` 
          : product.pickupAddress,
        grandTotal: grandTotal,
        status: "Active",
        bookingDate: new Date().toISOString().split("T")[0]
      };

      setBookedItems(prev => {
        const updated = [newBooking, ...prev];
        localStorage.setItem("user_bookings", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoadingListing) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (!isConfirmed && (!bookingRequest || bookingRequest.status !== "approved" || !listing)) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center pt-28 pb-12">
            <h1 className="text-xl font-bold text-slate-900">
              {bookingRequest ? "This booking is not ready for payment" : "No approved booking"}
            </h1>
            <p className="text-sm text-slate-500">
              {bookingRequest
                ? BOOKING_REQUEST_LABELS[bookingRequest.status]
                : "Ask the owner to approve your dates first — you can pay once they accept."}
            </p>
            <Link
              href="/dashboard/view-booking?tab=notifications"
              className="text-sm font-semibold text-[#2563EB]"
            >
              Go to notifications
            </Link>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111827] selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-12">
        {/* Step Indicator Tracker */}
        <div className="mb-10 bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-4 gap-2 sm:gap-6 relative w-full items-center justify-between">
            {[
              { step: 1, label: "Select Dates" },
              { step: 2, label: "Fulfillment" },
              { step: 3, label: "Summary" },
              { step: 4, label: "Checkout" },
            ].map((item) => {
              const isCompleted = currentStep > item.step || isConfirmed;
              const isCurrent = currentStep === item.step && !isConfirmed;

              return (
                <div key={item.step} className="flex flex-col items-center justify-center text-center relative z-10 w-full">
                  <button
                    onClick={() => item.step < currentStep && goToStep(item.step)}
                    disabled={item.step > currentStep}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-extrabold text-base sm:text-lg transition-all shadow-sm ${
                      isCompleted 
                        ? "bg-[#10B981] text-white shadow-emerald-600/20" 
                        : isCurrent 
                        ? "bg-[#2563EB] text-white ring-4 ring-blue-600/20 shadow-blue-600/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : item.step}
                  </button>
                  <span className={`mt-3 text-xs sm:text-sm font-bold truncate max-w-full px-1 ${isCurrent ? "text-[#2563EB]" : isCompleted ? "text-[#10B981]" : "text-gray-400"}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" custom={direction}>
              
              {/* STEP 1: SELECT DATES */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-[#E2E8F0] pb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0F172A]">Select Rental Dates</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose your flexible rental schedule with instant price updates</p>
                  </div>

                  {/* Date Picker Trigger Bar */}
                  <div className="relative" ref={calendarRef}>
                    <div 
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
                      className="flex items-center justify-between w-full px-5 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl cursor-pointer transition-all shadow-sm group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Rental Period</span>
                          <span className="text-sm font-extrabold text-[#0F172A]">
                            {formatDisplayDate(startDate)} {endDate ? `- ${formatDisplayDate(endDate)}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-3.5 py-2 rounded-xl">
                          {duration} Days Selected
                        </span>
                      </div>
                    </div>

                    {/* Popover Calendar Card */}
                    {isCalendarOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute left-0 right-0 sm:right-auto mt-3 p-6 bg-white border border-slate-100 rounded-[28px] shadow-2xl z-50 w-full sm:w-[360px]"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                            {MONTH_NAMES[currentMonth]} {currentYear}
                          </h3>
                          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button 
                              onClick={prevMonth}
                              aria-label="Previous month"
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={nextMonth}
                              aria-label="Next month"
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-3">
                          {WEEKDAYS.map((w) => (
                            <span key={w} className="text-[11px] font-extrabold text-slate-400 tracking-wider">{w}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                          {getDaysInMonth(currentYear, currentMonth).map(({ day, dateStr, isCurrentMonth }, idx) => {
                            const isSelected = dateStr === startDate || dateStr === endDate;
                            const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

                            return (
                              <button
                                key={idx}
                                onClick={() => handleDateClick(dateStr)}
                                className={`h-10 w-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                  isSelected 
                                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 scale-105 rounded-2xl z-10 font-extrabold" 
                                    : isInRange 
                                    ? "bg-blue-50 text-[#2563EB] rounded-none" 
                                    : isCurrentMonth 
                                    ? "text-slate-800 hover:bg-slate-100 rounded-xl" 
                                    : "text-slate-300 hover:bg-slate-50 rounded-xl"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                          <button 
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1"
                          >
                            Clear
                          </button>
                          <button 
                            onClick={() => setIsCalendarOpen(false)}
                            className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Rate</span>
                      <span className="text-lg font-extrabold text-[#0F172A] mt-1 block">₹{product.pricePerDay}/day</span>
                    </div>
                    <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                      <span className="text-lg font-extrabold text-[#2563EB] mt-1 block">{duration} Days</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-[#FAFAFA] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Total</span>
                      <span className="text-lg font-extrabold text-[#10B981] mt-1 block">₹{rentalCost}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={() => goToStep(2)} className="flex items-center space-x-2 px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer">
                      <span>Continue to Fulfillment</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PICKUP OR DELIVERY */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-[#E2E8F0] pb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0F172A]">Pickup or Delivery</h2>
                    <p className="text-sm text-gray-500 mt-1">Select how you wish to receive your equipment</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setFulfillmentType("pickup")} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${fulfillmentType === "pickup" ? "border-[#2563EB] bg-blue-50/40 text-[#2563EB]" : "border-[#E2E8F0] text-gray-600 hover:border-gray-300"}`}>
                      <Store className="w-8 h-8 mb-3" />
                      <span className="font-extrabold text-base">Store Pickup</span>
                      <span className="text-xs opacity-75 mt-1 font-medium">Free of charge</span>
                    </button>

                    <button onClick={() => setFulfillmentType("home")} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${fulfillmentType === "home" ? "border-[#2563EB] bg-blue-50/40 text-[#2563EB]" : "border-[#E2E8F0] text-gray-600 hover:border-gray-300"}`}>
                      <Truck className="w-8 h-8 mb-3" />
                      <span className="font-extrabold text-base">Home Delivery</span>
                      <span className="text-xs opacity-75 mt-1 font-medium">₹250 fee applies</span>
                    </button>
                  </div>

                  {fulfillmentType === "pickup" ? (
                    <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-extrabold text-sm text-[#0F172A]">Pickup Address</h4>
                          <p className="text-xs text-gray-600 mt-1">{product.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 pt-3 border-t border-gray-200">
                        <Clock className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-extrabold text-sm text-[#0F172A]">Opening Hours</h4>
                          <p className="text-xs text-gray-600 mt-1">{product.openingHours}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 font-medium">
                        📍 Directions: Easily accessible near Brigade Road Metro Station with dedicated customer parking.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
                      <h4 className="font-extrabold text-sm font-heading text-[#0F172A]">Enter Delivery Address</h4>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address, Apartment, Suite *</label>
                        <input type="text" value={deliveryDetails.address} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                          <input type="text" value={deliveryDetails.city} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                          <input type="text" value={deliveryDetails.state} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                          <input type="text" value={deliveryDetails.pincode} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, pincode: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 text-xs text-gray-500 font-medium">
                        <span>🚚 Delivery Charges: ₹250</span>
                        <span>Estimated Time: Within 24 Hours</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => goToStep(1)} className="flex items-center space-x-2 px-6 py-3.5 bg-gray-100 font-bold text-gray-700 rounded-2xl hover:bg-gray-200 cursor-pointer">
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button onClick={() => goToStep(3)} className="flex items-center space-x-2 px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 cursor-pointer">
                      <span>Proceed to Summary</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BOOKING SUMMARY */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-[#E2E8F0] pb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0F172A]">Booking Summary</h2>
                    <p className="text-sm text-gray-500 mt-1">Review your item details, apply coupons, and check policies</p>
                  </div>

                  <div className="flex items-center space-x-4 bg-[#FAFAFA] p-4 rounded-2xl border border-[#E2E8F0]">
                    <img src={product.image} alt="" className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    <div>
                      <h3 className="font-extrabold font-heading text-base text-[#0F172A]">{product.name}</h3>
                      <p className="text-xs text-[#2563EB] font-bold mt-1">₹{product.pricePerDay} / day • {startDate} to {endDate}</p>
                    </div>
                  </div>

                  <div className="bg-[#FAFAFA] p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      Have a Coupon Code? (Try <span className="text-[#2563EB] font-mono">RENT10</span>)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                      <button onClick={handleApplyCoupon} disabled={isApplying} className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-all cursor-pointer">
                        {isApplying ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Coupon '{appliedCoupon.code}' applied successfully! ({appliedCoupon.discountPercent}% OFF)</span>
                      </motion.div>
                    )}
                    {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
                  </div>

                  <div className="space-y-3 text-xs bg-[#FAFAFA] p-5 rounded-2xl border border-[#E2E8F0]">
                    <div className="flex justify-between text-gray-600"><span>Rental Cost ({duration} Days)</span><span className="font-semibold text-gray-900">₹{rentalCost}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Security Deposit (Refundable)</span><span className="font-semibold text-gray-900">₹{product.securityDeposit}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Platform Fee</span><span className="font-semibold text-gray-900">₹{product.platformFee}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Delivery Fee ({fulfillmentType === "home" ? "Home Delivery" : "Store Pickup"})</span><span className="font-semibold text-gray-900">₹{deliveryFee}</span></div>
                    {appliedCoupon && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount ({appliedCoupon.discountPercent}%)</span><span>-₹{discountAmount}</span></div>}
                    <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-3"><span>Taxes (GST 18%)</span><span className="font-semibold text-gray-900">₹{taxes}</span></div>
                    <div className="flex justify-between text-base font-extrabold pt-2">
                      <span className="text-[#0F172A]">Grand Total</span>
                      <span className="text-[#2563EB]">₹{grandTotal}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                      <h4 className="font-extrabold text-[#0F172A] flex items-center"><ShieldCheck className="w-4 h-4 text-[#10B981] mr-1.5" /> Rental Policy</h4>
                      <p className="text-gray-500 leading-relaxed">Equipment must be returned in the exact condition received. Late returns incur a 1.5x daily penalty fee.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                      <h4 className="font-extrabold text-[#0F172A] flex items-center"><Info className="w-4 h-4 text-[#2563EB] mr-1.5" /> Cancellation Policy</h4>
                      <p className="text-gray-500 leading-relaxed">Free cancellation up to 48 hours before rental start date. 100% refund of deposit and rental amount.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => goToStep(2)} className="flex items-center space-x-2 px-6 py-3.5 bg-gray-100 font-bold text-gray-700 rounded-2xl hover:bg-gray-200 cursor-pointer">
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button onClick={() => goToStep(4)} className="flex items-center space-x-2 px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 cursor-pointer">
                      <span>Proceed to Secure Checkout</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CHECKOUT */}
              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-[#E2E8F0] pb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0F172A]">Secure Payment Portal</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose from industry-standard encrypted Indian payment instruments</p>
                  </div>

                  {isConfirmed ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4">
                      <div className="w-16 h-16 bg-[#10B981] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h3 className="text-2xl font-extrabold font-heading text-emerald-900">Booking Confirmed Successfully!</h3>
                      <p className="text-sm text-emerald-700 max-w-md mx-auto">
                        Order confirmation & digital pass sent to your registered mobile and email. Security deposit of ₹1,500 is fully refundable upon return.
                      </p>
                      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                        <Link 
                          href="/dashboard/view-booking?tab=rentals"
                          className="flex items-center space-x-2 px-6 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>View Bookings</span>
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#FAFAFA] p-1.5 rounded-2xl border border-[#E2E8F0]">
                        {[
                          { id: "upi", label: "UPI", icon: Smartphone },
                          { id: "card", label: "Card", icon: CreditCard },
                          { id: "netbanking", label: "NetBanking", icon: Building2 },
                          { id: "wallet", label: "Wallet", icon: Wallet },
                          { id: "later", label: "Pay Later", icon: Clock },
                        ].map((m) => {
                          const IconComp = m.icon;
                          const active = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setPaymentMethod(m.id as any)}
                              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                active ? "bg-white text-[#2563EB] shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"
                              }`}
                            >
                              <IconComp className="w-4 h-4 mb-1.5" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
                        {paymentMethod === "upi" && (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-700">UPI ID / Virtual Payment Address (VPA)</label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@okhdfcbank"
                                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none font-mono"
                              />
                            </div>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] mr-1 inline" /> Supported apps: GPay, PhonePe, Paytm, BHIM UPI
                            </p>
                          </div>
                        )}

                        {paymentMethod === "card" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                              <input type="text" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                                <input type="text" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">CVV / PIN</label>
                                <input type="password" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-mono" />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === "netbanking" && (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-700">Select Popular Bank</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((bank) => (
                                <button
                                  key={bank}
                                  onClick={() => setSelectedBank(bank)}
                                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                                    selectedBank === bank ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-gray-200 bg-white text-gray-700"
                                  }`}
                                >
                                  {bank}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {paymentMethod === "wallet" && (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-700">Select Digital Wallet</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Paytm Wallet", "Mobikwik", "Freecharge"].map((wallet) => (
                                <button
                                  key={wallet}
                                  onClick={() => setSelectedWallet(wallet)}
                                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                                    selectedWallet === wallet ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-gray-200 bg-white text-gray-700"
                                  }`}
                                >
                                  {wallet}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {paymentMethod === "later" && (
                          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                            <h4 className="text-xs font-extrabold text-amber-900 flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 text-amber-700" /> Pay Later (Coming Soon)
                            </h4>
                            <p className="text-xs text-amber-700">
                              Enjoy zero-cost credit splits with our lending partners (ZestMoney / Simpl). Feature unlocks in Q3 2026.
                            </p>
                          </div>
                        )}
                      </div>

                      {bookingError && (
                        <p className="pt-4 text-sm font-semibold text-red-600">{bookingError}</p>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <button onClick={() => goToStep(3)} className="flex items-center space-x-2 px-6 py-3.5 bg-gray-100 font-bold text-gray-700 rounded-2xl hover:bg-gray-200 cursor-pointer">
                          <ArrowLeft className="w-5 h-5" />
                          <span>Back</span>
                        </button>
                        <button
                          disabled={paymentMethod === "later"}
                          onClick={handleCompleteOrder}
                          className={`flex items-center space-x-2 px-8 py-4 bg-[#10B981] hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer ${paymentMethod === "later" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {isConfirming ? (
                            <span className="flex items-center space-x-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Authorizing Secure Gateway...</span>
                            </span>
                          ) : (
                            <span>Confirm Booking & Pay ₹{grandTotal}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sticky Sidebar Summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <h3 className="font-extrabold font-heading text-lg text-[#0F172A]">
                  Rental Summary
                </h3>
                <Link 
                  href="/dashboard/view-booking?tab=rentals"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Bookings ({bookedItems.length})</span>
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <img src={product.image} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                <div className="truncate">
                  <h4 className="font-extrabold text-xs font-heading text-[#0F172A] truncate">{product.name}</h4>
                  <span className="text-xs text-[#2563EB] font-bold">₹{product.pricePerDay} / day</span>
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-[#E2E8F0] pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Dates</span>
                  <span className="font-semibold text-gray-800">{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Duration</span>
                  <span className="font-semibold text-gray-800">{duration} Days</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Rental Cost</span>
                  <span className="font-semibold text-gray-800">₹{rentalCost}</span>
                </div>
                <div className="flex justify-between text-gray-500 border-b border-[#E2E8F0] pb-3">
                  <span>Deposit (Refundable)</span>
                  <span className="font-semibold text-gray-800">₹{product.securityDeposit}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-extrabold pt-2">
                  <span className="text-[#0F172A]">Total Payable</span>
                  <span className="text-[#2563EB]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center space-x-2 text-xs text-gray-700 bg-[#FAFAFA] p-3 rounded-2xl font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-700 bg-[#FAFAFA] p-3 rounded-2xl font-medium">
                  <Lock className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span>Damage Protection</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-700 bg-[#FAFAFA] p-3 rounded-2xl font-medium">
                  <Store className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>Verified Owner</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-700 bg-[#FAFAFA] p-3 rounded-2xl font-medium">
                  <Headphones className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <BookingFlow />
    </Suspense>
  );
}