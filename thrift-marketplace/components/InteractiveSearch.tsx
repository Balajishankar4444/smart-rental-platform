// components/InteractiveSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, X, TrendingUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PLACEHOLDERS = [
  "Where do you want to stay?",
  "Find a bed, room, or shared space...",
  "Looking for a sofa or sleeping space...",
  "Search private rooms & shared spaces...",
  "Find affordable places near you...",
];

const POPULAR_SEARCHES = [
  "Bed Space",
  "Shared Room",
  "Private Room",
  "Sofa",
  "Entire Space",
];

const ALL_LOCATIONS = "All Locations";

const GERMAN_CITIES = [
  ALL_LOCATIONS,
  "Berlin, BE",
  "Munich, BY",
  "Hamburg, HH",
  "Cologne, NW",
  "Frankfurt, HE",
  "Stuttgart, BW",
  "Düsseldorf, NW",
  "Leipzig, SN",
  "Dortmund, NW",
  "Essen, NW",
  "Bremen, HB",
  "Dresden, SN",
  "Hanover, NI",
  "Nuremberg, BY",
  "Heidelberg, BW",
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

const todayStr = (() => {
  const n = new Date();
  return formatDateString(n.getFullYear(), n.getMonth(), n.getDate());
})();

export const InteractiveSearch = () => {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const [location, setLocation] = useState(ALL_LOCATIONS);
  const [locationSearch, setLocationSearch] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calendar View State
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

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

  const filteredCities = GERMAN_CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setIsCalendarOpen(true);
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("location", location);
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    router.push(`/browse?${params.toString()}#search-section`);
  };

  // Generate Days for Calendar Grid
  const getDaysInMonth = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      days.push({ day: dayNum, dateStr: formatDateString(prevY, prevM, dayNum), isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, dateStr: formatDateString(year, month, i), isCurrentMonth: true });
    }

    // Next month filler days to complete the grid (up to 42 cells = 6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      days.push({ day: i, dateStr: formatDateString(nextY, nextM, i), isCurrentMonth: false });
    }

    return days;
  };

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return;
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

  return (
    <section id="search-section" className="relative z-30 -mt-8 mx-auto max-w-[1200px] px-6">
      <div className="rounded-[28px] glass-panel bg-white/95 p-4 lg:p-5 shadow-2xl shadow-blue-900/10 border border-white/80">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-center">
          
          {/* 1. Main Search Input */}
          <div className="relative md:col-span-5 flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent focus-within:border-[#2563EB] focus-within:bg-white transition-all">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search items"
              className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
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
                    <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Popular Searches</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { setQuery(item); setIsFocused(false); }}
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
                <span className="text-sm font-semibold text-gray-900 block truncate">{location}</span>
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
                    placeholder="Search city in India..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2563EB] mb-2"
                  />
                  <div className="overflow-y-auto space-y-1 pr-1">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setLocation(city);
                          setIsCityDropdownOpen(false);
                          setLocationSearch("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          location === city ? "bg-blue-50 text-[#2563EB]" : "text-gray-700 hover:bg-gray-100"
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

          {/* 3. Custom Designed Dates Dropdown */}
          <div className="md:col-span-2 relative" ref={calendarDropdownRef}>
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-3 rounded-[18px] bg-gray-100/80 px-4 py-3 border border-transparent hover:bg-gray-200/60 focus-within:border-[#2563EB] focus-within:bg-white transition-all cursor-pointer"
            >
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="w-full overflow-hidden">
                <span className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Dates</span>
                <span className="text-sm font-semibold text-gray-900 block truncate">
                  {startDate ? `${formatDisplayDate(startDate)} ${endDate ? `- ${formatDisplayDate(endDate)}` : ""}` : "Add dates"}
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
                  {/* Header: Month & Year controls */}
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

                  {/* Weekdays */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {WEEKDAYS.map((w) => (
                      <span key={w} className="text-[11px] font-bold text-gray-400 uppercase">{w}</span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {getDaysInMonth(currentYear, currentMonth).map(({ day, dateStr, isCurrentMonth }, idx) => {
                      const isSelected = dateStr === startDate || dateStr === endDate;
                      const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
                      const isPast = dateStr < todayStr;

                      return (
                        <button
                          key={idx}
                          disabled={isPast}
                          onClick={() => handleDateClick(dateStr)}
                          className={`h-9 w-full flex items-center justify-center text-xs font-semibold rounded-xl transition-all ${
                            isPast
                              ? "text-gray-300 line-through cursor-not-allowed"
                              : isSelected 
                              ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-bold scale-105 z-10 cursor-pointer" 
                              : isInRange 
                              ? "bg-blue-50 text-[#2563EB] rounded-none cursor-pointer" 
                              : isCurrentMonth 
                              ? "text-gray-800 hover:bg-gray-100 cursor-pointer" 
                              : "text-gray-300 hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer actions */}
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

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button 
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};