"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  Heart,
  BarChart3,
  Wallet,
  Building,
  Pause,
  Copy,
  Trash2,
  Edit3,
  Wrench,
  MessageSquare,
  Sparkles,
  Download,
  ExternalLink,
  MapPin,
  Star,
  ChevronDown,
  Zap
} from "lucide-react";
import { RippleButton } from "@/components/ui/RippleButton";

export default function RentItDashboard() {
  const [activeTab, setActiveTab] = useState<"rentals" | "listings">("rentals");
  const [rentalFilter, setRentalFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock Rentals Data
  const rentals = [
    {
      id: "REN-9021",
      productName: "Sony Alpha a7 IV Mirrorless Camera",
      owner: "Elena Rostova",
      rating: 4.9,
      location: "Mission District, San Francisco",
      dates: "Oct 12 - Oct 18, 2026",
      duration: "6 Days",
      securityDeposit: "$200.00",
      status: "Active",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "REN-8842",
      productName: "Thule Rooftop Cargo Box & Racks",
      owner: "Marcus Vance",
      rating: 4.8,
      location: "Sunset District, San Francisco",
      dates: "Oct 20 - Oct 27, 2026",
      duration: "7 Days",
      securityDeposit: "$150.00",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "REN-7721",
      productName: "DJI Mavic 3 Pro Drone Fly More Combo",
      owner: "Sarah Jenkins",
      rating: 5.0,
      location: "SoMa, San Francisco",
      dates: "Oct 01 - Oct 04, 2026",
      duration: "3 Days",
      securityDeposit: "$300.00",
      status: "Return Tomorrow",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "REN-6510",
      productName: "Carbon Road Bike - Specialized Tarmac",
      owner: "David Chen",
      rating: 4.9,
      location: "Marina District, San Francisco",
      dates: "Sep 10 - Sep 15, 2026",
      duration: "5 Days",
      securityDeposit: "$250.00",
      status: "Returned",
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    },
  ];

  // Mock Listings Data
  const listings = [
    {
      id: "LST-101",
      title: "Apple MacBook Pro 16\" M3 Max (2025)",
      category: "Electronics",
      dailyPrice: 65,
      weeklyPrice: 380,
      monthlyPrice: 1200,
      views: 1420,
      favorites: 84,
      requests: 12,
      bookingRate: "88%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "LST-102",
      title: "Breville Barista Express Impress Espresso Machine",
      category: "Appliances",
      dailyPrice: 25,
      weeklyPrice: 150,
      monthlyPrice: 450,
      views: 890,
      favorites: 42,
      requests: 6,
      bookingRate: "74%",
      status: "Active",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "LST-103",
      title: "Yamaha Portable Electric Piano P-125",
      category: "Instruments",
      dailyPrice: 30,
      weeklyPrice: 180,
      monthlyPrice: 550,
      views: 410,
      favorites: 19,
      requests: 2,
      bookingRate: "45%",
      status: "Draft",
      image: "https://images.unsplash.com/photo-1520523839896-570d10b0b802?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Active</span>;
      case "Upcoming":
      case "Pickup Today":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"><Clock className="w-3 h-3" />{status}</span>;
      case "Return Tomorrow":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100"><AlertCircle className="w-3 h-3" />Return Tomorrow</span>;
      case "Returned":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><CheckCircle2 className="w-3 h-3 text-gray-500" />Returned</span>;
      case "Overdue":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100"><XCircle className="w-3 h-3" />Overdue</span>;
      case "Draft":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200">Draft</span>;
      case "Paused":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">Paused</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 pb-24 selection:bg-blue-500 selection:text-white">
      
      {/* Exact Header Layout & Logo Match from Demo Reference */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand matching demo layout */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 font-heading">
              RentIt
            </span>
          </Link>

          {/* Nav Links / Switcher Tabs (Matching demo style nav items) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "rentals"
                  ? "text-blue-600 bg-blue-50/80 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              My Rentals
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "text-blue-600 bg-blue-50/80 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              My Listings & Host Hub
            </button>
          </nav>

          {/* Right Action / Profile pill & CTA matching demo */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-xs cursor-pointer hover:border-gray-300 transition-all">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-gray-800">balaji.shankar</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <RippleButton className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 cursor-pointer">
              <Plus className="w-4 h-4" /> Start Renting
            </RippleButton>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => setActiveTab("rentals")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl ${
            activeTab === "rentals" ? "bg-blue-50 text-[#2563EB]" : "text-gray-500"
          }`}
        >
          My Rentals
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl ${
            activeTab === "listings" ? "bg-blue-50 text-[#2563EB]" : "text-gray-500"
          }`}
        >
          My Listings & Host Hub
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">

        {/* ========================================================= */}
        {/* PAGE 1: MY RENTALS                                        */}
        {/* ========================================================= */}
        {activeTab === "rentals" && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Page Title & Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
                  My Rentals Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage active gear, track scheduled pickups, and view your cumulative marketplace savings.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-50 cursor-pointer">
                  <Download className="w-4 h-4 text-gray-400" /> Export Invoices
                </button>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Active Rentals", value: "3", change: "+1 this wk", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Upcoming Pickups", value: "1", change: "Next: Oct 20", icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Pending Returns", value: "1", change: "Due tomorrow", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Total Rental Spend", value: "$1,240", change: "Across 14 items", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Savings vs Buying", value: "$4,850", change: "79% average save", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Success Rate", value: "99.2%", change: "Top tier renter", icon: Award, color: "text-rose-600", bg: "bg-rose-50" },
              ].map((kpi, index) => (
                <div key={index} className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400">{kpi.label}</span>
                    <div className={`w-9 h-9 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                      <kpi.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900 font-heading mb-1">{kpi.value}</div>
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Bar and Filters */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rented products by name, owner, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                {["All", "Active", "Upcoming", "Returned", "Cancelled", "Disputed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRentalFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      rentalFilter === filter
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Rental Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rentals.map((rental) => (
                <div key={rental.id} className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between group">
                  <div>
                    {/* Header: Image & Basic Info */}
                    <div className="flex gap-5">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                        <img src={rental.image} alt={rental.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{rental.id}</span>
                          {getStatusBadge(rental.status)}
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 font-heading truncate mb-2">{rental.productName}</h3>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-800">Owner:</span> {rental.owner} 
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold ml-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rental.rating}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{rental.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rental Details Metadata */}
                    <div className="grid grid-cols-3 gap-3 my-5 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-gray-400 mb-0.5">Rental Dates</span>
                        <span className="text-xs font-bold text-gray-800">{rental.dates}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-gray-400 mb-0.5">Duration</span>
                        <span className="text-xs font-bold text-gray-800">{rental.duration}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-gray-400 mb-0.5">Deposit</span>
                        <span className="text-xs font-bold text-emerald-600">{rental.securityDeposit}</span>
                      </div>
                    </div>

                    {/* Timeline section indicator */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-2">
                        <span>Booking Progress</span>
                        <span className="text-blue-600">Active Stage</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 h-2">
                        <div className="rounded-full bg-blue-600"></div>
                        <div className="rounded-full bg-blue-600"></div>
                        <div className="rounded-full bg-blue-600"></div>
                        <div className="rounded-full bg-blue-600 animate-pulse"></div>
                        <div className="rounded-full bg-gray-200"></div>
                        <div className="rounded-full bg-gray-200"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Confirmed</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> View Booking
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Contact
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Extend
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Return
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-gray-400" /> Invoice
                    </button>
                    <button className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Report Issue
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar & Map Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              
              {/* Calendar Widget */}
              <div className="lg:col-span-2 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 font-heading">Rental Schedule Calendar</h3>
                    <p className="text-xs text-gray-500">October 2026 booking outlook</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Active Booking
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-3">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isActive = [1, 2, 3, 4, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27].includes(day);
                    const isToday = day === 3;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                          isToday
                            ? "bg-gray-900 text-white shadow-md"
                            : isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                        {isActive && !isToday && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Widget */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 font-heading mb-1">Pickup & Return Map</h3>
                  <p className="text-xs text-gray-500 mb-6">Geofenced location coordination for active items.</p>
                </div>

                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="bg-white px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-800 shadow-sm mt-1">Mission St (Pickup)</span>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="bg-white px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-800 shadow-sm mt-1">Sunset Blvd (Return)</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-md">
                    Open Live GPS Navigation
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: MY LISTINGS & HOST OPERATIONS                     */}
        {/* ========================================================= */}
        {activeTab === "listings" && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Header Metrics */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
                    Host Dashboard & Listings
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor inventory velocity, analyze earnings trends, and manage active customer handovers.
                  </p>
                </div>
                <RippleButton className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 cursor-pointer">
                  <Plus className="w-4 h-4" /> Create New Listing
                </RippleButton>
              </div>

              {/* 7 Header Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {[
                  { label: "Total Listings", value: "8", change: "2 pending", icon: Package },
                  { label: "Active Listings", value: "6", change: "75% online", icon: CheckCircle2 },
                  { label: "Monthly Earnings", value: "$3,420", change: "+18% MoM", icon: DollarSign },
                  { label: "Utilization Rate", value: "82%", change: "High demand", icon: TrendingUp },
                  { label: "Total Views", value: "4.8K", change: "+420 this wk", icon: Eye },
                  { label: "Conversion Rate", value: "6.4%", change: "Industry avg 4%", icon: BarChart3 },
                  { label: "Wishlist Count", value: "214", change: "Saved items", icon: Heart },
                ].map((stat, index) => (
                  <div key={index} className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">{stat.label}</span>
                      <stat.icon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="text-xl font-extrabold text-gray-900 font-heading mb-1">{stat.value}</div>
                    <div className="text-[10px] font-semibold text-gray-500">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Section with Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Earnings Trend Chart Mock */}
              <div className="lg:col-span-2 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 font-heading">Earnings & Revenue Velocity</h3>
                    <p className="text-xs text-gray-500">Trailing 6 months performance trajectory</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">2026</span>
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 border-b border-gray-100">
                  {[
                    { month: "May", height: "40%", amount: "$1.8K" },
                    { month: "Jun", height: "55%", amount: "$2.3K" },
                    { month: "Jul", height: "70%", amount: "$2.9K" },
                    { month: "Aug", height: "65%", amount: "$2.6K" },
                    { month: "Sep", height: "85%", amount: "$3.1K" },
                    { month: "Oct", height: "95%", amount: "$3.4K" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.amount}</span>
                      <div
                        style={{ height: bar.height }}
                        className="w-full rounded-2xl bg-gradient-to-t from-[#2563EB] to-[#4F46E5] shadow-lg shadow-blue-500/20 group-hover:brightness-110 transition-all"
                      ></div>
                      <span className="text-xs font-bold text-gray-500">{bar.month}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
                  <span>Average monthly payout: <strong className="text-gray-900">$2,680</strong></span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">↑ 18.2% vs previous period</span>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 font-heading mb-1">Revenue Breakdown</h3>
                  <p className="text-xs text-gray-500 mb-6">Category performance shares</p>
                </div>

                <div className="space-y-4">
                  {[
                    { category: "Electronics & Cameras", percentage: 54, amount: "$1,846", color: "bg-[#2563EB]" },
                    { category: "Appliances & Kitchen", percentage: 28, amount: "$957", color: "bg-indigo-600" },
                    { category: "Outdoor & Recreation", percentage: 18, amount: "$617", color: "bg-blue-400" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-gray-800">
                        <span>{item.category}</span>
                        <span>{item.amount}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div style={{ width: `${item.percentage}%` }} className={`h-full rounded-full ${item.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Platform Commission (8%)</span>
                    <span className="font-bold text-gray-900">-$273.60</span>
                  </div>
                </div>
              </div>

            </div>

            {/* My Listings Inventory Table / Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-gray-900 font-heading">Active Inventory ({listings.length})</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-xs">Filter By Category</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-gray-100 border border-gray-100">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(listing.status)}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-extrabold text-gray-900 shadow-sm">
                          ${listing.dailyPrice} <span className="text-[10px] font-normal text-gray-500">/ day</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{listing.category}</span>
                      <h4 className="text-base font-extrabold text-gray-900 font-heading mt-2 mb-4 truncate">{listing.title}</h4>

                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 mb-5 text-center">
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-gray-400">Views</span>
                          <span className="text-xs font-extrabold text-gray-800">{listing.views}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-gray-400">Favorites</span>
                          <span className="text-xs font-extrabold text-gray-800">{listing.favorites}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-gray-400">Booking Rate</span>
                          <span className="text-xs font-extrabold text-emerald-600">{listing.bookingRate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                      <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5 text-gray-400" /> Edit
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Pause className="w-3.5 h-3.5 text-amber-500" /> Pause
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Copy className="w-3.5 h-3.5 text-blue-600" /> Duplicate
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Promote
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Stats
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOST OPERATIONS PANEL & MAINTENANCE LOG */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
              
              {/* Host Operations Panel */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 font-heading">Host Operations Panel</h3>
                    <p className="text-xs text-gray-500">Today's priority task list and reminders</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                <div className="space-y-3">
                  {[
                    { task: "Upcoming handover: Sony Alpha a7 IV with Alex Morgan", time: "Today, 4:00 PM", status: "Pending", icon: Clock },
                    { task: "Return inspection due for DJI Mavic 3 Pro", time: "Tomorrow, 10:00 AM", status: "Scheduled", icon: CheckCircle2 },
                    { task: "3 unread renter messages awaiting reply", time: "Action required", status: "Urgent", icon: MessageSquare },
                    { task: "Monthly preventative maintenance check for Power Station", time: "In 3 days", status: "Reminder", icon: Wrench },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{item.task}</p>
                          <p className="text-[11px] text-gray-500">{item.time}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white text-gray-700 border border-gray-200 shadow-xs">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Health & Maintenance Log */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 font-heading mb-1">Inventory Health & Safety</h3>
                  <p className="text-xs text-gray-500 mb-6">Equipment status breakdown</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="block text-[10px] font-bold uppercase text-emerald-700 mb-1">Excellent Condition</span>
                      <span className="text-xl font-extrabold text-emerald-900">5 Items</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <span className="block text-[10px] font-bold uppercase text-blue-700 mb-1">Good / Serviced</span>
                      <span className="text-xl font-extrabold text-blue-900">2 Items</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-800">
                      <span>Last Inspection</span>
                      <span className="text-gray-500">Oct 02, 2026</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-800">
                      <span>Last Professional Cleaning</span>
                      <span className="text-gray-500">Sep 28, 2026</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 text-xs font-bold text-gray-800">
                      <span>Next Scheduled Maintenance</span>
                      <span className="text-blue-600">Nov 15, 2026</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-md">
                    Log New Maintenance Record
                  </button>
                </div>
              </div>

            </div>

            {/* EARNINGS DASHBOARD & WALLET */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              
              {/* Wallet Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#2563EB] to-[#4F46E5] p-8 text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-100">RentIt Host Wallet</span>
                    <Wallet className="w-6 h-6 text-blue-200" />
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="block text-xs text-blue-200">Available Balance</span>
                      <span className="text-4xl font-black font-heading">$2,840.50</span>
                    </div>
                    <div className="flex gap-6 pt-4 border-t border-white/10">
                      <div>
                        <span className="block text-[10px] text-blue-200 uppercase">Pending Balance</span>
                        <span className="text-lg font-bold">$580.00</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-blue-200 uppercase">Total Lifetime</span>
                        <span className="text-lg font-bold">$24,910.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <span className="block text-xs text-blue-200 mb-1.5">Payout Methods</span>
                    <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                      <Building className="w-4 h-4" /> Chase Bank •••• 4092 (Instant Transfer)
                    </div>
                  </div>
                  <RippleButton className="w-full py-3.5 rounded-2xl bg-white text-[#2563EB] text-xs font-extrabold shadow-lg hover:bg-blue-50 transition-all cursor-pointer">
                    Request Payout Now
                  </RippleButton>
                </div>
              </div>

              {/* Recent Transactions & Trust & Safety */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Transactions */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 font-heading mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {[
                        { title: "Booking income #101", date: "Today", amount: "+$380.00", type: "income" },
                        { title: "Deposit received", date: "Yesterday", amount: "+$200.00", type: "deposit" },
                        { title: "Platform service fee", date: "Oct 01", amount: "-$30.40", type: "fee" },
                        { title: "Deposit refunded to renter", date: "Sep 28", amount: "-$150.00", type: "refund" },
                      ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-none">
                          <div>
                            <p className="font-bold text-gray-800">{tx.title}</p>
                            <p className="text-[10px] text-gray-400">{tx.date}</p>
                          </div>
                          <span className={`font-extrabold ${tx.type === "income" || tx.type === "deposit" ? "text-emerald-600" : "text-gray-900"}`}>
                            {tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                    View Complete Ledger
                  </button>
                </div>

                {/* Trust & Safety Panel */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-extrabold text-gray-900 font-heading">Trust & Safety</h3>
                      <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" /> Score: 98/100
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      {[
                        { label: "Government ID Verified", verified: true },
                        { label: "Phone Number Verified", verified: true },
                        { label: "Email Address Verified", verified: true },
                        { label: "Physical Address Verified", verified: true },
                      ].map((v, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-semibold">{v.label}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Rating</span>
                        <span className="font-bold text-gray-800">4.9★</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Response</span>
                        <span className="font-bold text-gray-800">&lt; 15m</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Cancel Rate</span>
                        <span className="font-bold text-emerald-600">0.0%</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors">
                    Manage Verification Badges
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}