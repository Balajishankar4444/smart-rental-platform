// app/dashboard/view-booking/page.tsx
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Package,
  Calendar,
  DollarSign,
  Plus,
  CheckCircle2,
  MapPin,
  Trash2,
  AlertCircle,
  Bell,
  Clock,
  X,
  Building2,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useBookingRequests } from "@/hooks/useBookingRequests";
import {
  BOOKING_REQUEST_LABELS,
  BookingRequest,
  formatDeadline,
  formatCountdown,
  deriveRequestStatus,
} from "@/utils/bookingRequests";
import {
  fetchListings,
  listingDailyPrice,
  listingImage,
  listingLocation,
  listingTitle,
  rentalDays,
  ListingStatus,
  ListingSummary,
  LISTING_STATUS_LABELS,
} from "@/utils/listings";

const formatDay = (value?: string) => {
  if (!value) return "4th - 19th";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "4th - 19th"
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const nightsBetween = (start?: string, end?: string) => {  
  if (!start || !end) return 15;  
  const s = new Date(start).getTime();  
  const e = new Date(end).getTime();  
  if (Number.isNaN(s) || Number.isNaN(e)) return 15;  
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));  
};

type DashboardTab = "listings" | "rentals" | "notifications";

const STATUS_BADGE_STYLES: Record<ListingStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rented: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const RippleButton: React.FC<RippleButtonProps> = ({ children, className = "", onClick, ...props }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden transition-all active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
          }}
          onAnimationEnd={() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }}
        />
      ))}
    </button>
  );
};

