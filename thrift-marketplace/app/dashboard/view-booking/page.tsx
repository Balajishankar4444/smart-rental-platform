// app/dashboard/view-bookings/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  FileText, 
  MessageSquare, 
  Phone, 
  Download, 
  Plus, 
  X, 
  Bell, 
  Star, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Eye,
  Share2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ==========================================
// MOCK DATA & TYPES
// ==========================================

type BookingStatus = 
  | "Pending" 
  | "Confirmed" 
  | "Active" 
  | "Completed" 
  | "Cancelled" 
  | "Refund Processing"
  | "Awaiting Pickup"
  | "Awaiting Return";

interface Booking {
  id: string;
  bookingId: string;
  productName: string;
  category: string;
  image: string;
  status: BookingStatus;
  rentalDates: string;
  pickupDate: string;
  returnDate: string;
  rentalDuration: string;
  location: string;
  fulfillment: "Store Pickup" | "Home Delivery";
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerPhone: string;
  amountPaid: number;
  securityDeposit: number;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Processing";
  bookingDate: string;
  remainingDays?: number;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b-1",
    bookingId: "REN-2026-8942",
    productName: "Sony Alpha a7 IV Mirrorless Camera + 24-70mm Lens",
    category: "Cameras & Optics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    status: "Active",
    rentalDates: "Aug 13, 2026 - Aug 20, 2026",
    pickupDate: "Aug 13, 2026 (10:00 AM)",
    returnDate: "Aug 20, 2026 (6:00 PM)",
    rentalDuration: "7 Days",
    location: "Store #42, Brigade Road, Bengaluru",
    fulfillment: "Store Pickup",
    ownerName: "Arjun Mehta",
    ownerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    ownerRating: 4.9,
    ownerPhone: "+91 98765 43210",
    amountPaid: 6164,
    securityDeposit: 1500,
    paymentStatus: "Paid",
    bookingDate: "Aug 1, 2026",
    remainingDays: 4,
    timeline: [
      { title: "Booking Requested", date: "Aug 1, 2026 - 02:15 PM", completed: true },
      { title: "Owner Accepted", date: "Aug 1, 2026 - 04:30 PM", completed: true },
      { title: "Payment Completed", date: "Aug 1, 2026 - 04:32 PM", completed: true },
      { title: "Ready for Pickup", date: "Aug 13, 2026 - 09:00 AM", completed: true },
      { title: "Rental Started", date: "Aug 13, 2026 - 10:15 AM", completed: true, current: true },
      { title: "Return Reminder", date: "Aug 19, 2026", completed: false },
      { title: "Returned Successfully", date: "Aug 20, 2026", completed: false },
      { title: "Deposit Refunded", date: "Pending Inspection", completed: false },
      { title: "Completed", date: "Pending", completed: false }
    ]
  },
  {
    id: "b-2",
    bookingId: "REN-2026-7812",
    productName: "DJI Mavic 3 Pro Drone with Fly More Combo",
    category: "Drones & Aerial",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    status: "Confirmed",
    rentalDates: "Aug 25, 2026 - Aug 28, 2026",
    pickupDate: "Aug 25, 2026 (9:00 AM)",
    returnDate: "Aug 28, 2026 (8:00 PM)",
    rentalDuration: "3 Days",
    location: "Koramangala 4th Block, Bengaluru",
    fulfillment: "Home Delivery",
    ownerName: "Priya Sharma",
    ownerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    ownerRating: 4.8,
    ownerPhone: "+91 91234 56789",
    amountPaid: 4200,
    securityDeposit: 3000,
    paymentStatus: "Paid",
    bookingDate: "Aug 3, 2026",
    timeline: [
      { title: "Booking Requested", date: "Aug 3, 2026 - 11:00 AM", completed: true },
      { title: "Owner Accepted", date: "Aug 3, 2026 - 12:30 PM", completed: true },
      { title: "Payment Completed", date: "Aug 3, 2026 - 12:31 PM", completed: true, current: true },
      { title: "Ready for Pickup", date: "Aug 25, 2026", completed: false },
      { title: "Rental Started", date: "Aug 25, 2026", completed: false },
      { title: "Completed", date: "Pending", completed: false }
    ]
  },
  {
    id: "b-3",
    bookingId: "REN-2026-6540",
    productName: "Apple MacBook Pro 16\" M3 Max (32GB/1TB SSD)",
    category: "Computing & Tech",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    status: "Completed",
    rentalDates: "Jul 10, 2026 - Jul 20, 2026",
    pickupDate: "Jul 10, 2026",
    returnDate: "Jul 20, 2026",
    rentalDuration: "10 Days",
    location: "Indiranagar, Bengaluru",
    fulfillment: "Store Pickup",
    ownerName: "Rahul Verma",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    ownerRating: 5.0,
    ownerPhone: "+91 99887 76655",
    amountPaid: 12500,
    securityDeposit: 5000,
    paymentStatus: "Paid",
    bookingDate: "Jul 5, 2026",
    timeline: [
      { title: "Booking Requested", date: "Jul 5, 2026", completed: true },
      { title: "Owner Accepted", date: "Jul 5, 2026", completed: true },
      { title: "Payment Completed", date: "Jul 5, 2026", completed: true },
      { title: "Returned Successfully", date: "Jul 20, 2026", completed: true },
      { title: "Deposit Refunded", date: "Jul 21, 2026", completed: true },
      { title: "Completed", date: "Jul 21, 2026", completed: true, current: true }
    ]
  },
  {
    id: "b-4",
    bookingId: "REN-2026-5412",
    productName: "Yamaha P-125 88-Key Weighted Digital Piano",
    category: "Musical Instruments",
    image: "https://images.unsplash.com/photo-1520523839896-5aa63328e12e?auto=format&fit=crop&w=800&q=80",
    status: "Cancelled",
    rentalDates: "Jun 01, 2026 - Jun 07, 2026",
    pickupDate: "Jun 01, 2026",
    returnDate: "Jun 07, 2026",
    rentalDuration: "6 Days",
    location: "Jayanagar, Bengaluru",
    fulfillment: "Home Delivery",
    ownerName: "Sneha Rao",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    ownerRating: 4.7,
    ownerPhone: "+91 98112 23344",
    amountPaid: 2400,
    securityDeposit: 1000,
    paymentStatus: "Refunded",
    bookingDate: "May 28, 2026",
    timeline: [
      { title: "Booking Requested", date: "May 28, 2026", completed: true },
      { title: "Cancelled by User", date: "May 29, 2026", completed: true, current: true }
    ]
  },
  {
    id: "b-5",
    bookingId: "REN-2026-9021",
    productName: "GoPro Hero 12 Black Creator Edition",
    category: "Action Cameras",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
    status: "Pending",
    rentalDates: "Sep 01, 2026 - Sep 05, 2026",
    pickupDate: "Sep 01, 2026",
    returnDate: "Sep 05, 2026",
    rentalDuration: "4 Days",
    location: "MG Road, Bengaluru",
    fulfillment: "Store Pickup",
    ownerName: "Karan Johar",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    ownerRating: 4.6,
    ownerPhone: "+91 97000 11223",
    amountPaid: 2200,
    securityDeposit: 1000,
    paymentStatus: "Pending",
    bookingDate: "Aug 3, 2026",
    timeline: [
      { title: "Booking Requested", date: "Aug 3, 2026 - 08:00 PM", completed: true, current: true },
      { title: "Owner Acceptance Pending", date: "Awaiting approval", completed: false }
    ]
  }
];

