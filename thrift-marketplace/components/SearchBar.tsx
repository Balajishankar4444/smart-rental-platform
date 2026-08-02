"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const PLACEHOLDERS = ["What do you want to rent?", "Search cameras...", "Search bikes...", "Search drones..."];
const POPULAR = ["Sony Alpha", "PlayStation 5", "DJI Mini 3", "Camp Tent"];

export const SearchBar = () => {
  const [idx, setIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    router.push(`/browse?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative z-30 mx-auto max-w-[1200px] px-6 -mt-8">
      <div className="rounded-[28px] bg-white/90 backdrop-blur-md p-4 shadow-xl border border-gray-100 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder={PLACEHOLDERS[idx]}
          aria-label="Search rental items"
          className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search" className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => handleSearch(query)} className="px-6 py-3 rounded-2xl bg-[#2563EB] text-white text-sm font-bold shadow-md">
          Search
        </button>

        <AnimatePresence>
          {focused && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 right-0 top-full mt-3 p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" /> Popular Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button key={term} onClick={() => { setQuery(term); handleSearch(term); }} className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#2563EB]">
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};