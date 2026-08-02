// components/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, MapPin, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const PLACEHOLDERS = ["What do you want to rent?", "Search cameras...", "Search bikes...", "Search drones..."];
const POPULAR = ["Sony Alpha", "PlayStation 5", "DJI Mini 3", "Camp Tent"];

const INDIAN_CITIES = [
  "Bengaluru, KA",
  "Mumbai, MH",
  "Delhi, DL",
  "Hyderabad, TS",
  "Chennai, TN",
  "Kolkata, WB",
  "Pune, MH",
  "Ahmedabad, GJ",
  "Jaipur, RJ",
  "Surat, GJ",
  "Lucknow, UP",
  "Kanpur, UP",
  "Nagpur, MH",
  "Indore, MP",
  "Thane, MH",
  "Bhopal, MP",
  "Visakhapatnam, AP",
  "Patna, BR",
  "Vadodara, GJ",
  "Ghaziabad, UP",
  "Ludhiana, PB",
  "Agra, UP",
  "Nashik, MH",
  "Faridabad, HR",
  "Meerut, UP",
  "Rajkot, GJ",
  "Kalyan-Dombivli, MH",
  "Vasai-Virar, MH",
  "Varanasi, UP",
  "Srinagar, JK",
  "Aurangabad, MH",
  "Dhanbad, JH",
  "Amritsar, PB",
  "Navi Mumbai, MH",
  "Allahabad (Prayagraj), UP",
  "Ranchi, JH",
  "Howrah, WB",
  "Coimbatore, TN",
  "Jabalpur, MP",
  "Gwalior, MP",
  "Vijayawada, AP",
  "Jodhpur, RJ",
  "Madurai, TN",
  "Raipur, CG",
  "Kota, RJ",
  "Guwahati, AS",
  "Chandigarh, CH",
  "Solapur, MH",
  "Hubli-Dharwad, KA",
  "Mysore, KA",
];

export const SearchBar = () => {
  const [idx, setIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Bengaluru, KA");
  const [locationSearch, setLocationSearch] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  
  // Date states configured default for a 3-day window
  const [startDate, setStartDate] = useState("2026-08-05");
  const [endDate, setEndDate] = useState("2026-08-08");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const filteredCities = INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("location", location);
    params.set("duration", "3"); // Enforces 3-day multiplier context for total price calculation on browse page
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="relative z-30 mx-auto max-w-[1200px] px-6 -mt-8">
      <div className="rounded-[28px] bg-white/95 backdrop-blur-md p-4 shadow-2xl border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        
        {/* 1. Search Query Input Box */}
        <div className="lg:col-span-4 relative flex items-center gap-3 px-3 py-3 rounded-2xl bg-gray-50/80 border border-gray-200/60 focus-within:bg-white focus-within:border-[#2563EB] transition-all">
          <Search className="h-5 w-5 text-gray-400 ml-1 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={PLACEHOLDERS[idx]}
            aria-label="Search rental items"
            className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-gray-400 hover:text-gray-600 shrink-0">
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Popular Suggestions Popup Dropdown */}
          <AnimatePresence>
            {focused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                className="absolute left-0 right-0 top-full mt-3 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 z-40"
              >
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" /> Popular Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <button 
                      key={term} 
                      onClick={() => { setQuery(term); handleSearch(); }} 
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Location Dropdown (All Indian Cities) */}
        <div className="lg:col-span-3 relative" ref={cityDropdownRef}>
          <div 
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 cursor-pointer hover:bg-gray-100/60 transition-colors"
          >
            <MapPin className="h-5 w-5 text-[#2563EB] shrink-0" />
            <div className="flex flex-col w-full overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location (India)</span>
              <span className="text-sm font-semibold text-gray-900 truncate">{location}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mr-1" />
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
                  placeholder="Search city in India..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] mb-2"
                />
                <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        setIsCityDropdownOpen(false);
                        setLocationSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        location === city ? "bg-blue-50 text-[#2563EB]" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No cities found</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Date Picker Dropdown (Configured for 3-Day Totals) */}
        <div className="lg:col-span-3 relative" ref={calendarDropdownRef}>
          <div 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50/80 border border-gray-200/60 cursor-pointer hover:bg-gray-100/60 transition-colors"
          >
            <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="flex flex-col w-full overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration (3 Days Target)</span>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {startDate} to {endDate}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mr-1" />
          </div>

          <AnimatePresence>
            {isCalendarOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">End Date (3 Days Duration)</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-gray-800"
                  />
                </div>
                <button 
                  onClick={() => setIsCalendarOpen(false)}
                  className="w-full py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Apply Dates
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Action Button */}
        <div className="lg:col-span-2">
          <button 
            type="button"
            onClick={handleSearch} 
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>

      </div>
    </div>
  );
};