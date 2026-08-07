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
  X
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
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const nightsBetween = (start?: string, end?: string) => {  
  if (!start || !end) return 0;  
  const s = new Date(start).getTime();  
  const e = new Date(end).getTime();  
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;  
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
          : 0),
    0
  );

  return [
    {
      label: "Active Rentals",
      value: String(rentals.filter((item) => item.status === "rented").length),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50/80",
    },
    {
      label: "Pending",
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
    label: "Available",
    value: String(listings.filter((item) => item.status === "active").length),
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50/80",
  },
  {
    label: "Out with renters",
    value: String(listings.filter((item) => item.status === "rented").length),
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50/80",
  },
  {
    label: "Earnings",
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
          {formatDay(request.startDate)} – {formatDay(request.endDate)} · {nights}d · ₹{calculatedTotal.toLocaleString("en-IN")}
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
    .filter((request) => request.status === "paid")
    .reduce((sum, request) => sum + request.totalAmount, 0);
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
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Effortlessly track your rentals, equipment performance, and active inventory.
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
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "rentals"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Rentals
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

        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Inventory & Listings</h2>
                <p className="text-xs text-slate-500">Manage your active gear available for sharing.</p>
              </div>
              <Link href="/list-item">
                <RippleButton className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs text-xs transition-all cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Listing
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
                <p className="text-xs font-medium text-slate-500">Loading listings...</p>
              </div>
            ) : myListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No listings found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start sharing your gear today to unlock passive income opportunities.
                </p>
                <Link href="/list-item" className="inline-block pt-1">
                  <RippleButton className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer">
                    Create First Listing
                  </RippleButton>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => {
                  return (
                    <div key={listing.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col h-[420px]">
                      <div className="relative h-44 bg-slate-100 shrink-0">
                        <img src={listingImage(listing)} alt={listingTitle(listing)} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE_STYLES[listing.status] || STATUS_BADGE_STYLES.active}`}>
                          {LISTING_STATUS_LABELS[listing.status] || "Active"}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span>{listing.category || "General"}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listingLocation(listing)}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{listingTitle(listing)}</h3>
                          <div className="text-blue-600 font-extrabold text-sm mt-1.5">₹{listing.dailyPrice || 0} <span className="text-[11px] font-normal text-slate-500">/ day</span></div>

                          {listing.status === "rented" && typeof listing.rental === "object" && listing.rental !== null && (
                            <p className="text-[11px] font-semibold text-blue-600 mt-2">
                              Booked {formatDay(listing.rental.startDate)} – {formatDay(listing.rental.endDate)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          {listing.status === "rented" ? (
                            <RippleButton
                              onClick={() => markReturned(listing.id)}
                              className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                            >
                              Mark returned
                            </RippleButton>
                          ) : (
                            <span className="flex-1 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                              Available for rent
                            </span>
                          )}
                          <RippleButton 
                            onClick={() => promptDeleteListing(listing.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </RippleButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Bookings</h2>
              <p className="text-xs text-slate-500">Monitor your ongoing rentals and scheduled returns.</p>
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
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                <p className="text-sm font-semibold text-slate-900">No rentals yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Items you book show up here while you have them.
                </p>
                <Link href="/browse" className="mt-3 inline-block text-sm font-semibold text-blue-600">
                  Browse listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRentals.map((rental) => {
                  const rentalObj = typeof rental.rental === "object" ? rental.rental : null;
                  const days = rentalObj ? rentalDays(rentalObj.startDate, rentalObj.endDate) : 0;
                  const total = listingDailyPrice(rental) * days;

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
                            <span>{rental.category || "General"}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listingLocation(rental)}</span>
                          </div>
                          <Link href={`/listings/${rental.id}`} className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600">
                            {listingTitle(rental)}
                          </Link>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Period</span>
                            <span className="font-semibold text-slate-800">
                              {formatDay(rentalObj?.startDate)} – {formatDay(rentalObj?.endDate)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">Total ({days}d)</span>
                            <span className="font-bold text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => markReturned(rental.id)}
                          className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Return item
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">
                Rental requests on your gear, and updates on the items you asked to rent.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" /> Hosting — booking requests for your gear
                </h3>

                {incoming.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-10 text-center text-xs text-slate-500">
                    No one has asked to rent your listings yet.
                  </div>
                ) : (
                  incoming.map((request) => {
                    const liveStatus = deriveRequestStatus(request, now);
                    const nights = nightsBetween(request.startDate, request.endDate);
                    const perNight = request.totalAmount / Math.max(1, request.days || nights);
                    const calculatedTotal = perNight * nights;

                    return (
                      <div key={request.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                        <RequestSummary request={request} caption={`${request.renterName} wants to rent`} />

                        {liveStatus === "pending" ? (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                              <p className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                                <Bell className="w-3.5 h-3.5" /> New request — {request.renterName} wants these dates
                              </p>
                              <p className="text-[11px] text-blue-600 mt-0.5">
                                Approve before {formatDeadline(request.approvalDeadline)}
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
                              <Clock className="w-3.5 h-3.5" /> Waiting for payment
                            </p>
                            <p className="text-[11px] text-amber-600">
                              You approved this. Waiting for {request.renterName} to complete payment by {formatDeadline(request.paymentDeadline)}.
                            </p>
                          </div>
                        ) : liveStatus === "paid" ? (
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <p className="text-[11px] font-semibold text-emerald-700">
                              Booking confirmed — payment received. {formatDay(request.startDate)} – {formatDay(request.endDate)} · ₹{calculatedTotal.toLocaleString("en-IN")}
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

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Renting — items you asked to book
                </h3>

                {outgoing.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-10 text-center text-xs text-slate-500">
                    You have not requested any rental dates yet.
                  </div>
                ) : (
                  outgoing.map((request) => {
                    const liveStatus = deriveRequestStatus(request, now);
                    const nights = nightsBetween(request.startDate, request.endDate);
                    const perNight = request.totalAmount / Math.max(1, request.days || nights);
                    const calculatedTotal = perNight * nights;

                    return (
                      <div key={request.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3">
                        <RequestSummary request={request} caption="You requested" />

                        {liveStatus === "pending" && (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 space-y-0.5">
                              <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Request sent
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
                                <AlertCircle className="w-3.5 h-3.5" /> Approved by host
                              </p>
                              <p className="text-[11px] text-amber-600">
                                Pay within {formatCountdown(request.paymentDeadline, now)} or the approval lapses.
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
                              Booking confirmed — payment complete. {formatDay(request.startDate)} – {formatDay(request.endDate)} · ₹{calculatedTotal.toLocaleString("en-IN")}
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
                              <AlertCircle className="w-3.5 h-3.5" /> This request expired before payment
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
                <h3 className="text-base font-bold text-slate-900">Delete Listing</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Are you sure you want to remove this product from your shared inventory?
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