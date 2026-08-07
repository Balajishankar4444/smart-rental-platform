// app/search/page.tsx
"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, MapPin, ShieldCheck, Zap, 
  Compass, Music, Armchair, Package, Sparkles, 
  Check, ArrowUpDown, X, Calendar, ChevronLeft, ChevronRight, ChevronDown, Heart
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  fetchListings,
  listingDailyPrice,
  listingImage,
  listingLocation,
  listingTitle,
  ListingSummary,
} from "@/utils/listings";

const CATEGORIES = [
  { name: "All Categories", icon: <Package className="w-4 h-4" /> },
  { name: "Shared Room", icon: <Armchair className="w-4 h-4 text-[#2563EB]" /> },
  { name: "Private Room", icon: <Armchair className="w-4 h-4 text-[#2563EB]" /> },
  { name: "Apartment", icon: <Armchair className="w-4 h-4 text-[#2563EB]" /> },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Sort: Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

const ALL_LOCATIONS = "All Locations";
const MAX_PRICE = 2000;

const GERMAN_CITIES = [  
  ALL_LOCATIONS,  
  "Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt",  
  "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen",  
  "Bremen", "Dresden", "Hanover", "Nuremberg", "Heidelberg",  
];

const POPULAR_SEARCHES = ["Private Room", "Shared Room", "Apartment", "Berlin", "Munich"];  
const PLACEHOLDERS = [  
  "Where do you want to stay?",  
  "Search rooms in Berlin...",  
  "Search apartments in Munich...",  
  "Search shared rooms...",  
  "Search private rooms...",  
];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

function SearchContent() {
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [instantBookOnly, setInstantBookOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  
  const [selectedCity, setSelectedCity] = useState(searchParams.get("location") || ALL_LOCATIONS);
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "2026-08-05");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "2026-08-08");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calendar View State
  const [currentMonth, setCurrentMonth] = useState(7); // August
  const [currentYear, setCurrentYear] = useState(2026);

  // Custom Dropdown State for Sorting
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if URL params change externally
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("location");
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");

    if (q !== null) setSearchQuery(q);
    if (loc) setSelectedCity(loc);
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchListings({ status: "active", excludeUserId: user?.id })
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => console.error("Failed to load listings", err))
      .finally(() => {
        if (!cancelled) setIsLoadingListings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || "Sort: Recommended";

  const filteredCities = GERMAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Generate Days for Calendar Grid
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

  // Filter the active listings coming from the API[cite: 1]
  const query = searchQuery.trim().toLowerCase();
  const cityName = selectedCity.split(",")[0].trim().toLowerCase();

  const filteredListings = listings
    .filter((item) => {
      const matchesSearch =
        !query ||
        [listingTitle(item), item.category, item.description]
          .filter(Boolean)
          .some((field) => field && field.toLowerCase().includes(query));
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchesCity =
        selectedCity === ALL_LOCATIONS ||
        listingLocation(item).toLowerCase().includes(cityName);
      const matchesPrice = priceRange >= MAX_PRICE || listingDailyPrice(item) <= priceRange;
      const matchesInstant = !instantBookOnly || item.instantBooking;

      return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesInstant;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return listingDailyPrice(a) - listingDailyPrice(b);
      if (sortBy === "price-high") return listingDailyPrice(b) - listingDailyPrice(a);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        
        {/* Search Bar Container */}
        <section className="relative z-30 mx-auto max-w-full mb-8">
          <div className="rounded-[28px] glass-panel bg-white/95 p-4 lg:p-5 shadow-2xl shadow-blue-900/10 border border-white/80">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
              
              {/* 1. Main Search Input */}
              <div className="relative md:col-span-5 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder={PLACEHOLDERS[placeholderIdx]}
                  aria-label="Search rooms"
                  className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <AnimatePresence>
                  {isFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-3 rounded-[20px] bg-white p-4 shadow-xl border border-gray-100 z-50"
                    >
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>Popular Searches</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((item) => (
                          <button
                            key={item}
                            onClick={() => { setSearchQuery(item); }}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Location Dropdown */}
              <div className="md:col-span-3 relative" ref={cityDropdownRef}>
                <div 
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent hover:bg-gray-200/60 focus-within:border-[#2563EB] focus-within:bg-white transition-all cursor-pointer"
                >
                  <MapPin className="h-5 w-5 text-[#2563EB] shrink-0" />
                  <div className="w-full overflow-hidden">
                    <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Location</span>
                    <span className="text-sm font-semibold text-gray-900 block truncate">{selectedCity}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                </div>

                <AnimatePresence>
                  {isCityDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-3 max-h-72 flex flex-col"
                    >
                      <input 
                        type="text"
                        placeholder="Search city in Germany..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] mb-2"
                      />
                      <div className="overflow-y-auto space-y-1 pr-1">
                        {filteredCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city);
                              setIsCityDropdownOpen(false);
                              setCitySearchQuery("");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              selectedCity === city ? "bg-blue-50 text-[#2563EB]" : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Dates Dropdown */}
              <div className="md:col-span-2 relative" ref={calendarDropdownRef}>
                <div 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent hover:bg-gray-200/60 focus-within:border-[#2563EB] focus-within:bg-white transition-all cursor-pointer"
                >
                  <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="w-full overflow-hidden">
                    <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Dates</span>
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      {formatDisplayDate(startDate)} {endDate ? `- ${formatDisplayDate(endDate)}` : ""}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isCalendarOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 md:left-auto md:right-0 top-full mt-3 w-[340px] bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900">
                          {MONTH_NAMES[currentMonth]} {currentYear}
                        </h3>
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                          <button 
                            onClick={prevMonth}
                            aria-label="Previous month"
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={nextMonth}
                            aria-label="Next month"
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {WEEKDAYS.map((w) => (
                          <span key={w} className="text-[11px] font-bold text-gray-400 uppercase">{w}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {getDaysInMonth(currentYear, currentMonth).map(({ day, dateStr, isCurrentMonth }, idx) => {
                          const isSelected = dateStr === startDate || dateStr === endDate;
                          const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleDateClick(dateStr)}
                              className={`h-9 w-full flex items-center justify-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-bold scale-105 z-10" 
                                  : isInRange 
                                  ? "bg-blue-50 text-[#2563EB] rounded-none" 
                                  : isCurrentMonth 
                                  ? "text-gray-800 hover:bg-gray-100" 
                                  : "text-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => { setStartDate(""); setEndDate(""); }}
                          className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => setIsCalendarOpen(false)}
                          className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Sort Component */}
              <div className="md:col-span-2 relative" ref={sortRef}>
                <div
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between rounded-[18px] bg-gray-100/80 px-4 py-3.5 border border-transparent hover:bg-gray-200/60 cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold text-gray-800 truncate">{currentSortLabel}</span>
                  <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
                </div>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 space-y-1"
                    >
                      {SORT_OPTIONS.map((option) => {
                        const isSelected = sortBy === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected 
                                ? "bg-blue-50 text-[#2563EB]" 
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* Horizontal Category Carousel Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/25 scale-105" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Layout: Filters Sidebar (Col 3) + Listings Grid (Col 9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP FILTERS SIDEBAR */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-base text-slate-900">Filters</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setPriceRange(MAX_PRICE);
                  setInstantBookOnly(false);
                  setSelectedCity(ALL_LOCATIONS);
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800">Max Price / Night</label>
                <span className="text-sm font-extrabold text-[#2563EB]">€{priceRange} / night</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max={MAX_PRICE}
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>€50</span>
                <span>€2,000+</span>
              </div>
            </div>

            {/* Trust & Booking Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-800 block">Preferences</label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Instant Book
                </span>
                <input 
                  type="checkbox" 
                  checked={instantBookOnly}
                  onChange={(e) => setInstantBookOnly(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB] cursor-pointer"
                />
              </label>

            </div>
          </div>

          {/* LISTINGS RESULTS GRID (Span 9) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-600">
                Showing <span className="text-slate-900 font-extrabold">{filteredListings.length}</span> rooms available in <span className="text-slate-900 font-extrabold">{selectedCity}</span> for <span className="text-slate-900 font-extrabold">{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}</span>
              </p>
            </div>

            {isLoadingListings ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">Loading rooms...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900">No matching rooms found in {selectedCity}</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try switching your city location or dates using the picker above, adjusting your search filters, or increasing your max price range.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setPriceRange(MAX_PRICE);
                    setInstantBookOnly(false);
                    setSelectedCity(ALL_LOCATIONS);
                    setSearchQuery("");
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => { window.location.href = `/listings/${item.id}`; }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img 
                        src={listingImage(item)} 
                        alt={listingTitle(item)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {item.instantBooking && (
                          <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" /> Instant Book
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2563EB]" /> {listingLocation(item)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                        aria-pressed={isFavorite(item.id)}
                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite(item.id) ? "fill-red-500 text-red-500" : "text-slate-600"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" /> Available
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                          {listingTitle(item)}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-extrabold text-[#2563EB]">€{listingDailyPrice(item)}</span>
                          <span className="text-xs text-slate-500"> / night</span>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#4F46E5] group-hover:text-white transition-all">
                          Book Now
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}