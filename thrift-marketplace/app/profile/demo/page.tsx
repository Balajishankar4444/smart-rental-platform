"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  Heart,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  GraduationCap,
  Cake,
  User as UserIcon,
  Briefcase,
  Sparkles,
  Globe,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import { useBookingRequests } from "@/hooks/useBookingRequests";
import {
  BOOKING_REQUEST_LABELS,
  BookingRequest,
} from "@/utils/bookingRequests";
import {
  fetchListings,
  listingDailyPrice,
  ListingSummary,
  LISTING_STATUS_LABELS,
} from "@/utils/listings";

interface ProfileForm {
  fullName: string;
  phone: string;
  dob: string;
  bio: string;
  avatar: string;
  address: string;
  city: string;
  state: string;  
  gender: string;  
  profession: string;
  languages: string[];
}

const EMPTY_FORM: ProfileForm = {
  fullName: "",
  phone: "",
  dob: "",
  bio: "",
  avatar: "",
  address: "",
  city: "",
  state: "",  
  gender: "",  
  profession: "",
  languages: [],
};

const AVAILABLE_LANGUAGES = [
  // Major International Languages
  "English",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Dutch",
  "Portuguese",
  // Scheduled Indian Languages
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Sanskrit",
  "Kashmiri",
  "Nepali",
  "Sindhi",
  "Dogri",
  "Konkani",
  "Manipuri",
  "Bodo",
  "Santali",
];

