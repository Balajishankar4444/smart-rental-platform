"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  CheckCircle2,
  Camera,
  Wrench,
  Tent,
  Gamepad2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Search,
  Check,
  Upload,
  MapPin,
  Bell,
  Car,
  Briefcase,
  FileText,
  Navigation,
} from "lucide-react";

// Categories with icons & item counters
const CATEGORIES = [
  { id: "tools", label: "Power & Hand Tools", icon: Wrench, count: "1.2k+ items" },
  { id: "cameras", label: "Cameras & AV Gear", icon: Camera, count: "850+ items" },
  { id: "camping", label: "Trekking & Camping", icon: Tent, count: "400+ items" },
  { id: "gaming", label: "Consoles & VR Gear", icon: Gamepad2, count: "650+ items" },
  { id: "automotive", label: "Auto & Diagnostic Tools", icon: Car, count: "320+ items" },
  { id: "events", label: "Party & Event Decor", icon: Sparkles, count: "900+ items" },
];

export default function OnboardingPage() {
  const router = useRouter();

  // Personalization States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["tools", "cameras"]);
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("Technician / Hobbyist");
  const [radius, setRadius] = useState<number>(10); // pickup radius in km
  const [deliveryPref, setDeliveryPref] = useState<"self" | "doorstep" | "both">("both");
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    priceAlerts: true,
  });
  const [skipId, setSkipId] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Submission handler to save state & navigate dynamically
  const handleSaveAndNavigate = (targetPath: string) => {
    const profilePayload = {
      selectedCategories,
      occupation,
      bio,
      radius,
      deliveryPref,
      notifications,
      isIdUploaded: !skipId,
    };

    // Save preferences locally or call an API here
    console.log("Saving preferences...", profilePayload);

    // Route to target path (/explore or /list-item)
    router.push(targetPath);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-950 font-sans pb-16">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          {/* Stepper */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] font-heading">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                1
              </span>
              Account Created
            </div>
            <div className="h-0.5 w-8 bg-blue-200" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 font-heading">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white">
                2
              </span>
              Complete Profile
            </div>
            <div className="h-0.5 w-8 bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-heading">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                3
              </span>
              Dashboard
            </div>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-[#2563EB] transition font-heading"
          >
            Skip for now →
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 font-heading mb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Basic Registration Complete
          </div>
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
            Personalize your RentIt experience
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Setting your rental preferences ensures you see nearby gear with accurate pickup distances and tailored trust ratings.
          </p>
        </div>

        {/* SECTION 1: Category Interests */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 font-heading">
                1. What gear are you looking for?
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Choose the primary categories you plan to rent or lend.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full font-heading">
              {selectedCategories.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`group flex items-start justify-between p-4 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/20"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        isSelected
                          ? "bg-[#2563EB] text-white"
                          : "bg-white text-slate-700 shadow-sm border border-slate-200 group-hover:border-blue-200"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading">
                        {cat.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {cat.count}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-[#2563EB] bg-[#2563EB] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Profile Bio & Profession */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-slate-950 font-heading">
              2. Public Rental Profile
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Lenders and borrowers inspect this bio before approving rental bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                Primary Profession / Role
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Photographer, Software Engineer, DIYer"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                Short Bio / Introduction
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Responsible local renter, careful handling of high-end equipment."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Logistics & Pickup Settings */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-slate-950 font-heading">
              3. Pickup & Logistics Preferences
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Define your travel radius for local gear pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wide flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-[#2563EB]" /> Max Search Radius
                </label>
                <span className="text-xs font-bold text-[#2563EB] font-heading bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {radius} km
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>2 km (Walking distance)</span>
                <span>50 km (Citywide)</span>
              </div>
            </div>

            {/* Delivery Method Selector */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                Preferred Handover Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "self", label: "Self Pickup" },
                  { id: "doorstep", label: "Delivery" },
                  { id: "both", label: "Both" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDeliveryPref(mode.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition font-heading ${
                      deliveryPref === mode.id
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Notification Preferences */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2563EB]" /> 4. Notification Settings
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Choose how you wish to receive booking requests and return reminders.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "whatsapp",
                title: "WhatsApp Alerts",
                desc: "Instant pickup coordinates, PIN verifications, and return reminders.",
              },
              {
                key: "email",
                title: "Email Receipts & Contracts",
                desc: "Detailed rental agreements, deposit receipts, and invoices.",
              },
              {
                key: "priceAlerts",
                title: "Price Drops & Nearby Deals",
                desc: "Get notified when items on your wishlist become available nearby.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 font-heading">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {item.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 5: Verification Teaser */}
        <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-950 font-heading">
                    Unlock High-Value Rentals (Govt ID)
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 font-heading">
                    Optional
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 max-w-lg leading-relaxed">
                  You can browse standard items right away. Uploading a Govt ID unlocks high-tier DSLR cameras, diagnostic tools, and gives your listings a 3x trust badge.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSkipId(!skipId)}
              className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-blue-200 bg-white px-5 py-3 text-xs font-bold text-[#2563EB] shadow-sm hover:bg-blue-50 transition cursor-pointer font-heading"
            >
              <Upload className="h-4 w-4" />
              <span>{skipId ? "Verification Deferred" : "Upload ID Now"}</span>
            </button>
          </div>
        </div>

        {/* Action Choice Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Save & Explore Feed */}
          <button
            type="button"
            onClick={() => handleSaveAndNavigate("/dashboard")}
            className="group flex items-center justify-between rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-[#2563EB] hover:shadow-md transition cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-950 font-heading">
                  Save & Explore Feed
                </h4>
                <p className="text-xs text-slate-500">Discover items within {radius} km of your location</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition" />
          </button>

          {/* Save & List Equipment */}
          <button
            type="button"
            onClick={() => handleSaveAndNavigate("/list-item")}
            className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] p-5 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white font-heading">
                  Save & List Equipment
                </h4>
                <p className="text-xs text-white/80">Monetize your gear locally</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition" />
          </button>
        </div>

      </section>
    </main>
  );
}