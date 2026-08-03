"use client";

import { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  Lock,
  Calendar,
  Globe,
  Award,
  DollarSign,
  Package,
  Star,
  Bell,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  SlidersHorizontal,
  X,
  ChevronDown,
  Upload,
  UserCheck,
  Building2,
  Check,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  HelpCircle,
  Key,
  Smartphone,
  Shield,
  FileCheck,
  MessageSquare,
  ThumbsUp,
  Share2,
} from "lucide-react";
import { RippleButton } from "@/components/ui/RippleButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function EnterpriseProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [saved, setSaved] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // List of Indian and International languages
  const indianLanguages = [
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
    "English",
    "German",
  ];

  // Preset Avatar Options
  const presetAvatars = {
    male: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
    female: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
  };

  const [formData, setFormData] = useState({
    name: "Balaji Shankar",
    username: "@balajishankar",
    email: "balaji.shankar@mercedes-benz.com",
    phone: "+49 151 23456789",
    dob: "1992-06-14",
    sex: "Male",
    languages: ["English", "Hindi", "Tamil", "German"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    company: "Mercedes-Benz AG",
    bio: "Equipment enthusiast and software builder. Renting out professional gear, cameras, and automotive tools safely.",
    addressLine1: "Königstraße 45",
    addressLine2: "Apt 4B",
    city: "Stuttgart",
    state: "Baden-Württemberg",
    postalCode: "70567",
    country: "Germany",
    completionPercentage: 92,
  });

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return { ...prev, languages: prev.languages.filter((l) => l !== lang) };
      } else {
        return { ...prev, languages: [...prev.languages, lang] };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const navTabs = [
    { id: "personal", label: "Personal Info", icon: User },
  // id: "overview", label: "Profile Overview", icon: FileText },
    { id: "verification", label: "Verification", icon: ShieldCheck },
  //{ id: "trust", label: "Trust & Safety", icon: Award },
    { id: "activity", label: "Rental Activity", icon: Package },
    { id: "listings", label: "Listings", icon: SlidersHorizontal },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "delivery", label: "Pickup & Delivery", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "support", label: "Emergency & Support", icon: AlertTriangle },
    { id: "achievements", label: "Badges", icon: Award },
    { id: "privacy", label: "Privacy & Data", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Navbar />

      {/* Hidden File Input for Custom Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 font-heading">Choose Profile Photo</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Custom Upload Option */}
            <div 
              onClick={() => {
                fileInputRef.current?.click();
                setIsAvatarModalOpen(false);
              }}
              className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors group"
            >
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-[#2563EB] text-white mb-3 shadow-md group-hover:scale-105 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Upload Custom Photo</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Supports JPG, PNG or WebP files from your device</p>
            </div>

            {/* Male Avatars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Preset Male Avatars</h4>
              <div className="grid grid-cols-4 gap-3">
                {presetAvatars.male.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, avatar: url }));
                      setIsAvatarModalOpen(false);
                    }}
                    className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#2563EB] cursor-pointer shadow-sm transition-all"
                  >
                    <img src={url} alt="Male Avatar" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Female Avatars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Preset Female Avatars</h4>
              <div className="grid grid-cols-4 gap-3">
                {presetAvatars.female.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, avatar: url }));
                      setIsAvatarModalOpen(false);
                    }}
                    className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#2563EB] cursor-pointer shadow-sm transition-all"
                  >
                    <img src={url} alt="Female Avatar" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-12 space-y-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] p-8 sm:p-10 text-white shadow-xl shadow-blue-500/10">
          
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              
              <div className="relative h-28 w-28 shrink-0 rounded-full overflow-hidden border-4 border-white/20 shadow-xl group">
                <img
                  src={formData.avatar}
                  alt="Profile Avatar"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button 
                  type="button" 
                  onClick={() => setIsAvatarModalOpen(true)}
                  aria-label="Change profile photo"
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white mb-0.5" />
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">Edit</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight font-heading">{formData.name}</h1>
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {formData.username}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  Member since March 2024 • {formData.city}, {formData.country} • {formData.company}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20 shadow-inner">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Verified Pro Lender
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-200 border border-amber-300/30">
                    ★ 4.98 Trust Score (142 Reviews)
                  </div>
                </div>
              </div>

            </div>

            <div className="w-full lg:w-80 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Profile Strength</span>
                <span className="text-sm font-extrabold text-white">{formData.completionPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/20 overflow-hidden mb-3">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500" 
                  style={{ width: `${formData.completionPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-100/80 leading-relaxed">
                Add your driving license verification and bank payout details to unlock 100% trusted status.
              </p>
            </div>

          </div>
        </div>

        {/* ================= KPI STATS BAR ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earnings</span>
              <div className="h-9 w-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 font-heading">€4,850.00</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +18.4% from last month
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Rentals</span>
              <div className="h-9 w-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 font-heading">12 Items</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-1">
              4 currently on rent out
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response Rate</span>
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 font-heading">99%</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-1">
              Avg reply time: &lt; 15 mins
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Success Rate</span>
              <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 font-heading">100%</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-1">
              0 cancellations recorded
            </p>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200/80">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB CONTENT PANELS ================= */}

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === "personal" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your identity details, address, languages, and contacts.</p>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                  ID: #RENT-8492
                </span>
              </div>

              {saved && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 px-5 py-4 text-xs font-bold text-emerald-800 shadow-sm">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">✓</div>
                  <span>Profile updated successfully! All changes are now synchronized across RentIt marketplace.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Photo Quick Update Card */}
                <div className="p-6 rounded-3xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={formData.avatar} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover shadow-md border-2 border-white" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Profile Photo</h4>
                      <p className="text-xs text-gray-500">Update your avatar from device upload or preset gallery</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4 text-[#2563EB]" /> Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Username</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-2xl border border-gray-200 bg-gray-100/80 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-500 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Date of Birth</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Sex / Gender Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Sex / Gender</label>
                    <div className="relative group">
                      <UserCheck className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Preferred Languages Multi-Select Dropdown */}
                  <div className="space-y-2 relative sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Preferred Languages (Indian & International)</label>
                    <div 
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-xs font-semibold text-gray-800 flex items-center justify-between cursor-pointer hover:bg-white transition-all"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {formData.languages.length > 0 ? (
                          formData.languages.map((lang, idx) => (
                            <span key={idx} className="bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                              {lang}
                              <X 
                                className="h-3 w-3 hover:text-rose-600" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLanguage(lang);
                                }}
                              />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 py-1">Select languages...</span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                    </div>

                    {/* Dropdown Menu */}
                    {isLangDropdownOpen && (
                      <div className="absolute z-30 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-xl max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {indianLanguages.map((lang, idx) => {
                          const isSelected = formData.languages.includes(lang);
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleLanguage(lang)}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                isSelected ? "bg-blue-50 text-[#2563EB]" : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <span>{lang}</span>
                              {isSelected && <span className="text-xs">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* ================= ADDRESS SECTION ================= */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 font-heading">Address Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Address Line 1</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2563EB]" />
                        <input
                          type="text"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 px-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 px-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 px-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">State / Province</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 px-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 px-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio / About */}
                <div className="space-y-2 pt-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">About / Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <RippleButton type="submit" className="rounded-2xl bg-[#2563EB] px-8 py-4 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Personal Changes
                  </RippleButton>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Public Profile Overview</h2>
                  <p className="text-xs text-gray-500 mt-0.5">This is how your renters and lenders see your profile across RentIt.</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Public View Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={formData.avatar} alt="Avatar" className="h-14 w-14 rounded-full object-cover shadow-sm" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{formData.name}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{formData.username}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{formData.bio}</p>
                  <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" /> {formData.city}, {formData.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" /> {formData.company}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="p-6 rounded-3xl border border-gray-200/80 bg-white space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-gray-900">Verified Credentials & Badges</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">ID Verified</p>
                          <p className="text-[10px] text-gray-500">Passport / License</p>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Email & Phone</p>
                          <p className="text-[10px] text-gray-500">Fully Confirmed</p>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
                        <Star className="h-5 w-5 text-amber-600 fill-amber-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Top Rater</p>
                          <p className="text-[10px] text-gray-500">4.98 / 5.0 Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl border border-gray-200/80 bg-white space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-gray-900">Languages Spoken</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VERIFICATION */}
        {activeTab === "verification" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Identity & Professional Verification</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Submit official documents to boost your trust badge and rental limits.</p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-[#2563EB] px-3 py-1 rounded-xl border border-blue-100">
                  Level 2 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Government ID Verification</h4>
                        <p className="text-xs text-emerald-700 font-semibold">Approved on March 14, 2024</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">Verified</span>
                  </div>
                  <p className="text-xs text-gray-600">German National Identity Card / Passport securely validated via IDnow.</p>
                </div>

                <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Driving License Check</h4>
                        <p className="text-xs text-emerald-700 font-semibold">Class B & A Approved</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">Verified</span>
                  </div>
                  <p className="text-xs text-gray-600">Required for renting vehicles, automotive diagnostic kits, and heavy equipment.</p>
                </div>

                <div className="p-6 rounded-3xl border border-blue-200 bg-blue-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Corporate Employment Badge</h4>
                        <p className="text-xs text-blue-700 font-semibold">{formData.company}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-xs text-gray-600">Verified via corporate email domain match. Unlocks peer-to-peer corporate discounts.</p>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200 bg-gray-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gray-200 text-gray-600 flex items-center justify-center font-bold">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Biometric Face Match</h4>
                        <p className="text-xs text-gray-500">Optional extra security</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">Start Now</button>
                  </div>
                  <p className="text-xs text-gray-600">Enables instant pickup verification without manual ID checks.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRUST & SAFETY */}
        {activeTab === "trust" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Trust & Safety Center</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Review your insurance protection limits, safety score, and community guidelines.</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  ★ 4.98 Rating
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-4 shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="h-8 w-8 text-blue-200" />
                  <h3 className="text-lg font-bold font-heading">RentIt €100,000 Guarantee</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    All items rented or listed by {formData.name} are covered against damage, theft, and accidental liability up to €100,000.
                  </p>
                  <div className="pt-2 text-xs font-bold underline cursor-pointer">View Policy Details</div>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50 space-y-4">
                  <Award className="h-8 w-8 text-[#2563EB]" />
                  <h3 className="text-lg font-bold text-gray-900 font-heading">Zero Incident Record</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Over 140+ completed rentals with zero disputes, claims, or damaged returns. You are rated in the top 1% of reliable lenders.
                  </p>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50 space-y-4">
                  <Lock className="h-8 w-8 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900 font-heading">Secure Deposit Escrow</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Security deposits are automatically held in encrypted escrow accounts and released within 24 hours of successful item return.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RENTAL ACTIVITY */}
        {activeTab === "activity" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Rental Activity Log</h2>
                  <p className="text-xs text-gray-500 mt-0.5">History of items you have rented out and equipment borrowed.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-bold bg-blue-50 text-[#2563EB] px-3 py-1.5 rounded-xl border border-blue-100 cursor-pointer">Lending History</span>
                  <span className="text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer">Borrowing History</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Sony A7IV Mirrorless Camera Kit", date: "July 12 - July 18, 2026", status: "Completed", amount: "€210.00", client: "Markus Weber" },
                  { title: "OBD2 ECU Diagnostic Flashing Tool", date: "June 01 - June 05, 2026", status: "Completed", amount: "€150.00", client: "Stefan Braun" },
                  { title: "DJI Mavic 3 Pro Drone", date: "August 05 - August 10, 2026", status: "Active / On Rent", amount: "€320.00", client: "Julia Schneider" },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status.includes("Active") ? "bg-blue-100 text-[#2563EB]" : "bg-emerald-100 text-emerald-800"
                        }`}>{item.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rented to <span className="font-semibold text-gray-700">{item.client}</span> • {item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-gray-900">{item.amount}</p>
                      <span className="text-[11px] text-[#2563EB] font-semibold hover:underline cursor-pointer">View Details</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: LISTINGS */}
        {activeTab === "listings" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Your Active Listings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage the equipment and tools you have published on the marketplace.</p>
                </div>
                <RippleButton className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer flex items-center gap-1.5">
                  <Plus className="h-4 w-4" /> Add New Listing
                </RippleButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Bosch Professional OBD2 Diagnostic Scanner", price: "€45 / day", status: "Active", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400" },
                  { name: "Sony FX3 Cinema Line Camera", price: "€95 / day", status: "Active", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
                  { name: "Milwaukee Heavy Duty Cordless Impact Wrench", price: "€30 / day", status: "Rented Out", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-gray-200/80 overflow-hidden bg-white shadow-xs group">
                    <div className="h-40 overflow-hidden relative">
                      <img src={item.img} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">
                        {item.status}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-[#2563EB]">{item.price}</span>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer" title="Edit Listing">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer" title="Delete Listing">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EARNINGS */}
        {activeTab === "earnings" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Earnings & Payouts</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Track your revenue, pending transfers, and connected bank accounts.</p>
                </div>
                <button className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Export Tax Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#2563EB] to-indigo-600 text-white space-y-2 shadow-lg">
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Available Balance</span>
                  <p className="text-3xl font-extrabold font-heading">€1,240.50</p>
                  <div className="pt-4">
                    <button className="w-full py-2.5 rounded-xl bg-white text-[#2563EB] text-xs font-bold shadow-md hover:bg-blue-50 cursor-pointer">
                      Withdraw to Bank
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50 space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Payouts</span>
                  <p className="text-3xl font-extrabold text-gray-900 font-heading">€450.00</p>
                  <p className="text-xs text-gray-500 pt-4">Estimated arrival: August 06, 2026</p>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50 space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Connected Bank</span>
                  <p className="text-sm font-bold text-gray-900 pt-1">Deutsche Bank (DE89 **** 4490)</p>
                  <p className="text-xs text-emerald-600 font-semibold pt-3 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified & Primary
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PICKUP & DELIVERY */}
        {activeTab === "delivery" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Pickup & Delivery Preferences</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Set your preferred meetup locations, shipping radius, and handover times.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50/50 space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">Primary Pickup Address</h4>
                  <p className="text-xs text-gray-600">{formData.addressLine1}, {formData.addressLine2} - {formData.postalCode} {formData.city}, {formData.country}</p>
                  <span className="inline-block text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">Edit Address</span>
                </div>

                <div className="p-6 rounded-3xl border border-gray-200/80 bg-gray-50/50 space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">Delivery Options Offered</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">In-Person Handover</p>
                        <p className="text-[10px] text-gray-500">Stuttgart Central / Office</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Enabled</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">DHL Express Shipping</p>
                        <p className="text-[10px] text-gray-500">Within Germany / EU</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Notification Settings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Control how and when you receive alerts about rentals and messages.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Rental Request Alerts", desc: "Receive instant push and email alerts when someone wants to rent your gear.", defaultChecked: true },
                  { title: "Chat Messages", desc: "Notify immediately when renters send direct inquiries.", defaultChecked: true },
                  { title: "Payout Confirmations", desc: "Get notified when funds are successfully transferred to your bank account.", defaultChecked: true },
                  { title: "Marketing & Community Updates", desc: "Receive RentIt newsletter, security guidelines, and pro tips.", defaultChecked: false },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 flex items-center justify-between">
                    <div className="space-y-0.5 max-w-lg">
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="h-5 w-5 accent-[#2563EB] cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Saved Payment Methods</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage credit cards and payment gateways linked to your account.</p>
                </div>
                <button className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer">
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      VISA
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">•••• •••• •••• 4892</h4>
                      <p className="text-xs text-gray-500">Expires 08/28 • Primary Card</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">Remove</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Account Security & Password</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Update your password, enable two-factor authentication, and check active sessions.</p>
                </div>
              </div>

              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-xs font-semibold text-gray-800" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-xs font-semibold text-gray-800" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-xs font-semibold text-gray-800" />
                </div>
                <button className="rounded-xl bg-[#2563EB] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Reviews from Renters & Lenders</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Feedback and ratings left by community members.</p>
                </div>
                <span className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                  ★ 4.98 Overall (142 Reviews)
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Markus Weber", role: "Renter", comment: "Balaji was exceptionally professional and handed over the camera kit in pristine condition. Highly recommended!", date: "July 2026" },
                  { name: "Stefan Braun", role: "Renter", comment: "Smooth handover and great communication. The diagnostic equipment worked perfectly.", date: "June 2026" },
                ].map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{rev.name}</h4>
                        <span className="text-[10px] text-gray-500">({rev.role})</span>
                      </div>
                      <span className="text-xs font-bold text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-xs text-gray-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                    <p className="text-[10px] text-gray-400">{rev.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: EMERGENCY & SUPPORT */}
        {activeTab === "support" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Emergency & Support Center</h2>
                  <p className="text-xs text-gray-500 mt-0.5">24/7 priority support hotline and dispute assistance.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 space-y-3">
                  <AlertTriangle className="h-8 w-8 text-rose-600" />
                  <h3 className="text-base font-bold text-rose-900">Active Rental Emergency Hotline</h3>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    If you are currently experiencing an accident, equipment failure, or urgent dispute during a handover, contact our 24/7 priority response line immediately.
                  </p>
                  <span className="inline-block text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-xl shadow-sm cursor-pointer">
                    Call +49 800 555 2424
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-3">
                  <HelpCircle className="h-8 w-8 text-[#2563EB]" />
                  <h3 className="text-base font-bold text-blue-900">General Support Ticket</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Have questions about billing, insurance claims, or account settings? Our support team typically replies within 2 hours.
                  </p>
                  <span className="inline-block text-xs font-bold bg-[#2563EB] text-white px-4 py-2 rounded-xl shadow-sm cursor-pointer">
                    Open Support Ticket
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: ACHIEVEMENTS / BADGES */}
        {activeTab === "achievements" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Badges & Achievements</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Badges unlocked through active marketplace participation and stellar ratings.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: "Super Lender", desc: "Maintained 4.9+ rating over 100 rentals", icon: Award, color: "bg-amber-100 text-amber-700" },
                  { title: "Lightning Responder", desc: "Average reply time under 15 mins", icon: Clock, color: "bg-emerald-100 text-emerald-700" },
                  { title: "Verified Pro", desc: "Corporate & ID verification completed", icon: ShieldCheck, color: "bg-blue-100 text-[#2563EB]" },
                  { title: "Pioneer Member", desc: "Joined RentIt during 2024 launch phase", icon: Star, color: "bg-indigo-100 text-indigo-700" },
                ].map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="p-5 rounded-3xl border border-gray-200/80 bg-gray-50/50 text-center space-y-3">
                      <div className={`mx-auto h-12 w-12 rounded-2xl flex items-center justify-center ${badge.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-900">{badge.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-tight">{badge.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 15: PRIVACY & DATA */}
        {activeTab === "privacy" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="rounded-[2.5rem] border border-gray-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Privacy & Data Control (GDPR)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Download your personal data archive or request account deletion.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Download Your Data Archive</h4>
                    <p className="text-xs text-gray-500">Includes all rental history, messages, profile details, and uploaded files in JSON format.</p>
                  </div>
                  <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
                    Request Archive
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">Delete Account & Data</h4>
                    <p className="text-xs text-rose-700">Permanently remove your profile and personal records in compliance with EU GDPR regulations.</p>
                  </div>
                  <button className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}