const formatDay = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const calculateAge = (dobString: string): number | null => {
  if (!dobString) return null;
  const today = new Date();
  const birthDate = new Date(dobString);
  if (Number.isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

// Custom Clean Calendar Component matching UI Theme
function CustomDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (dateStr: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState<Date>(
    selectedDate && !Number.isNaN(selectedDate.getTime()) ? selectedDate : new Date(2000, 0, 1)
  );

  useEffect(() => {
    if (selectedDate && !Number.isNaN(selectedDate.getTime())) {
      setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${paddedMonth}-${paddedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const displayValue = selectedDate && !Number.isNaN(selectedDate.getTime())
    ? selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Select date of birth";

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus-within:border-blue-500 transition-all bg-white cursor-pointer flex items-center justify-between"
      >
        <span className={value ? "text-slate-900 font-medium" : "text-slate-400"}>
          {displayValue}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl border border-slate-200/80 shadow-xl p-4 w-72 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2 uppercase">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const paddedMonth = String(month + 1).padStart(2, "0");
              const paddedDay = String(dayNum).padStart(2, "0");
              const currentStr = `${year}-${paddedMonth}-${paddedDay}`;
              const isSelected = value === currentStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-medium transition-colors cursor-pointer mx-auto ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Multi-select Languages Dropdown with Search & Done button matching your theme
function CustomLanguagesSelect({
  selectedLanguages = [],
  onChange,
}: {
  selectedLanguages: string[];
  onChange: (langs: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const safeLanguages = Array.isArray(selectedLanguages) ? selectedLanguages : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = (lang: string) => {
    if (safeLanguages.includes(lang)) {
      onChange(safeLanguages.filter((l) => l !== lang));
    } else {
      onChange([...safeLanguages, lang]);
    }
  };

  const filteredLanguages = AVAILABLE_LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayText =
    safeLanguages.length > 0
      ? safeLanguages.join(", ")
      : "Select languages spoken";

  return (
    <div className="space-y-1.5 relative sm:col-span-2" ref={containerRef}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 block">
        Languages Spoken <span className="text-slate-400 font-normal">(Includes all Indian & major global languages)</span>
      </span>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200/60 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 cursor-pointer flex items-center justify-between"
      >
        <span className={safeLanguages.length > 0 ? "text-slate-900 truncate pr-2" : "text-slate-400"}>
          {displayText}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200/80 bg-white shadow-xl p-3 space-y-2 animate-fadeIn">
          {/* Search bar for quickly finding specific languages */}
          <input
            type="text"
            placeholder="Search language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-slate-50/50"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredLanguages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No languages found</p>
            ) : (
              filteredLanguages.map((lang) => {
                const isChecked = safeLanguages.includes(lang);
                return (
                  <div
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                      isChecked ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{lang}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {safeLanguages.length} selected
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Themed Dropdown Component matching your exact UI theme
function CustomGenderSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
    { label: "Other", value: "other" },
  ];

  const selectedLabel = value
    ? options.find((opt) => opt.value === value)?.label || value
    : "Select";

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 block">
        Gender <span className="text-red-500">*</span>
      </span>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200/60 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 cursor-pointer flex items-center justify-between"
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white shadow-xl py-1 overflow-hidden animate-fadeIn">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Clean Compact Preview Banner
function ProfilePreviewBanner({
  form,
  userAge,
  listingsCount,
  rentalsCount,
}: {
  form: ProfileForm;
  userAge: number | null;
  listingsCount: number;
  rentalsCount: number;
}) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const bioText = form?.bio || "";
  const shouldTruncateBio = bioText.length > 120;
  const displayedBio = shouldTruncateBio && !isBioExpanded ? `${bioText.slice(0, 120)}...` : bioText;

  const languagesList = Array.isArray(form?.languages) ? form.languages : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Top Section: Avatar + Name + Clean Activity Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {form?.avatar ? (
              <img
                src={form.avatar}
                alt={form?.fullName || "User Avatar"}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-white shadow-sm bg-white"
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 font-bold text-xl">
                {form?.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Active"></div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {form?.fullName || ""}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {form?.profession || ""} {form?.city ? `in ${form.city}` : ""}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Items</span>
          <span className="text-sm font-bold text-slate-800">{listingsCount + rentalsCount} active</span>
        </div>
      </div>

      {/* Grid Details Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Location</span>
          <div className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{form?.city || "Germany"}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Profession</span>
          <div className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{form?.profession || ""}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Age</span>
          <div className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
            <Cake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{userAge !== null ? `${userAge} yrs` : ""}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Gender</span>
          <div className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
            <UserIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate capitalize">{form?.gender || ""}</span>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Languages Spoken</span>
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {languagesList.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs"
            >
              <Globe className="w-3 h-3 text-blue-600" />
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* About Section */}
      {bioText && (
        <div className="space-y-1.5 pt-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">About</h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            {displayedBio}
            {shouldTruncateBio && (
              <button
                type="button"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="ml-2 text-blue-600 font-semibold hover:underline inline-flex items-center cursor-pointer"
              >
                {isBioExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const { incoming, outgoing } = useBookingRequests();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState<ProfileForm>(EMPTY_FORM);

  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [rentals, setRentals] = useState<ListingSummary[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    fetch(`/api/auth/profile?userId=${encodeURIComponent(user.id)}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return;
        const profile = result?.data as Partial<ProfileForm> | null;
        const initialData: ProfileForm = {
          ...EMPTY_FORM,
          fullName: profile?.fullName || user.name || "",
          avatar: profile?.avatar || user.avatar || "",
          phone: profile?.phone || "",
          dob: profile?.dob || "",
          bio: profile?.bio || "",
          address: profile?.address || "",
          city: profile?.city || "",
          state: profile?.state || "",  
          gender: profile?.gender || "",  
          profession: profile?.profession || "",
          languages: Array.isArray(profile?.languages) ? profile.languages : [],
        };
        setForm(initialData);
        setSavedForm(initialData);
      })
      .catch((err) => console.error("Failed to load profile", err));

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    Promise.all([
      fetchListings({ userId: user.id }),
      fetchListings({ renterId: user.id }),
    ])
      .then(([owned, rented]) => {
        if (cancelled) return;
        setListings(owned);
        setRentals(rented);
      })
      .catch((err) => console.error("Failed to load rental activity", err));

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleChange = (field: keyof ProfileForm, value: any) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => handleChange("avatar", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.dob.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.gender.trim() ||
      !form.profession.trim()
    ) {
      setError("Please fill in all required fields before saving.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, ...form }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Could not save your profile");
      }

      updateUser({ name: form.fullName, avatar: form.avatar });
      setSavedForm({ ...form });
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile");
    } finally {
      setIsSaving(false);
    }
  };

  const pendingForMe = incoming.filter((request) => request.status === "pending").length;

  const recentActivity: BookingRequest[] = [...incoming, ...outgoing]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const savedUserAge = calculateAge(savedForm.dob);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Your profile</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Edit your personal details on the left and see your live saved marketplace profile preview on the right.
          </p>
        </div>

        {/* Two-Column Layout: Left (Editing Form), Right (Live Saved Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Editor Form */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 sticky top-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Profile Details</h3>
                  <p className="text-xs text-slate-500">Update your information across Rentit.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {form.avatar ? (
                      <img
                        src={form.avatar}
                        alt={form.fullName}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm">
                        {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Change profile photo"
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Full name <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={form.fullName}
                    onChange={(event) => handleChange("fullName", event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Phone number <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    placeholder="+49 1234 567890"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center justify-between">
                    <span>Date of Birth <span className="text-red-500">*</span></span>
                    {calculateAge(form.dob) !== null && (
                      <span className="text-blue-600 font-semibold lowercase">
                        {calculateAge(form.dob)} years old
                      </span>
                    )}
                  </span>
                  <CustomDatePicker
                    value={form.dob}
                    onChange={(dateStr) => handleChange("dob", dateStr)}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    City <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={form.city}
                    onChange={(event) => handleChange("city", event.target.value)}
                    placeholder="e.g. Sindelfingen / Kassel"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Address <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={form.address}
                    onChange={(event) => handleChange("address", event.target.value)}
                    placeholder="Where renters collect items or your location"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </label>

                <CustomGenderSelect
                  value={form.gender}
                  onChange={(val) => handleChange("gender", val)}
                />
     
                <label className="space-y-1.5">  
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">  
                    Profession <span className="text-red-500">*</span> 
                  </span>  
                  <input  
                    value={form.profession}  
                    onChange={(event) => handleChange("profession", event.target.value)}  
                    placeholder="e.g. Student"  
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"  
                  />  
                </label>

                {/* Custom Multi-select Languages Dropdown with Search & Done button */}
                <CustomLanguagesSelect
                  selectedLanguages={form.languages}
                  onChange={(langs) => handleChange("languages", langs)}
                />

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    About you / Bio <span className="text-slate-400 font-normal">(Optional)</span>
                  </span>
                  <textarea
                    value={form.bio}
                    onChange={(event) => handleChange("bio", event.target.value)}
                    rows={3}
                    placeholder="A line or two about yourself or the gear you share"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </label>
              </div>

              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>

                {savedAt > 0 && !isSaving && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" /> Saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Live Saved Profile Preview */}
          <div className="lg:col-span-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Profile Preview</h3>
              <span className="text-xs text-slate-400">Updates immediately after clicking Save</span>
            </div>

            <ProfilePreviewBanner
              form={savedForm}
              userAge={savedUserAge}
              listingsCount={listings.length}
              rentalsCount={rentals.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold">Rental activity</h2>
                  <Link
                    href="/dashboard/view-booking?tab=notifications"
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    {pendingForMe > 0 ? `${pendingForMe} to review` : "View all"}
                  </Link>
                </div>

                {recentActivity.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No rental requests yet.
                  </p>
                ) : (
                  recentActivity.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between gap-3 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{request.listingTitle}</p>
                        <p className="text-[11px] text-slate-500">
                          {request.ownerId === user?.id ? `${request.renterName} · ` : "You · "}
                          {formatDay(request.startDate)} – {formatDay(request.endDate)}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                        {BOOKING_REQUEST_LABELS[request.status]}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold">Your items</h2>
                  <Link
                    href="/dashboard/view-booking"
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                {listings.length === 0 ? (
                  <div className="py-4 text-center space-y-2">
                    <p className="text-xs text-slate-500">You have not listed anything yet.</p>
                    <Link
                      href="/list-item"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> List an item
                    </Link>
                  </div>
                ) : (
                  listings.slice(0, 3).map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between gap-3 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {String(listing.productName || "Listing")}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          ₹{listingDailyPrice(listing).toLocaleString("en-IN")}/day
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                        {LISTING_STATUS_LABELS[listing.status]}
                      </span>
                    </div>
                  ))
                )}

                <div className="pt-1">
                  <Link
                    href="/saved"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" /> Your favorites
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}