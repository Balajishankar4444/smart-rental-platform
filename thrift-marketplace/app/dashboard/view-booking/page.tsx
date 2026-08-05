// app/dashboard/view-booking/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Package,
  Calendar,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  MapPin,
  Trash2,
  AlertCircle,
  X
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchListings,
  listingImage,
  listingLocation,
  listingTitle,
  ListingStatus,
  ListingSummary,
  LISTING_STATUS_LABELS,
} from "@/utils/listings";

const STATUS_BADGE_STYLES: Record<ListingStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_rent: "bg-blue-50 text-blue-700 border-blue-200",
  in_lease: "bg-indigo-50 text-indigo-700 border-indigo-200",
  deleted: "bg-slate-100 text-slate-600 border-slate-200",
};

// --- Ripple Button Component ---
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

// --- Mock Metrics Data ---
const rentalMetrics = [
  { label: "Active Rentals", value: "3", icon: Package, color: "text-blue-600", bg: "bg-blue-50/80" },
  { label: "Upcoming", value: "2", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50/80" },
  { label: "Total Spend", value: "₹1,240", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50/80" },
];

const hostMetrics = (activeListings: number) => [
  { label: "Active Listings", value: String(activeListings), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50/80" },
  { label: "Monthly Revenue", value: "₹2,890", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50/80" },
  { label: "Total Views", value: "1,420", icon: Search, color: "text-indigo-600", bg: "bg-indigo-50/80" },
];

const myRentals = [
  {
    id: "RENT-8831",
    name: "Sony Alpha a7 IV Mirrorless Camera",
    category: "Photography",
    owner: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    startDate: "Oct 12",
    endDate: "Oct 19",
    status: "Active",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    totalPrice: "₹245.00",
    location: "Downtown",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop",
  },
  {
    id: "RENT-8902",
    name: "Thule Rooftop Cargo Box & Crossbars",
    category: "Travel",
    owner: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    startDate: "Oct 22",
    endDate: "Oct 29",
    status: "Upcoming",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    totalPrice: "₹140.00",
    location: "North Suburbs",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=200&fit=crop",
  },
];

export default function ViewBookingPage() {
  return (
    <ProtectedRoute>
      <ViewBookingContent />
    </ProtectedRoute>
  );
}

function ViewBookingContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"rentals" | "listings">("listings");
  const [myListings, setMyListings] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadListings = async () => {
      try {
        setMyListings(await fetchListings({ userId: user.id }));
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
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

  // Ends an ongoing rental; the listing becomes available again on its own
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
    } catch (err) {
      console.error("Failed to mark listing as returned", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 w-full space-y-8">
        
        {/* Header & Section Switcher with Total Counts in Brackets */}
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
              My Listings ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "rentals"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Rentals ({myRentals.length})
            </button>
          </div>
        </div>

        {/* --- TAB 1: MY LISTINGS --- */}
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

            {/* Concise Host Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hostMetrics(myListings.filter((item) => item.status === "active").length).map((metric, idx) => {
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

            {/* Listings Grid with identical uniform dimensions */}
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
                    <div key={listing.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col h-[400px]">
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
                        </div>

                        {/* Minimal Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          {listing.status === "in_rent" || listing.status === "in_lease" ? (
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

        {/* --- TAB 2: MY RENTALS --- */}
        {activeTab === "rentals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Bookings</h2>
              <p className="text-xs text-slate-500">Monitor your ongoing rentals and scheduled returns.</p>
            </div>

            {/* Concise Rental Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rentalMetrics.map((metric, idx) => {
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

            {/* Rentals Grid with uniform dimensions matching Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRentals.map((rental) => (
                <div key={rental.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col h-[400px]">
                  <div className="relative h-44 bg-slate-100 shrink-0">
                    <img src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${rental.statusColor}`}>
                      {rental.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{rental.category}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {rental.location}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{rental.name}</h3>

                      {/* Owner Info */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                        <img src={rental.avatar} alt={rental.owner} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-medium text-slate-600">Rented from <strong className="text-slate-900">{rental.owner}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Period</span>
                        <span className="font-semibold text-slate-800">{rental.startDate} – {rental.endDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total</span>
                        <span className="font-bold text-blue-600">{rental.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* --- PROFESSIONAL THEME DELETE CONFIRMATION MODAL --- */}
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