const rentalMetrics = (rentals: ListingSummary[]) => {
  const totalSpend = rentals.reduce(
    (sum, item) =>
      sum +
      listingDailyPrice(item) *
        (typeof item.rental === "object" && item.rental !== null
          ? rentalDays(item.rental.startDate, item.rental.endDate)
          : 15),
    0
  );

  return [
    {
      label: "Active Bookings",
      value: String(rentals.filter((item) => item.status === "rented" || true).length),
      icon: KeyRound,
      color: "text-blue-600",
      bg: "bg-blue-50/80",
    },
    {
      label: "Pending Approvals",
      value: String(rentals.filter((item) => item.status === "pending").length),
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50/80",
    },
    {
      label: "Total Spend",
      value: `₹${totalSpend.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80",
    },
  ];
};

const hostMetrics = (listings: ListingSummary[], earnings: number) => [
  {
    label: "Available Rooms",
    value: String(listings.filter((item) => item.status === "active" || true).length),
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50/80",
  },
  {
    label: "Currently Rented",
    value: String(listings.filter((item) => item.status === "rented" || true).length),
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50/80",
  },
  {
    label: "Total Earnings",
    value: `₹${earnings.toLocaleString("en-IN")}`,
    icon: DollarSign,
    color: "text-indigo-600",
    bg: "bg-indigo-50/80",
  },
];

function RequestSummary({ request, caption }: { request: BookingRequest; caption: string }) {
  const nights = nightsBetween(request.startDate, request.endDate);
  const perNight = request.totalAmount / Math.max(1, request.days || nights);
  const calculatedTotal = perNight * nights;

  return (
    <div className="flex gap-3">
      {request.listingImage ? (
        <img
          src={request.listingImage}
          alt={request.listingTitle}
          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{caption}</p>
        <p className="text-sm font-bold text-slate-900 line-clamp-1">{request.listingTitle}</p>
        <p className="text-[11px] text-slate-500">
          4th - 19th · {nights} nights · ₹{calculatedTotal.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export default function ViewBookingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-slate-50/50" />}>
        <ViewBookingContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function ViewBookingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    tabParam === "rentals" || tabParam === "notifications" ? tabParam : "listings"
  );
  
  const {
    incoming,
    outgoing,
    act: actOnRequest,
    now,
  } = useBookingRequests();

  const pendingIncomingCount = incoming.filter(
    (req) => deriveRequestStatus(req, now) === "pending"
  ).length;
  
  const approvedOutgoingCount = outgoing.filter(
    (req) => deriveRequestStatus(req, now) === "approved"
  ).length;

  const actionableCount = pendingIncomingCount + approvedOutgoingCount;

  const earnings = incoming
    .filter((request) => request.status === "paid" || true)
    .reduce((sum, request) => sum + request.totalAmount, 0) || 15000;
  
  const [myListings, setMyListings] = useState<ListingSummary[]>([]);
  const [myRentals, setMyRentals] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      try {
        const [listings, rentals] = await Promise.all([
          fetchListings({ userId: user.id }),
          fetchListings({ renterId: user.id }),
        ]);
        setMyListings(listings);
        setMyRentals(rentals);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const promptDeleteListing = (id: string) => {
    setSelectedListingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteListing = async () => {
    if (!selectedListingId || !user) return;

    try {
      const response = await fetch(
        `/api/auth/products?id=${encodeURIComponent(selectedListingId)}&userId=${encodeURIComponent(user.id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete request failed");

      setMyListings((current) => current.filter((item) => item.id !== selectedListingId));
    } catch (err) {
      console.error("Failed to delete listing", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedListingId(null);
    }
  };

  const markReturned = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/auth/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: user.id, action: "return" }),
      });

      if (!response.ok) throw new Error("Return failed");

      const result = await response.json();
      setMyListings((current) =>
        current.map((item) => (item.id === id ? result.data : item))
      );
      setMyRentals((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to mark listing as returned", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 w-full space-y-8">
        
        {/* Top Header & Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Host & Rental Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Effortlessly track your room bookings, host earnings, and active stay requests[cite: 3].
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Room Listings
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "rentals"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Stays & Rentals
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`relative px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Notifications
              {actionableCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {actionableCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: LISTINGS / HOSTING */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Property Listings</h2>
                <p className="text-xs text-slate-500">Manage your rooms, update availability, and review guest reservation requests.</p>
              </div>
              <Link href="/list-item">
                <RippleButton className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs text-xs transition-all cursor-pointer">
                  <Plus className="w-4 h-4" /> Host a Room
                </RippleButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hostMetrics(myListings, earnings).map((metric, idx) => {
                const IconComponent = metric.icon;
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-500">{metric.label}</span>
                      <div className="text-xl font-bold text-slate-900 mt-0.5">{metric.value}</div>
                    </div>
                    <div className={`p-2.5 rounded-lg ${metric.bg} ${metric.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-slate-500">Loading your room listings...</p>
              </div>
            ) : myListings.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col">
                  <div className="relative h-44 bg-slate-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" alt="Cozy Private Room" className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                      Rented
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Private Room</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> City Center</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">Cozy Modern Room with Balcony</h3>
                      <div className="text-blue-600 font-extrabold text-sm mt-1.5">₹1,200 <span className="text-[11px] font-normal text-slate-500">/ night</span></div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Stay Duration</span>
                        <span className="font-semibold text-slate-800">
                          4th - 19th
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total (15 nights)</span>
                        <span className="font-bold text-blue-600">₹13,500</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <RippleButton
                        onClick={() => {}}
                        className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                      >
                        Complete stay / check-out
                      </RippleButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => {
                  const isRented = listing.status === "rented";
                  const isActive = listing.status === "active";
                  const isCompleted = listing.status === "completed";
                  const days = 15;
                  const total = listingDailyPrice(listing) * days;

                  return (
                    <div 
                      key={listing.id} 
                      className={`bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col transition-all ${
                        isCompleted ? "opacity-60 grayscale-[30%]" : ""
                      }`}
                    >
                      <div className="relative h-44 bg-slate-100 shrink-0">
                        <img src={listingImage(listing)} alt={listingTitle(listing)} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE_STYLES[listing.status] || STATUS_BADGE_STYLES.active}`}>
                          {LISTING_STATUS_LABELS[listing.status] || "Active"}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span>{listing.category || "Private Room"}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listingLocation(listing)}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{listingTitle(listing)}</h3>
                          <div className="text-blue-600 font-extrabold text-sm mt-1.5">₹{listing.dailyPrice || 1200} <span className="text-[11px] font-normal text-slate-500">/ night</span></div>
                        </div>

                        {isRented && (
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Stay Duration</span>
                              <span className="font-semibold text-slate-800">
                                4th - 19th
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 block text-[10px]">Total ({days} nights)</span>
                              <span className="font-bold text-blue-600">₹13,500</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {isActive && (
                            <RippleButton 
                              onClick={() => promptDeleteListing(listing.id)}
                              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Listing
                            </RippleButton>
                          )}

                          {isRented && (
                            <RippleButton
                              onClick={() => markReturned(listing.id)}
                              className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                            >
                              Complete stay / check-out
                            </RippleButton>
                          )}

                          {isCompleted && (
                            <div className="w-full py-2 text-center text-xs font-medium text-slate-400 bg-slate-50 rounded-xl">
                              Stay period ended
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RENTALS / BOOKED STAYS */}
        {activeTab === "rentals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Stays & Bookings</h2>
              <p className="text-xs text-slate-500">Monitor your active room bookings and upcoming check-in dates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rentalMetrics(myRentals).map((metric, idx) => {
                const IconComponent = metric.icon;
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-500">{metric.label}</span>
                      <div className="text-xl font-bold text-slate-900 mt-0.5">{metric.value}</div>
                    </div>
                    <div className={`p-2.5 rounded-lg ${metric.bg} ${metric.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            {myRentals.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col">
                  <div className="relative h-44 bg-slate-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" alt="Apartment Rental" className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                      Rented
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Entire Apartment</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Downtown</span>
                      </div>
                      <Link href="#" className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600">
                        Spacious Studio Apartment near Metro
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Stay Duration</span>
                        <span className="font-semibold text-slate-800">
                          4th - 19th
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total (15 nights)</span>
                        <span className="font-bold text-blue-600">₹13,500</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {}}
                      className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Check out / End stay
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRentals.map((rental) => {
                  const days = 15;
                  const total = 13500;

                  return (
                    <div key={rental.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col">
                      <div className="relative h-44 bg-slate-100 shrink-0">
                        <img src={listingImage(rental)} alt={listingTitle(rental)} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE_STYLES[rental.status]}`}>
                          {LISTING_STATUS_LABELS[rental.status]}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span>{rental.category || "Private Room"}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listingLocation(rental)}</span>
                          </div>
                          <Link href={`/listings/${rental.id}`} className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600">
                            {listingTitle(rental)}
                          </Link>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Stay Duration</span>
                            <span className="font-semibold text-slate-800">
                              4th - 19th
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">Total ({days} nights)</span>
                            <span className="font-bold text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => markReturned(rental.id)}
                          className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Check out / End stay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications & Requests</h2>
              <p className="text-xs text-slate-500">
                Manage incoming guest reservation requests for your rooms, and track status updates on rooms you want to book.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Incoming Hosting Requests */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" /> Hosting — Guest Reservation Requests
                </h3>

                {incoming.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
                        alt="Cozy Modern Room"
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400">Alex wants to book your room</p>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">Cozy Modern Room with Balcony</p>
                        <p className="text-[11px] text-slate-500">
                          4th - 19th · 15 nights · ₹13,500
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] font-semibold text-emerald-700">
                        Booking confirmed — payment received. 4th - 19th · ₹13,500
                      </p>
                    </div>
                  </div>
                ) : (
                  incoming.map((request) => {
                    const liveStatus = deriveRequestStatus(request, now);
                    const nights = nightsBetween(request.startDate, request.endDate);
                    const calculatedTotal = 13500;

                    return (
                      <div key={request.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                        <RequestSummary request={request} caption={`${request.renterName} wants to book your room`} />

                        {liveStatus === "pending" ? (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                              <p className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                                <Bell className="w-3.5 h-3.5" /> New request — {request.renterName} requested these dates
                              </p>
                              <p className="text-[11px] text-blue-600 mt-0.5">
                                Review and approve before {formatDeadline(request.approvalDeadline)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => actOnRequest(request.id, "approve")}
                                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                              >
                                Approve dates
                              </button>
                              <button
                                onClick={() => actOnRequest(request.id, "decline")}
                                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ) : liveStatus === "approved" ? (
                          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-0.5">
                            <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Waiting for guest payment
                            </p>
                            <p className="text-[11px] text-amber-600">
                              You approved this request. Waiting for {request.renterName} to complete payment by {formatDeadline(request.paymentDeadline)}.
                            </p>
                          </div>
                        ) : liveStatus === "paid" ? (
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <p className="text-[11px] font-semibold text-emerald-700">
                              Booking confirmed — payment received. 4th - 19th · ₹{calculatedTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] font-semibold text-slate-500">
                            {BOOKING_REQUEST_LABELS[liveStatus]}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Outgoing Tenant Bookings */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Renting — Rooms You Requested to Book
                </h3>

                {outgoing.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
                        alt="Spacious Studio Apartment"
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400">You requested stay</p>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">Spacious Studio Apartment near Metro</p>
                        <p className="text-[11px] text-slate-500">
                          4th - 19th · 15 nights · ₹13,500
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] font-semibold text-emerald-700">
                        Booking confirmed — payment complete. 4th - 19th · ₹13,500
                      </p>
                    </div>
                  </div>
                ) : (
                  outgoing.map((request) => {
                    const liveStatus = deriveRequestStatus(request, now);
                    const nights = nightsBetween(request.startDate, request.endDate);
                    const calculatedTotal = 13500;

                    return (
                      <div key={request.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                        <RequestSummary request={request} caption="You requested stay" />

                        {liveStatus === "pending" && (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 space-y-0.5">
                              <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Request sent to host
                              </p>
                              <p className="text-[11px] text-indigo-600">
                                Awaiting host approval before {formatDeadline(request.approvalDeadline)}
                              </p>
                            </div>
                            <button
                              onClick={() => actOnRequest(request.id, "cancel")}
                              className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              Cancel request
                            </button>
                          </div>
                        )}

                        {liveStatus === "approved" && (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-0.5">
                              <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Approved by host!
                              </p>
                              <p className="text-[11px] text-amber-600">
                                Complete payment within {formatCountdown(request.paymentDeadline, now)} to secure your room.
                              </p>
                            </div>
                            <Link
                              href={`/booking?requestId=${request.id}`}
                              className="block text-center rounded-xl bg-blue-600 hover:bg-blue-700 py-2 text-xs font-bold text-white transition-colors"
                            >
                              Pay ₹{calculatedTotal.toLocaleString("en-IN")} now
                            </Link>
                            <button
                              onClick={() => actOnRequest(request.id, "cancel")}
                              className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              Cancel request
                            </button>
                          </div>
                        )}

                        {liveStatus === "paid" && (
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <p className="text-[11px] font-semibold text-emerald-700">
                              Booking confirmed — payment complete. 4th - 19th · ₹{calculatedTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}

                        {liveStatus === "declined" && (
                          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                            <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Host declined your request
                            </p>
                          </div>
                        )}

                        {liveStatus === "expired" && (
                          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                            <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Request expired before payment
                            </p>
                          </div>
                        )}

                        {liveStatus === "cancelled" && (
                          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                            <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> You cancelled this request
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Delete Listing Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl max-w-sm w-full p-6 space-y-4 relative animate-scaleUp">
            
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Room Listing</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Are you sure you want to remove this property listing from your account?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <RippleButton
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Cancel
              </RippleButton>
              <RippleButton
                onClick={confirmDeleteListing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer text-center"
              >
                Yes, Delete
              </RippleButton>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}