"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Heart,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

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
      className={`relative overflow-hidden transition-all active:scale-95 ${className}`}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
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

// --- Mock Data ---
const rentalMetrics = [
  { label: "Active Rentals", value: "3", change: "+1 this week", icon: Package, color: "text-[#2563EB]", bg: "bg-blue-50" },
  { label: "Upcoming Pickups", value: "2", change: "Next in 2 days", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Pending Returns", value: "1", change: "Due tomorrow", icon: Clock, color: "text-[#4F46E5]", bg: "bg-indigo-50" },
  { label: "Total Rental Spend", value: "$1,240", change: "+12% vs last mo", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Savings vs Buying", value: "$3,450", change: "Based on retail", icon: TrendingUp, color: "text-[#4F46E5]", bg: "bg-indigo-50" },
  { label: "Success Rate", value: "100%", change: "14 completed", icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50" },
];

const hostMetrics = [
  { label: "Total Listings", value: "6", change: "+2 active", icon: Package, color: "text-[#2563EB]", bg: "bg-blue-50" },
  { label: "Active Listings", value: "5", change: "83% utilization", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Monthly Earnings", value: "$2,890", change: "+18% vs last mo", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Utilization Rate", value: "78%", change: "+5% avg", icon: TrendingUp, color: "text-[#4F46E5]", bg: "bg-indigo-50" },
  { label: "Total Views", value: "1,420", change: "+120 today", icon: Search, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Conversion Rate", value: "6.4%", change: "+0.8%", icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Wishlist Count", value: "48", change: "High demand", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
];

const myRentals = [
  {
    id: "RENT-8831",
    name: "Sony Alpha a7 IV Mirrorless Camera",
    category: "Photography",
    owner: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    startDate: "Oct 12, 2026",
    endDate: "Oct 19, 2026",
    status: "Active",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    totalPrice: "$245.00",
    securityDeposit: "$500.00",
    location: "Downtown / Financial District",
    progress: 60,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop",
  },
  {
    id: "RENT-8902",
    name: "Thule Rooftop Cargo Box & Crossbars",
    category: "Travel & Outdoors",
    owner: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    startDate: "Oct 22, 2026",
    endDate: "Oct 29, 2026",
    status: "Upcoming",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    totalPrice: "$140.00",
    securityDeposit: "$200.00",
    location: "North Suburbs",
    progress: 0,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=200&fit=crop",
  },
  {
    id: "RENT-8710",
    name: "DJI Mavic 3 Pro Cine Drone",
    category: "Electronics",
    owner: "David Ross",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    startDate: "Oct 01, 2026",
    endDate: "Oct 08, 2026",
    status: "Returned",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    totalPrice: "$315.00",
    securityDeposit: "$800.00",
    location: "West End",
    progress: 100,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&h=200&fit=crop",
  },
];

const myListings = [
  {
    id: "LIST-301",
    name: "Yamaha Portable Generator EF2000iSV2",
    category: "Tools & Equipment",
    pricePerDay: "$45.00 /day",
    status: "Active",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    earnings: "$630.00",
    utilization: "71%",
    views: "340",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=200&fit=crop",
  },
  {
    id: "LIST-302",
    name: "Bosch Rotary Hammer Drill Set",
    category: "Tools & Equipment",
    pricePerDay: "$25.00 /day",
    status: "Active",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    earnings: "$420.00",
    utilization: "85%",
    views: "210",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop",
  },
  {
    id: "LIST-303",
    name: "Specialized Turbo Vado E-Bike",
    category: "Sports & Recreation",
    pricePerDay: "$60.00 /day",
    status: "Rented Out",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    earnings: "$1,200.00",
    utilization: "90%",
    views: "580",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=200&fit=crop",
  },
];

export default function RentItDashboard() {
  const [activeTab, setActiveTab] = useState<"rentals" | "listings">("rentals");
  const [rentalFilter, setRentalFilter] = useState("All");

  const filteredRentals = myRentals.filter((item) => {
    if (rentalFilter === "All") return true;
    return item.status.toLowerCase() === rentalFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 flex-1 w-full space-y-8">
        
        {/* Section Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "rentals"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Rentals
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "listings"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Listings
            </button>
          </div>

          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Dashboard / <span className="text-slate-800 font-bold capitalize">{activeTab}</span>
          </div>
        </div>

        {/* --- TAB 1: MY RENTALS DASHBOARD --- */}
        {activeTab === "rentals" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  My Rentals Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage active bookings, monitor return schedules, and track rental savings.
                </p>
              </div>
              <RippleButton className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/20 text-sm transition-all">
                <Search className="w-4 h-4" /> Explore More Gear
              </RippleButton>
            </div>

            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {rentalMetrics.map((metric, idx) => {
                const IconComponent = metric.icon;
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {metric.label}
                      </span>
                      <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-slate-900">{metric.value}</span>
                      <span className="text-xs font-medium text-emerald-600">{metric.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {["All", "Active", "Upcoming", "Returned", "Cancelled", "Disputed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRentalFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      rentalFilter === filter
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search gear or owner..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Rental Cards List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredRentals.map((rental) => (
                <div key={rental.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-slate-100">
                    <img src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/90 ${rental.statusColor}`}>
                      {rental.status}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-md">
                      {rental.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{rental.id}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {rental.location}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{rental.name}</h3>

                      {/* Owner Details */}
                      <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-100">
                        <img src={rental.avatar} alt={rental.owner} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs text-slate-400">Rented from</div>
                          <div className="text-xs font-bold text-slate-700">{rental.owner}</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline / Dates */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Rental Period</span>
                        <span className="font-semibold text-slate-800">{rental.startDate} → {rental.endDate}</span>
                      </div>
                      {rental.progress > 0 && rental.progress < 100 && (
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Rental Progress</span>
                            <span>{rental.progress}% completed</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${rental.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Total Price</div>
                        <div className="text-lg font-extrabold text-[#2563EB]">{rental.totalPrice}</div>
                      </div>
                      <RippleButton className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm">
                        View Details
                      </RippleButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: MY LISTINGS DASHBOARD --- */}
        {activeTab === "listings" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Host & Listings Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your shared gear, track utilization rates, and view hosting earnings.
                </p>
              </div>
              <RippleButton className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/20 text-sm transition-all">
                <Plus className="w-4 h-4" /> Add New Listing
              </RippleButton>
            </div>

            {/* Host KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {hostMetrics.map((metric, idx) => {
                const IconComponent = metric.icon;
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {metric.label}
                      </span>
                      <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-slate-900">{metric.value}</span>
                      <span className="text-[10px] font-medium text-emerald-600">{metric.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-slate-100">
                    <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/90 ${listing.statusColor}`}>
                      {listing.status}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-md">
                      {listing.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">{listing.id}</div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{listing.name}</h3>
                      <div className="text-[#2563EB] font-extrabold text-base mt-2">{listing.pricePerDay}</div>
                    </div>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Earnings</div>
                        <div className="text-xs font-bold text-slate-800">{listing.earnings}</div>
                      </div>
                      <div className="border-x border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Util Rate</div>
                        <div className="text-xs font-bold text-emerald-600">{listing.utilization}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Views</div>
                        <div className="text-xs font-bold text-slate-800">{listing.views}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 gap-3">
                      <RippleButton className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                        Edit Listing
                      </RippleButton>
                      <RippleButton className="flex-1 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">
                        View Analytics
                      </RippleButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}