const NOTIFICATIONS = [
  { id: 1, title: "Booking Approved", desc: "Your rental for DJI Mavic 3 Pro was accepted by Priya.", time: "2 hrs ago", type: "success" },
  { id: 2, title: "Payment Successful", desc: "₹4,200 charged securely via UPI.", time: "2 hrs ago", type: "success" },
  { id: 3, title: "Return Tomorrow", desc: "Sony Alpha a7 IV is due for return tomorrow by 6:00 PM.", time: "1 day ago", type: "warning" },
  { id: 4, title: "Deposit Refunded", desc: "₹5,000 security deposit refunded for MacBook Pro.", time: "2 weeks ago", type: "info" }
];

const SUGGESTED_ITEMS = [
  { id: "s-1", name: "DJI Ronin-SC 3-Axis Gimbal Stabilizer", price: "₹450/day", image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=400&q=80", tag: "Because you rented Sony a7 IV" },
  { id: "s-2", name: "Rode Wireless PRO Dual Mic System", price: "₹350/day", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80", tag: "Trending Nearby" },
  { id: "s-3", name: "Aputure Amaran 200d LED Video Light", price: "₹600/day", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80", tag: "Popular in Cameras" }
];

// ==========================================
// HELPER COMPONENTS
// ==========================================

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case "Pending":
    case "Awaiting Pickup":
    case "Awaiting Return":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Active":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm animate-pulse";
    case "Completed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "Refund Processing":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function MyBookingsPage() {
  // ✅ Correctly called inside the function component body
  const router = useRouter();

  // Loading & Skeleton State simulation
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [activeBookingModal, setActiveBookingModal] = useState<Booking | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTabModal, setActiveTabModal] = useState<"details" | "timeline" | "tracking" | "invoice">("details");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & Sort Logic
  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => {
      const matchesSearch = 
        b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (selectedFilter === "All") return true;
      if (selectedFilter === "Upcoming") return b.status === "Confirmed";
      if (selectedFilter === "Active") return b.status === "Active";
      if (selectedFilter === "Completed") return b.status === "Completed";
      if (selectedFilter === "Cancelled") return b.status === "Cancelled";
      if (selectedFilter === "Pending Approval") return b.status === "Pending";
      if (selectedFilter === "Awaiting Pickup") return b.status === "Awaiting Pickup" || b.status === "Confirmed";
      if (selectedFilter === "Awaiting Return") return b.status === "Awaiting Return" || b.status === "Active";
      
      return true;
    }).sort((a, b) => {
      if (selectedSort === "Newest") return b.id.localeCompare(a.id);
      if (selectedSort === "Oldest") return a.id.localeCompare(b.id);
      if (selectedSort === "Highest Price") return b.amountPaid - a.amountPaid;
      if (selectedSort === "Lowest Price") return a.amountPaid - b.amountPaid;
      return 0;
    });
  }, [searchQuery, selectedFilter, selectedSort]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = MOCK_BOOKINGS.length;
    const active = MOCK_BOOKINGS.filter(b => b.status === "Active").length;
    const upcoming = MOCK_BOOKINGS.filter(b => b.status === "Confirmed").length;
    const completed = MOCK_BOOKINGS.filter(b => b.status === "Completed").length;
    const cancelled = MOCK_BOOKINGS.filter(b => b.status === "Cancelled").length;
    const totalSpent = MOCK_BOOKINGS.filter(b => b.status !== "Cancelled").reduce((acc, curr) => acc + curr.amountPaid, 0);
    return { total, active, upcoming, completed, cancelled, totalSpent };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111827] selection:bg-blue-600 selection:text-white font-sans">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-800 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= HEADER & STATS ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#0F172A] tracking-tight">My Bookings</h1>
              <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-extrabold rounded-full border border-blue-200">
                {MOCK_BOOKINGS.length} Rentals
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage all your rentals in one place with real-time status tracking.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-3 bg-white border border-gray-200 hover:border-blue-600 rounded-2xl text-gray-700 transition-all shadow-sm cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>
            <a 
              href="/"
              className="px-5 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Browse Rentals</span>
            </a>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Bookings", value: stats.total, color: "text-slate-900", bg: "bg-white" },
            { label: "Active Rentals", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50/50 border-emerald-100" },
            { label: "Upcoming Rentals", value: stats.upcoming, color: "text-blue-700", bg: "bg-blue-50/50 border-blue-100" },
            { label: "Completed", value: stats.completed, color: "text-slate-700", bg: "bg-white" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red-600", bg: "bg-red-50/50 border-red-100" },
            { label: "Total Spent", value: `₹${stats.totalSpent.toLocaleString()}`, color: "text-slate-900", bg: "bg-white" },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} border border-[#E2E8F0] p-5 rounded-3xl shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{stat.label}</span>
              <span className={`text-2xl font-extrabold mt-2 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* ================= TOP FILTER BAR ================= */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by equipment, booking ID, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort:</span>
              </div>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-2xl text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Highest Price">Highest Price</option>
                <option value="Lowest Price">Lowest Price</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              "All", 
              "Upcoming", 
              "Active", 
              "Completed", 
              "Cancelled", 
              "Pending Approval", 
              "Awaiting Pickup", 
              "Awaiting Return"
            ].map((filter) => {
              const active = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    active 
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-600/20" 
                      : "bg-[#FAFAFA] text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= BOOKINGS LIST / GRID ================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-3xl p-6 h-72 animate-pulse flex flex-col justify-between">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl flex-shrink-0"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-[#2563EB] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Calendar className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-xl font-extrabold text-[#0F172A]">No bookings yet</h3>
              <p className="text-sm text-gray-500">You haven't placed any rental orders matching this filter. Explore professional gear to start renting.</p>
            </div>
            <div>
              <a 
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-blue-600/25 transition-all"
              >
                <span>Browse Rentals</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                {/* Top Section: Image & Info */}
                <div className="flex items-start space-x-4">
                  <img 
                    src={booking.image} 
                    alt={booking.productName} 
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl flex-shrink-0 border border-gray-100 shadow-sm" 
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-gray-400">{booking.category}</span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold font-heading text-base text-[#0F172A] truncate">{booking.productName}</h3>
                    <p className="text-xs font-bold text-gray-500 flex items-center">
                      <span className="font-mono text-[#2563EB] mr-2">{booking.bookingId}</span>
                      <span>• {booking.rentalDuration}</span>
                    </p>

                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{booking.rentalDates}</span>
                    </div>
                  </div>
                </div>

                {/* Active Rental Specific Card Enhancement */}
                {booking.status === "Active" && booking.remainingDays !== undefined && (
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs">
                        {booking.remainingDays}d
                      </div>
                      <div>
                        <span className="block text-xs font-extrabold text-emerald-900">Active Rental Period</span>
                        <span className="text-[11px] text-emerald-700 font-medium">Return due in {booking.remainingDays} days</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setActiveBookingModal(booking); setActiveTabModal("tracking"); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                    >
                      Extend Rental
                    </button>
                  </div>
                )}

                {/* Owner & Amount Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={booking.ownerAvatar} alt={booking.ownerName} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <span className="block font-extrabold text-slate-900">{booking.ownerName}</span>
                      <span className="text-[10px] text-gray-400 flex items-center font-medium">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" /> {booking.ownerRating} Owner
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Total Paid</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">₹{booking.amountPaid.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => { setActiveBookingModal(booking); setActiveTabModal("details"); }}
                    className="flex-1 py-3 bg-[#FAFAFA] hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>View Details</span>
                  </button>

                  <button 
                    onClick={() => { setActiveBookingModal(booking); setActiveTabModal("tracking"); }}
                    className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Track Rental</span>
                  </button>

                  <button 
                    onClick={() => showToast(`Initiating chat with ${booking.ownerName}...`)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 transition-all cursor-pointer"
                    aria-label="Chat with Owner"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= RECOMMENDATIONS ================= */}
        <div className="pt-10 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold font-heading text-[#0F172A]">Recommended For You</h3>
              <p className="text-xs text-gray-500 mt-0.5">Based on your recent Sony Alpha & high-tech camera rentals</p>
            </div>
            <a href="/" className="text-xs font-extrabold text-[#2563EB] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SUGGESTED_ITEMS.map((item) => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold rounded-lg">
                    {item.tag}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#0F172A] truncate">{item.name}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-extrabold text-[#2563EB]">{item.price}</span>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors flex items-center">
                      Rent Now <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />

      {/* ================= NOTIFICATIONS PANEL ================= */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-[#2563EB]" />
                    <h3 className="font-extrabold text-lg text-[#0F172A]">Notifications</h3>
                  </div>
                  <button onClick={() => setIsNotificationsOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl space-y-1.5 hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-[#0F172A]">{n.title}</h4>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { showToast("All notifications marked as read"); setIsNotificationsOpen(false); }}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
              >
                Mark All as Read
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= BOOKING DETAILS MODAL ================= */}
      <AnimatePresence>
        {activeBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white border border-[#E2E8F0] rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFAFA]">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-extrabold px-3 py-1 bg-blue-50 text-[#2563EB] rounded-xl border border-blue-200">
                    {activeBookingModal.bookingId}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${getStatusBadge(activeBookingModal.status)}`}>
                    {activeBookingModal.status}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveBookingModal(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-gray-200 px-6 bg-[#FAFAFA] space-x-6">
                {[
                  { id: "details", label: "Rental Information" },
                  { id: "timeline", label: "Booking Timeline" },
                  { id: "tracking", label: "Track Rental" },
                  { id: "invoice", label: "Invoice & Payment" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabModal(tab.id as any)}
                    className={`py-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                      activeTabModal === tab.id 
                        ? "border-[#2563EB] text-[#2563EB]" 
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
                
                {/* TAB 1: RENTAL INFORMATION */}
                {activeTabModal === "details" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start bg-[#FAFAFA] p-6 rounded-3xl border border-gray-200">
                      <img src={activeBookingModal.image} alt="" className="w-full sm:w-44 h-44 object-cover rounded-2xl shadow-sm" />
                      <div className="space-y-3 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{activeBookingModal.category}</span>
                        <h3 className="text-xl font-extrabold font-heading text-[#0F172A]">{activeBookingModal.productName}</h3>
                        <p className="text-xs text-gray-600 font-medium">Booked on {activeBookingModal.bookingDate} • Duration: {activeBookingModal.rentalDuration}</p>
                        
                        <div className="flex items-center space-x-3 pt-2">
                          <img src={activeBookingModal.ownerAvatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                          <div>
                            <span className="block font-extrabold text-sm text-[#0F172A]">{activeBookingModal.ownerName}</span>
                            <span className="text-xs text-gray-500">Verified Marketplace Owner ({activeBookingModal.ownerRating}★)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-200 space-y-3">
                        <h4 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                          <MapPin className="w-4 h-4 text-[#2563EB] mr-2" /> Fulfillment & Location
                        </h4>
                        <p className="text-xs font-semibold text-gray-800">{activeBookingModal.fulfillment}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{activeBookingModal.location}</p>
                      </div>

                      <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-200 space-y-3">
                        <h4 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                          <Calendar className="w-4 h-4 text-[#2563EB] mr-2" /> Rental Schedule
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-gray-600"><span>Pickup:</span><span className="font-bold text-gray-900">{activeBookingModal.pickupDate}</span></div>
                          <div className="flex justify-between text-gray-600"><span>Return:</span><span className="font-bold text-gray-900">{activeBookingModal.returnDate}</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-200 p-6 rounded-3xl space-y-3">
                      <h4 className="font-extrabold text-sm text-blue-900 flex items-center">
                        <ShieldCheck className="w-4 h-4 text-[#2563EB] mr-2" /> Rental Policies & Guidelines
                      </h4>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Equipment is fully insured against accidental damage up to 90% of retail value. Free cancellation is permitted up to 48 hours prior to scheduled pickup.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: BOOKING TIMELINE */}
                {activeTabModal === "timeline" && (
                  <div className="space-y-8 py-4">
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                      {activeBookingModal.timeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start space-x-4">
                          <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                            step.completed 
                              ? "bg-[#10B981] text-white" 
                              : step.current 
                              ? "bg-[#2563EB] text-white animate-pulse" 
                              : "bg-gray-200 text-gray-500"
                          }`}>
                            {step.completed ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className={`text-sm font-extrabold ${step.completed || step.current ? "text-[#0F172A]" : "text-gray-400"}`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TRACK RENTAL */}
                {activeTabModal === "tracking" && (
                  <div className="space-y-6">
                    <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-200 space-y-4">
                      <h4 className="font-extrabold text-sm text-[#0F172A]">Real-Time Progress & Countdown</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>Rental Status: {activeBookingModal.status}</span>
                          <span className="text-[#2563EB]">{activeBookingModal.remainingDays ? `${activeBookingModal.remainingDays} Days Remaining` : "In Progress"}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB] rounded-full w-3/4 transition-all duration-1000"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-xs">
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <span className="block text-gray-400 uppercase font-bold text-[10px]">Pickup Date</span>
                          <span className="font-extrabold text-[#0F172A] mt-1 block">{activeBookingModal.pickupDate}</span>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <span className="block text-gray-400 uppercase font-bold text-[10px]">Return Countdown</span>
                          <span className="font-extrabold text-emerald-600 mt-1 block">{activeBookingModal.remainingDays ? `${activeBookingModal.remainingDays} Days Left` : "Completed"}</span>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <span className="block text-gray-400 uppercase font-bold text-[10px]">Support Assistance</span>
                          <span className="font-extrabold text-[#2563EB] mt-1 block">24/7 Priority Line</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => showToast("Rental extension requested successfully! Owner will confirm.")}
                        className="px-6 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
                      >
                        Extend Rental Duration
                      </button>
                      <button 
                        onClick={() => showToast("Return reminder notification configured.")}
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        Set Return Reminder
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: INVOICE & PAYMENT */}
                {activeTabModal === "invoice" && (
                  <div className="space-y-6">
                    <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div>
                          <h4 className="font-extrabold text-base text-[#0F172A]">Tax Invoice #{activeBookingModal.bookingId}</h4>
                          <p className="text-xs text-gray-500">Issued on {activeBookingModal.bookingDate}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-extrabold border border-emerald-200">
                          {activeBookingModal.paymentStatus}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-gray-600"><span>Rental Fee ({activeBookingModal.rentalDuration})</span><span className="font-semibold text-gray-900">₹{Math.round(activeBookingModal.amountPaid * 0.85)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Security Deposit (Refundable)</span><span className="font-semibold text-gray-900">₹{activeBookingModal.securityDeposit}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Platform & Insurance Fee</span><span className="font-semibold text-gray-900">₹150</span></div>
                        <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-3"><span>GST (18%)</span><span className="font-semibold text-gray-900">₹{Math.round(activeBookingModal.amountPaid * 0.15)}</span></div>
                        <div className="flex justify-between text-base font-extrabold pt-2">
                          <span className="text-[#0F172A]">Total Amount Paid</span>
                          <span className="text-[#2563EB]">₹{activeBookingModal.amountPaid.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center space-x-3">
                        <button 
                          onClick={() => showToast("Invoice downloaded successfully as PDF.")}
                          className="px-6 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF Invoice</span>
                        </button>
                        <button 
                          onClick={() => showToast("Receipt sent to your registered email.")}
                          className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
                        >
                          Email Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-[#FAFAFA] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => showToast(`Calling owner ${activeBookingModal.ownerName} at ${activeBookingModal.ownerPhone}...`)}
                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-600 text-gray-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Owner</span>
                  </button>
                  <button 
                    onClick={() => showToast("Booking details link copied to clipboard.")}
                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-600 text-gray-800 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Share Booking</span>
                  </button>
                </div>

                <button 
                  onClick={() => setActiveBookingModal(null)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-gray-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}