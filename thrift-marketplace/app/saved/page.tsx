"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  MapPin,
  Trash2,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Bell,
  Scale,
  Eye,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCcw,
  Clock,
  ChevronRight
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RippleButton } from "@/components/ui/RippleButton";

const INITIAL_SAVED_ITEMS = [
  {
    id: 1,
    name: "Apple MacBook Pro 16 M3 Max",
    category: "Computers",
    pricePerDay: 35,
    weeklyPrice: 210,
    rating: 4.9,
    reviewCount: 48,
    location: "Stuttgart",
    distance: "1.2 km away",
    ownerName: "Alexander Schmidt",
    ownerVerified: true,
    availabilityStatus: "Available Today",
    securityDeposit: 150,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    savedDate: "2026-07-28",
    isAvailable: true,
    isInstantBook: true,
    tags: ["M3 Max", "32GB RAM", "Creator Choice"]
  },
  {
    id: 2,
    name: "Canon EOS R5 Cinema Camera",
    category: "Photography",
    pricePerDay: 55,
    weeklyPrice: 330,
    rating: 4.8,
    reviewCount: 32,
    location: "Frankfurt",
    distance: "3.5 km away",
    ownerName: "Elena Rostova",
    ownerVerified: true,
    availabilityStatus: "Available Tomorrow",
    securityDeposit: 250,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    savedDate: "2026-07-30",
    isAvailable: true,
    isInstantBook: false,
    tags: ["8K Video", "RF Mount", "Kit Included"]
  },
  {
    id: 3,
    name: "Bosch Professional Rotary Hammer Drill",
    category: "Tools",
    pricePerDay: 18,
    weeklyPrice: 100,
    rating: 4.9,
    reviewCount: 19,
    location: "Munich",
    distance: "5.1 km away",
    ownerName: "Markus Weber",
    ownerVerified: true,
    availabilityStatus: "Available Today",
    securityDeposit: 50,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
    savedDate: "2026-08-01",
    isAvailable: true,
    isInstantBook: true,
    tags: ["Heavy Duty", "SDS-Plus"]
  }
];

