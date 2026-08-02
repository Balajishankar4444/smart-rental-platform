"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, X, TrendingUp } from "lucide-react";

const PLACEHOLDERS = [
  "What do you want to rent?",
  "Search Sony A7 IV Camera...",
  "Search PS5 DualSense Consoles...",
  "Search DJI Mavic 3 Drones...",
  "Search Ather Electric Scooters...",
];

const POPULAR_SEARCHES = ["Sony Alpha", "PlayStation 5", "DJI Mini 3", "Camp Tent", "Power Tools"];

export const InteractiveSearch = () => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-30 -mt-8 mx-auto max-w-[1200px] px-6">
      <div className="rounded-[28px] glass-panel bg-white/90 p-4 lg:p-5 shadow-2xl shadow-blue-900/10 border border-white/80">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
          {/* Main Search Input */}
          <div className="relative md:col-span-5 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search items"
              className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Popular Searches Dropdown */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-3 rounded-[20px] bg-white p-4 shadow-xl border border-gray-100 z-50"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Popular Searches</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location Field */}
          <div className="md:col-span-3 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="w-full">
              <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Location</span>
              <input
                type="text"
                defaultValue="Bengaluru, KA"
                aria-label="Rental Location"
                className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none"
              />
            </div>
          </div>

          {/* Dates Field */}
          <div className="md:col-span-2 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
            <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="w-full">
              <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Dates</span>
              <span className="text-sm font-semibold text-gray-900 block truncate">Aug 5 - Aug 8</span>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button className="w-full flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition active:scale-95 cursor-pointer">
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};