// app/list-item/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation"; 
import { 
  Home, Building2, MapPin, Calendar, DollarSign, Eye, RefreshCw, X, UploadCloud, 
  Trash2, Star, Zap, AlertCircle, Check, ArrowRight, ArrowLeft, Save, ShieldCheck, 
  Info, Sparkles, Users, BedDouble, Clock, Coffee, ChevronDown, Lock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

// ==========================================
// TYPES & INTERFACES
// ==========================================
type PropertyType = "Shared Room" | "Private Room" | "Apartment" | "";
type BedType = "Sofa" | "Ground" | "Separate Bed" | "Shared Bed" | "";

interface ListingFormState {
  propertyType: PropertyType;
  productName: string; // Listing Title
  description: string;

  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetName: string;
  houseNumber: string;
  latitude: string;
  longitude: string;

  dailyPrice: string; // Price per Night
  securityDeposit: string;

  availableFrom: string;
  availableTo: string;
  minStay: string;
  maxStay: string;

  // Filter-ready backend properties
  numGuests: number;
  petsAllowed: boolean;

  bedType: BedType;

  amenities: {
    wifi: boolean;
    kitchen: boolean;
    bathroom: boolean;
    hotWater: boolean;
    washingMachine: boolean;
    heating: boolean;
    parking: boolean;
    towels: boolean;
    bedSheets: boolean;
  };

  images: string[];
  primaryImageIndex: number;

  checkInTime: string;
  checkOutTime: string;
  smokingAllowed: boolean;
  visitorsAllowed: boolean;
  quietHours: string;
}

const GERMAN_STATES = [
  "Baden-Württemberg",
  "Bavaria (Bayern)",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hesse (Hessen)",
  "Lower Saxony (Niedersachsen)",
  "Mecklenburg-Vorpommern",
  "North Rhine-Westphalia (Nordrhein-Westfalen)",
  "Rhineland-Palatinate (Rheinland-Pfalz)",
  "Saarland",
  "Saxony (Sachsen)",
  "Saxony-Anhalt (Sachsen-Anhalt)",
  "Schleswig-Holstein",
  "Thuringia (Thüringen)"
];

export default function ListItemPage() {
  return (
    <ProtectedRoute>
      <ListItemContent />
    </ProtectedRoute>
  );
}

function ListItemContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // Error tracking state for inline validation highlights
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for custom dropdown visibility
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isBedTypeOpen, setIsBedTypeOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isPetsAllowedOpen, setIsPetsAllowedOpen] = useState(false);
  
  const bedRef = React.useRef<HTMLDivElement>(null);
  const stateRef = React.useRef<HTMLDivElement>(null);
  const petsRef = React.useRef<HTMLDivElement>(null);

  // Form State
  const [form, setForm] = useState<ListingFormState>({
    propertyType: "Private Room",
    productName: "",
    description: "",

    country: "Germany",
    state: "Baden-Württemberg",
    city: "Stuttgart",
    postalCode: "70174",
    streetName: "Friedrichstraße",
    houseNumber: "43",
    latitude: "48.7758",
    longitude: "9.1829",

    dailyPrice: "850",
    securityDeposit: "2500",

    availableFrom: "2026-09-01",
    availableTo: "2027-09-01",
    minStay: "1 Night",
    maxStay: "90 Days",

    // Initialized backend-ready fields for filtering
    numGuests: 1,
    petsAllowed: false,

    bedType: "Separate Bed",

    amenities: {
      wifi: true,
      kitchen: true,
      bathroom: true,
      hotWater: true,
      washingMachine: false,
      heating: true,
      parking: false,
      towels: true,
      bedSheets: true,
    },

    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
    ],
    primaryImageIndex: 0,

    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    smokingAllowed: false,
    visitorsAllowed: true,
    quietHours: "10:00 PM - 07:00 AM",
  });

  const publishListing = async () => {
    console.log("PUBLISH BUTTON CLICKED");
    if (!user) {
      setErrorMessage("Please sign in again before publishing your listing.");
      return;
    }
    try {
      // Payload structurally mapped with backend filter properties: numGuests & petsAllowed
      const payload = {
        ...form,
        userId: user.id,
        category: "Rooms",
        maxGuests: Number(form.numGuests), 
        petsAllowed: Boolean(form.petsAllowed) 
      };

      const response = await fetch("/api/auth/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem("rentit_listing_draft");
        setIsSubmitted(true);
        
        // Capture newly created product ID properly from the response shape (result.data.id or direct property)[cite: 2]
        const newId = result?.data?.id || result.id || result.productId || result._id || result.insertedId;
        if (newId) {
          setCreatedProductId(newId);
        }
      } else {
        console.error("Failed to save room listing", result);
        setErrorMessage(result?.error || "Failed to save room listing");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong.");
    }
  };

  // Auto-save draft effect with QuotaExceededError protection
  useEffect(() => {
    const timer = setTimeout(() => {
      setSavingDraft(true);
      try {
        localStorage.setItem("rentit_listing_draft", JSON.stringify(form));
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (error) {
        console.warn("Storage quota exceeded when saving draft (likely due to large base64 images).", error);
      } finally {
        setSavingDraft(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [form]);

  const updateField = (field: keyof ListingFormState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
    if (errorMessage) setErrorMessage(null);
  };

  const updateAmenity = (key: keyof ListingFormState["amenities"], val: boolean) => {
    setForm(prev => ({ ...prev, amenities: { ...prev.amenities, [key]: val } }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const readers = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((images) => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, ...images]
        }));
        if (errors.images) setErrors(prev => ({ ...prev, images: false }));
      });
    }

    e.target.value = "";
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, boolean> = {};

    if (currentStep === 1) {
      if (!form.propertyType) newErrors.propertyType = true;
      if (!form.productName.trim()) newErrors.productName = true;
      if (!form.numGuests || form.numGuests < 1) newErrors.numGuests = true;
      if (!form.bedType) newErrors.bedType = true;
    } else if (currentStep === 2) {
      if (!form.country.trim()) newErrors.country = true;
      if (!form.state.trim()) newErrors.state = true;
      if (!form.city.trim()) newErrors.city = true;
      if (!form.postalCode.trim()) newErrors.postalCode = true;
      if (!form.streetName.trim()) newErrors.streetName = true;
      if (!form.houseNumber.trim()) newErrors.houseNumber = true;
    } else if (currentStep === 3) {
      if (!form.dailyPrice || Number(form.dailyPrice) <= 0) newErrors.dailyPrice = true;
    } else if (currentStep === 5) {
      if (form.images.length === 0) newErrors.images = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Please fill out all required highlighted fields correctly.");
      return false;
    }

    setErrors({});
    setErrorMessage(null);
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrors({});
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#0F172A]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel max-w-xl w-full p-10 rounded-3xl text-center shadow-2xl border border-gray-200/80"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight mb-2">
              Property Listed Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-8">
              Your room is now live and indexed with backend filter parameters (`numGuests: {form.numGuests}`, `petsAllowed: {form.petsAllowed ? "Yes" : "No"}`). Verified guests can now discover and book your space.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 text-left flex items-center gap-4 shadow-sm">
              <img 
                src={form.images[form.primaryImageIndex] || form.images[0]} 
                alt={form.productName} 
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#2563EB] text-xs font-semibold rounded-full mb-1">
                  {form.propertyType || "Private Room"}
                </span>
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                  {form.productName || "Cozy Modern Room in City Center"}
                </h3>
                <p className="text-sm font-bold text-[#2563EB] mt-1">
                  ₹{form.dailyPrice || "850"} <span className="text-xs text-gray-500 font-normal">/ night</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  if (
                    createdProductId && 
                    createdProductId !== "null" && 
                    createdProductId !== "undefined"
                  ) {
                    router.push(`/listings/${createdProductId}`);
                  } else {
                    router.push(`/listings`);
                  }
                }}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-semibold shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
              >
                View Listing
              </button>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setCreatedProductId(null);
                  setCurrentStep(1);
                  setForm(prev => ({ ...prev, productName: "" }));
                }}
                className="flex-1 py-3.5 px-6 rounded-2xl border border-gray-200 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-all cursor-pointer"
              >
                List Another Property
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
              Host Experience • Under 2 Minutes
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 tracking-tight mt-2">
              List Your Room & Earn
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              {savingDraft ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                  Saving draft...
                </>
              ) : lastSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Draft saved at {lastSaved}
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-gray-400" />
                  Auto-saving enabled
                </>
              )}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{errorMessage}</span>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-4 mb-8 shadow-xs border border-gray-200/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {[
              { num: 1, label: "Basic Info" },
              { num: 2, label: "Location" },
              { num: 3, label: "Pricing" },
              { num: 4, label: "Availability" },
              { num: 5, label: "Amenities & Photos" },
              { num: 6, label: "Rules & Preview" },
            ].map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div 
                  key={step.num} 
                  onClick={() => {
                    if (step.num < currentStep) {
                      setCurrentStep(step.num);
                    } else if (step.num > currentStep && validateCurrentStep()) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-xl transition-all ${
                    step.num < currentStep ? "cursor-pointer hover:bg-gray-100/60" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                      : isCurrent 
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105 ring-4 ring-blue-100" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Step 0{step.num}</span>
                    <span className={`text-xs font-bold block ${isCurrent ? "text-gray-900" : "text-gray-600"}`}>
                      {step.label}
                    </span>
                  </div>
                  {step.num < 6 && <div className="h-px bg-gray-200 flex-1 ml-2 hidden xl:block" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/80">
              
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">Basic Property Information</h2>
                      <p className="text-sm text-gray-500 mt-1">Provide clear details so guests know exactly what kind of space they are booking.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-800 mb-2">Property Type *</label>
                        <div 
                          onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs cursor-pointer flex items-center justify-between select-none transition-all border ${
                            errors.propertyType ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {form.propertyType === "Apartment" && <Building2 className="w-4 h-4 text-[#2563EB]" />}
                            {form.propertyType === "Private Room" && <Home className="w-4 h-4 text-[#2563EB]" />}
                            {form.propertyType === "Shared Room" && <Users className="w-4 h-4 text-[#2563EB]" />}
                            {form.propertyType || "Select property type"}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isPropertyTypeOpen ? "rotate-180 text-[#2563EB]" : ""}`} />
                        </div>
                        {errors.propertyType && <p className="mt-1 text-xs text-red-500 font-semibold">Please select a property type.</p>}

                        <AnimatePresence>
                          {isPropertyTypeOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsPropertyTypeOpen(false)} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20 p-1.5 space-y-1"
                              >
                                {(["Private Room", "Shared Room", "Apartment"] as PropertyType[]).map((type) => (
                                  <div
                                    key={type}
                                    onClick={() => {
                                      updateField("propertyType", type);
                                      setIsPropertyTypeOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                                      form.propertyType === type 
                                        ? "bg-blue-50 text-[#2563EB]" 
                                        : "text-gray-700 hover:bg-gray-100/80"
                                    }`}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      {type === "Apartment" && <Building2 className="w-4 h-4" />}
                                      {type === "Private Room" && <Home className="w-4 h-4" />}
                                      {type === "Shared Room" && <Users className="w-4 h-4" />}
                                      {type}
                                    </span>
                                    {form.propertyType === type && <Check className="w-4 h-4 text-[#2563EB]" />}
                                  </div>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Listing Title *</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Cozy Private Room near City Center & Metro"
                          value={form.productName}
                          onChange={(e) => updateField("productName", e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.productName ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.productName && <p className="mt-1 text-xs text-red-500 font-semibold">Please enter a listing title.</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-2">Description & Highlights</label>
                        <textarea 
                          rows={4}
                          placeholder="Describe the space, neighborhood vibe, accessibility, and what guests love about staying here..."
                          value={form.description}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-gray-900 text-sm shadow-xs resize-none"
                        />
                      </div>

                      {/* Filter-ready backend field: Max Guests Accommodated */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Max Guests Accommodated *</label>
                        <input 
                          type="number" 
                          min="1"
                          value={form.numGuests}
                          onChange={(e) => updateField("numGuests", parseInt(e.target.value) || 1)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.numGuests ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.numGuests && <p className="mt-1 text-xs text-red-500 font-semibold">Please specify a valid guest count.</p>}
                      </div>

                      <div className="relative" ref={bedRef}>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Bed Type *</label>
                        <div 
                          onClick={() => setIsBedTypeOpen(!isBedTypeOpen)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs cursor-pointer flex items-center justify-between select-none transition-all border ${
                            errors.bedType ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <BedDouble className="w-4 h-4 text-[#2563EB]" />
                            {form.bedType || "Select bed type"}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isBedTypeOpen ? "rotate-180 text-[#2563EB]" : ""}`} />
                        </div>
                        {errors.bedType && <p className="mt-1 text-xs text-red-500 font-semibold">Please select a bed type.</p>}

                        <AnimatePresence>
                          {isBedTypeOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsBedTypeOpen(false)} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20 p-1.5 space-y-1"
                              >
                                {(["Sofa", "Ground", "Separate Bed", "Shared Bed"] as BedType[]).map((type) => (
                                  <div
                                    key={type}
                                    onClick={() => {
                                      updateField("bedType", type);
                                      setIsBedTypeOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                                      form.bedType === type 
                                        ? "bg-blue-50 text-[#2563EB]" 
                                        : "text-gray-700 hover:bg-gray-100/80"
                                    }`}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      <BedDouble className="w-4 h-4" />
                                      {type}
                                    </span>
                                    {form.bedType === type && <Check className="w-4 h-4 text-[#2563EB]" />}
                                  </div>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">Property Location</h2>
                      <p className="text-sm text-gray-500 mt-1">Exact address is only shared with confirmed guests after booking.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Country</label>
                        <div className="w-full px-4 py-3 rounded-2xl bg-gray-100/80 border border-gray-200 font-medium text-gray-700 text-sm shadow-xs flex items-center justify-between select-none cursor-not-allowed">
                          <span className="flex items-center gap-2">
                            🇩🇪 Germany
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> Fixed
                          </span>
                        </div>
                      </div>

                      <div className="relative" ref={stateRef}>
                        <label className="block text-sm font-bold text-gray-800 mb-2">State / Region (Bundesland) *</label>
                        <div 
                          onClick={() => setIsStateOpen(!isStateOpen)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs cursor-pointer flex items-center justify-between select-none transition-all border ${
                            errors.state ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#2563EB]" />
                            {form.state || "Select German state"}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStateOpen ? "rotate-180 text-[#2563EB]" : ""}`} />
                        </div>
                        {errors.state && <p className="mt-1 text-xs text-red-500 font-semibold">Please select a state.</p>}

                        <AnimatePresence>
                          {isStateOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsStateOpen(false)} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-y-auto max-h-64 z-20 p-1.5 space-y-1"
                              >
                                {GERMAN_STATES.map((stateName) => (
                                  <div
                                    key={stateName}
                                    onClick={() => {
                                      updateField("state", stateName);
                                      setIsStateOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                                      form.state === stateName 
                                        ? "bg-blue-50 text-[#2563EB]" 
                                        : "text-gray-700 hover:bg-gray-100/80"
                                    }`}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      {stateName}
                                    </span>
                                    {form.state === stateName && <Check className="w-4 h-4 text-[#2563EB]" />}
                                  </div>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">City *</label>
                        <input 
                          type="text" 
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.city ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-500 font-semibold">Required</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Postal Code *</label>
                        <input 
                          type="text" 
                          value={form.postalCode}
                          onChange={(e) => updateField("postalCode", e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.postalCode ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.postalCode && <p className="mt-1 text-xs text-red-500 font-semibold">Required</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Street Name *</label>
                        <input 
                          type="text" 
                          value={form.streetName}
                          onChange={(e) => updateField("streetName", e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.streetName ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.streetName && <p className="mt-1 text-xs text-red-500 font-semibold">Required</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">House Number *</label>
                        <input 
                          type="text" 
                          value={form.houseNumber}
                          onChange={(e) => updateField("houseNumber", e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs border ${
                            errors.houseNumber ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                          }`}
                        />
                        {errors.houseNumber && <p className="mt-1 text-xs text-red-500 font-semibold">Required</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">Set Your Pricing</h2>
                      <p className="text-sm text-gray-500 mt-1">Configure nightly rates and deposit requirements for your room.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Price per Night (₹) *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                          <input 
                            type="number" 
                            value={form.dailyPrice}
                            onChange={(e) => updateField("dailyPrice", e.target.value)}
                            className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-bold text-gray-900 text-sm shadow-xs border ${
                              errors.dailyPrice ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-[#2563EB]"
                            }`}
                          />
                        </div>
                        {errors.dailyPrice && <p className="mt-1 text-xs text-red-500 font-semibold">Please enter a valid price per night.</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Security Deposit (₹)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                          <input 
                            type="number" 
                            value={form.securityDeposit}
                            onChange={(e) => updateField("securityDeposit", e.target.value)}
                            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-bold text-gray-900 text-sm shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">Availability & Stay Duration</h2>
                      <p className="text-sm text-gray-500 mt-1">Set date ranges and stay limits for guests booking your room.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[6px] rounded-2xl">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md">
                            Coming Soon
                          </span>
                        </div>
                        <div className="filter blur-[6px] select-none pointer-events-none">
                          <label className="block text-sm font-bold text-gray-800 mb-2">Available From *</label>
                          <input 
                            type="date" 
                            value={form.availableFrom}
                            onChange={(e) => updateField("availableFrom", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[6px] rounded-2xl">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md">
                            Coming Soon
                          </span>
                        </div>
                        <div className="filter blur-[6px] select-none pointer-events-none">
                          <label className="block text-sm font-bold text-gray-800 mb-2">Available To *</label>
                          <input 
                            type="date" 
                            value={form.availableTo}
                            onChange={(e) => updateField("availableTo", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[6px] rounded-2xl">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md">
                            Coming Soon
                          </span>
                        </div>
                        <div className="filter blur-[6px] select-none pointer-events-none">
                          <label className="block text-sm font-bold text-gray-800 mb-2">Minimum Stay *</label>
                          <input 
                            type="text" 
                            value={form.minStay}
                            onChange={(e) => updateField("minStay", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[6px] rounded-2xl">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md">
                            Coming Soon
                          </span>
                        </div>
                        <div className="filter blur-[6px] select-none pointer-events-none">
                          <label className="block text-sm font-bold text-gray-800 mb-2">Maximum Stay *</label>
                          <input 
                            type="text" 
                            value={form.maxStay}
                            onChange={(e) => updateField("maxStay", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div 
                    key="step5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">Amenities & Photos</h2>
                      <p className="text-sm text-gray-500 mt-1">Select available room features and upload crisp photos of your space.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-800 mb-3">Room Amenities</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(form.amenities).map(([key, val]) => (
                          <label key={key} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:border-blue-300 transition-all">
                            <input 
                              type="checkbox" 
                              checked={val}
                              onChange={(e) => updateAmenity(key as keyof ListingFormState["amenities"], e.target.checked)}
                              className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold capitalize text-gray-800">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <label className={`border-2 border-dashed bg-gray-50/50 rounded-3xl p-6 text-center transition-all cursor-pointer block ${
                        errors.images ? "border-red-500 bg-red-50/30" : "border-gray-300 hover:border-[#2563EB]"
                      }`}>
                        <div className="w-12 h-12 bg-blue-100 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Drag & drop room photos here, or browse</h3>
                        <p className="text-xs text-gray-500 mt-0.5">PNG, JPG or WEBP (Max 10 images)</p>
                        <span className="mt-4 inline-block px-5 py-2 rounded-xl bg-white border border-gray-200 font-semibold text-xs text-gray-800 shadow-sm hover:bg-gray-50 transition-all">
                          Browse Files
                        </span>
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {errors.images && <p className="mt-1 text-xs text-red-500 font-semibold text-center">Please upload at least one image of your space.</p>}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {form.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                            <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === form.primaryImageIndex && (
                              <span className="absolute top-2 left-2 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                Cover
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                              <button 
                                title="Set as Primary"
                                onClick={() => updateField("primaryImageIndex", idx)}
                                className={`p-2 rounded-xl text-white transition-all ${idx === form.primaryImageIndex ? 'bg-blue-600' : 'bg-black/60 hover:bg-black'}`}
                              >
                                <Star className="w-4 h-4 fill-current" />
                              </button>
                              <button 
                                title="Delete Image"
                                onClick={() => {
                                  const updated = form.images.filter((_, i) => i !== idx);
                                  updateField("images", updated);
                                  if (form.primaryImageIndex >= updated.length) {
                                    updateField("primaryImageIndex", 0);
                                  }
                                }}
                                className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div 
                    key="step6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold font-heading text-gray-900">House Rules & Preview</h2>
                      <p className="text-sm text-gray-500 mt-1">Set guidelines for guests and review your final listing card.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Check-in Time</label>
                        <input 
                          type="text" 
                          value={form.checkInTime}
                          onChange={(e) => updateField("checkInTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-gray-900 text-sm shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Check-out Time</label>
                        <input 
                          type="text" 
                          value={form.checkOutTime}
                          onChange={(e) => updateField("checkOutTime", e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-gray-900 text-sm shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Quiet Hours</label>
                        <input 
                          type="text" 
                          value={form.quietHours}
                          onChange={(e) => updateField("quietHours", e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-gray-900 text-sm shadow-xs"
                        />
                      </div>

                      {/* Filter-ready backend field: Pets Allowed (Yes/No Custom UI Dropdown) */}
                      <div className="relative" ref={petsRef}>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Pets Allowed (Filter Ready) *</label>
                        <div 
                          onClick={() => setIsPetsAllowedOpen(!isPetsAllowedOpen)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/80 focus:outline-none font-medium text-gray-900 text-sm shadow-xs cursor-pointer flex items-center justify-between select-none transition-all border border-gray-200 hover:border-blue-300"
                        >
                          <span className="flex items-center gap-2">
                            🐾 {form.petsAllowed ? "Yes (Allowed)" : "No (Not Allowed)"}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isPetsAllowedOpen ? "rotate-180 text-[#2563EB]" : ""}`} />
                        </div>

                        <AnimatePresence>
                          {isPetsAllowedOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsPetsAllowedOpen(false)} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20 p-1.5 space-y-1"
                              >
                                {[
                                  { label: "Yes (Allowed)", value: true },
                                  { label: "No (Not Allowed)", value: false }
                                ].map((option) => (
                                  <div
                                    key={String(option.value)}
                                    onClick={() => {
                                      updateField("petsAllowed", option.value);
                                      setIsPetsAllowedOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                                      form.petsAllowed === option.value 
                                        ? "bg-blue-50 text-[#2563EB]" 
                                        : "text-gray-700 hover:bg-gray-100/80"
                                    }`}
                                  >
                                    <span>{option.label}</span>
                                    {form.petsAllowed === option.value && <Check className="w-4 h-4 text-[#2563EB]" />}
                                  </div>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-2 gap-3 pt-2">
                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:border-blue-300 transition-all">
                          <input 
                            type="checkbox" 
                            checked={form.smokingAllowed}
                            onChange={(e) => updateField("smokingAllowed", e.target.checked)}
                            className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
                          />
                          <span className="text-xs font-semibold text-gray-800">Smoking Allowed</span>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:border-blue-300 transition-all">
                          <input 
                            type="checkbox" 
                            checked={form.visitorsAllowed}
                            onChange={(e) => updateField("visitorsAllowed", e.target.checked)}
                            className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
                          />
                          <span className="text-xs font-semibold text-gray-800">Visitors Allowed</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img 
                          src={form.images[form.primaryImageIndex] || form.images[0]} 
                          alt="Listing preview" 
                          className="w-full h-64 object-cover rounded-2xl border border-gray-100"
                        />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full">
                              {form.propertyType || "Private Room"}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5" /> Trusted Host
                            </span>
                          </div>
                          <h3 className="text-xl font-extrabold text-gray-900 font-heading">
                            {form.productName || "Cozy Modern Room in City Center"}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-3">
                            {form.description || "Comfortable space equipped with high-speed Wi-Fi, convenient access to public transit, and prime neighborhood amenities."}
                          </p>
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-extrabold text-[#2563EB]">₹{form.dailyPrice || "850"}</span>
                              <span className="text-xs text-gray-500 font-medium"> / night</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 block">Security Deposit</span>
                              <span className="text-sm font-bold text-gray-900">₹{form.securityDeposit || "2500"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-center">
                        <div className="p-3 bg-gray-50 rounded-2xl">
                          <span className="text-xs text-gray-500 block">Max Guests</span>
                          <span className="text-xs font-bold text-gray-900 mt-0.5 block">{form.numGuests} Guest(s)</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-2xl">
                          <span className="text-xs text-gray-500 block">Pets Policy</span>
                          <span className="text-xs font-bold text-gray-900 mt-0.5 block">{form.petsAllowed ? "Pets Yes" : "Pets No"}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-2xl">
                          <span className="text-xs text-gray-500 block">Beds</span>
                          <span className="text-xs font-bold text-gray-900 mt-0.5 block">{form.bedType}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-2xl">
                          <span className="text-xs text-gray-500 block">Check-in</span>
                          <span className="text-xs font-bold text-blue-600 mt-0.5 block">{form.checkInTime}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                    currentStep === 1 
                      ? "opacity-40 cursor-not-allowed text-gray-400 bg-gray-100" 
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  {currentStep < totalSteps ? (
                    <button 
                      onClick={nextStep}
                      className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={publishListing}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:opacity-95 transition-all cursor-pointer scale-105"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Listing Now</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-200/80 sticky top-28">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-bold text-sm text-gray-900">Live Preview</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white mb-4">
                <img 
                  src={form.images[form.primaryImageIndex] || form.images[0]} 
                  alt="Live preview" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                      {form.propertyType || "Private Room"}
                    </span>
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> New Host
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {form.productName || "Your Property Title"}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-extrabold text-[#2563EB]">₹{form.dailyPrice || "0"}</span>
                      <span className="text-[10px] text-gray-500"> / night</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" /> {form.city || "City"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">Secure Payment Release</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Payments are released to the host only after successful OTP verification, adding an extra layer of trust for both guests and hosts.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}