const RECOMMENDED_ITEMS = [
  { id: 101, name: "Sony Alpha a7 IV Mirrorless", category: "Photography", pricePerDay: 45, rating: 4.9, location: "Frankfurt", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
  { id: 102, name: "DJI Ronin RS 3 Pro Gimbal", category: "Photography", pricePerDay: 25, rating: 4.7, location: "Stuttgart", image: "https://images.unsplash.com/photo-1527011046414-478bcfd7b96e?w=400" },
  { id: 103, name: "iPad Pro 12.9 M2 + Apple Pencil", category: "Computers", pricePerDay: 20, rating: 4.8, location: "Berlin", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
];

const RECENTLY_VIEWED = [
  { id: 201, name: "GoPro Hero 12 Black Creator Ed.", category: "Photography", pricePerDay: 15, rating: 4.8, image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400" },
  { id: 202, name: "DeWalt Cordless Impact Wrench", category: "Tools", pricePerDay: 22, rating: 4.9, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400" },
  { id: 203, name: "Nintendo Switch OLED Bundle", category: "Gaming", pricePerDay: 14, rating: 4.7, image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b2e?w=400" },
];

export default function SavedPage() {
  const [items, setItems] = useState(INITIAL_SAVED_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [selectedCompareIds, setSelectedCompareIds] = useState<number[]>([]);
  const [priceAlertEnabled, setPriceAlertEnabled] = useState(false);

  const removeSaved = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedCompareIds(selectedCompareIds.filter(cid => cid !== id));
  };

  const clearAll = () => {
    setItems([]);
    setSelectedCompareIds([]);
  };

  const toggleCompare = (id: number) => {
    if (selectedCompareIds.includes(id)) {
      setSelectedCompareIds(selectedCompareIds.filter(cid => cid !== id));
    } else {
      if (selectedCompareIds.length < 3) {
        setSelectedCompareIds([...selectedCompareIds, id]);
      } else {
        alert("You can compare up to 3 items at a time.");
      }
    }
  };

  // Filtering & Sorting Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") return matchesSearch;
    if (selectedCategory === "Available Today") return matchesSearch && item.availabilityStatus === "Available Today";
    if (selectedCategory === "Highest Rated") return matchesSearch && item.rating >= 4.9;
    if (selectedCategory === "Lowest Price") return matchesSearch && item.pricePerDay <= 30;
    
    return matchesSearch && item.category.toLowerCase() === selectedCategory.toLowerCase();
  }).sort((a, b) => {
    if (sortBy === "Price Low to High") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "Price High to Low") return b.pricePerDay - a.pricePerDay;
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Distance") return parseFloat(a.distance) - parseFloat(b.distance);
    return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
  });

  // KPI Calculations
  const totalSaved = items.length;
  const avgPrice = totalSaved > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.pricePerDay, 0) / totalSaved) : 0;
  const highestRated = totalSaved > 0 ? [...items].sort((a, b) => b.rating - a.rating)[0] : null;
  const nearbyCount = items.filter(i => parseFloat(i.distance) <= 3.0).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-12 space-y-10">
        
        {/* TOP HEADER CONTENT INSIDE MAIN ONLY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/60 text-blue-600 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>RentIt Wishlist & Sync</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-heading">Favorites & Saved Items</h1>
            <p className="text-sm text-gray-500 font-medium">Compare, manage, and book the gear you saved for later.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              {items.length} {items.length === 1 ? 'Item Saved' : 'Items Saved'}
            </span>
            {items.length > 0 && (
              <button 
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors px-4 py-2 rounded-2xl hover:bg-rose-50 border border-gray-200 hover:border-rose-100 cursor-pointer bg-white shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            )}
            <Link href="/#browse">
              <RippleButton className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer">
                Browse More Items
                <ArrowRight className="h-3.5 w-3.5" />
              </RippleButton>
            </Link>
          </div>
        </div>

        {/* TRUST NOTE */}
        <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 -mt-6">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Saved items are securely synced across your RentIt account.</span>
        </div>

        {/* KPI / SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Saved</span>
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 fill-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">{totalSaved} Items</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Active bookmarked gear</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Daily Price</span>
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">€{avgPrice} <span className="text-xs font-normal text-gray-500">/day</span></p>
              <p className="text-[11px] text-gray-500 mt-0.5">Competitive marketplace rate</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Rated</span>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">{highestRated ? highestRated.rating : "0.0"} <span className="text-xs font-normal text-gray-500">Rating</span></p>
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">{highestRated ? highestRated.name : "No items saved"}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nearby Items</span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">{nearbyCount} Ready</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Within 3 km of your location</p>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by item name, category, city, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Recently Saved">Recently Saved</option>
                <option value="Price Low to High">Price Low to High</option>
                <option value="Price High to Low">Price High to Low</option>
                <option value="Rating">Rating</option>
                <option value="Distance">Distance</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Computers", "Photography", "Tools", "Vehicles", "Outdoor", "Available Today", "Highest Rated", "Lowest Price"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SAVED ITEM GRID OR EMPTY STATE */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-8 max-w-xl mx-auto space-y-4">
            <div className="h-20 w-20 bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-blue-100/50">
              <Heart className="h-10 w-10 fill-blue-600/20 text-blue-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-gray-900 font-heading">No saved items yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">Save cameras, tools, electronics, and vehicles to compare and book them later.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/#browse" className="w-full sm:w-auto">
                <RippleButton className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                  Browse Items
                </RippleButton>
              </Link>
              <Link href="/#categories" className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200 transition-all text-center">
                Explore Popular Categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isCompared = selectedCompareIds.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50 flex flex-col justify-between group hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div>
                    {/* Image Section */}
                    <div className="relative h-52 w-full overflow-hidden rounded-2xl mb-4 bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Favorite Button */}
                      <button 
                        onClick={() => removeSaved(item.id)}
                        title="Remove from saved"
                        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border border-gray-100 z-10"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>

                      {/* Availability & Category Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span className="font-bold text-[10px] text-blue-600 uppercase tracking-wider bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-gray-100">
                          {item.category}
                        </span>
                        <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {item.availabilityStatus}
                        </span>
                      </div>

                      {/* Tags Bar */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Main Content Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-bold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 
                          {item.rating} <span className="text-gray-400 font-normal">({item.reviewCount})</span>
                        </span>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                          {item.distance}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors font-heading">{item.name}</h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-0.5">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" /> 
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 font-bold shrink-0">
                          {item.ownerName}
                          {item.ownerVerified && <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />}
                        </span>
                      </div>

                      {/* Pricing Details */}
                      <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                        <div>
                          <p className="text-base font-extrabold text-gray-900">
                            €{item.pricePerDay} <span className="text-xs font-normal text-gray-500">/ day</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Deposit: €{item.securityDeposit} • Weekly: €{item.weeklyPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        href={`/item/${item.id}`} 
                        className="w-full text-center rounded-2xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all block"
                      >
                        Book Now
                      </Link>
                      <Link 
                        href={`/item/${item.id}`} 
                        className="w-full text-center rounded-2xl bg-gray-50 hover:bg-gray-100 py-2.5 text-xs font-bold text-gray-700 border border-gray-200 transition-all block"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => toggleCompare(item.id)}
                        className={`text-[11px] font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isCompared 
                            ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Scale className="h-3 w-3" />
                        {isCompared ? "Compared Selected" : "Add to Compare"}
                      </button>

                      <button
                        onClick={() => removeSaved(item.id)}
                        className="text-[11px] font-bold text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1 px-2 py-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STICKY BOTTOM COMPARISON BAR */}
        {selectedCompareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-xl text-white px-6 py-4 rounded-3xl shadow-2xl border border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  {selectedCompareIds.length}/3
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Items Selected for Comparison</p>
                  <p className="text-[11px] text-gray-400">Review specs, prices, and deposit details side-by-side.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Comparison modal activated for items: " + selectedCompareIds.join(", "))}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  Compare Selected
                </button>
                <button
                  onClick={() => setSelectedCompareIds([])}
                  className="p-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all cursor-pointer"
                  title="Clear comparison selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXTRA PROFESSIONAL SECTION 1: RECOMMENDED SIMILAR ITEMS */}
        <div className="pt-8 border-t border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 font-heading">Recommended Similar Items</h2>
              <p className="text-xs text-gray-500 font-medium">Based on your saved categories and recent rental history.</p>
            </div>
            <Link href="/#browse" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDED_ITEMS.map((rec) => (
              <div key={rec.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-4 group hover:border-blue-200 transition-all">
                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={rec.image} alt={rec.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{rec.category}</span>
                  <h4 className="text-xs font-bold text-gray-900 truncate">{rec.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{rec.rating}</span>
                    <span>• {rec.location}</span>
                  </div>
                  <p className="text-xs font-extrabold text-gray-900 pt-1">€{rec.pricePerDay} <span className="font-normal text-gray-500">/ day</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXTRA PROFESSIONAL SECTION 2: RECENTLY VIEWED */}
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 font-heading">Recently Viewed Gear</h2>
            <p className="text-xs text-gray-500 font-medium">Quickly jump back to items you browsed earlier.</p>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none">
            {RECENTLY_VIEWED.map((item) => (
              <div key={item.id} className="min-w-[240px] max-w-[240px] bg-white rounded-3xl p-4 border border-gray-100 shadow-xl shadow-gray-200/30 flex-shrink-0 group hover:border-blue-200 transition-all">
                <div className="h-36 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{item.category}</span>
                <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{item.name}</h4>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs font-extrabold text-gray-900">€{item.pricePerDay} <span className="font-normal text-gray-500 text-[10px]">/day</span></span>
                  <Link href="/#browse" className="text-[11px] font-bold text-blue-600 hover:underline">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXTRA PROFESSIONAL SECTION 3: PRICE ALERT BOX */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md">
              <Bell className="h-3.5 w-3.5" />
              <span>Smart Price Tracker</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight font-heading">Never miss a price drop on your wishlist</h3>
            <p className="text-xs text-blue-100 max-w-xl">Get notified when saved items become cheaper or available nearby in Stuttgart, Frankfurt, and Munich.</p>
          </div>

          <button
            onClick={() => setPriceAlertEnabled(!priceAlertEnabled)}
            className={`px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg cursor-pointer whitespace-nowrap ${
              priceAlertEnabled
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-white text-blue-600 hover:bg-blue-50 shadow-black/10"
            }`}
          >
            {priceAlertEnabled ? "✓ Price Alerts Enabled" : "Enable Price Drop Alerts"}
          </button>
        </div>

        {/* EXTRA PROFESSIONAL SECTION 4: TRUST & SAFETY BOX */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="text-base font-extrabold text-gray-900 font-heading">Only verified owners and protected payments</h3>
            <p className="text-xs text-gray-500">Every rental on RentIt is safeguarded by comprehensive guarantees.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Verified Equipment</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Checked serial numbers and owner IDs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Secure Deposit</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Refundable hold released upon safe return.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Flexible Cancellation</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Free changes up to 24 hours before pickup.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">24/7 Support</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Assistance whenever your rental is active.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}