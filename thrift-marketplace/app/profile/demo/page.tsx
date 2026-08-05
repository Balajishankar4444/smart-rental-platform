"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  Heart,
  IndianRupee,
  Package,
  Plus,
  ShoppingBag,
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
  rentalDays,
} from "@/utils/listings";

interface ProfileForm {
  fullName: string;
  phone: string;
  bio: string;
  avatar: string;
  address: string;
  city: string;
  state: string;
}

const EMPTY_FORM: ProfileForm = {
  fullName: "",
  phone: "",
  bio: "",
  avatar: "",
  address: "",
  city: "",
  state: "",
};

const formatDay = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const { incoming, outgoing } = useBookingRequests();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [rentals, setRentals] = useState<ListingSummary[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [error, setError] = useState("");

  // Saved profile fields come from the backend; name/email fall back to the session
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    fetch(`/api/auth/profile?userId=${encodeURIComponent(user.id)}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return;
        const profile = result?.data as Partial<ProfileForm> | null;
        setForm({
          ...EMPTY_FORM,
          fullName: profile?.fullName || user.name || "",
          avatar: profile?.avatar || user.avatar || "",
          phone: profile?.phone || "",
          bio: profile?.bio || "",
          address: profile?.address || "",
          city: profile?.city || "",
          state: profile?.state || "",
        });
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

  const handleChange = (field: keyof ProfileForm, value: string) =>
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
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile");
    } finally {
      setIsSaving(false);
    }
  };

  const earnings = incoming
    .filter((request) => request.status === "paid")
    .reduce((sum, request) => sum + request.totalAmount, 0);
  const spend = outgoing
    .filter((request) => request.status === "paid")
    .reduce((sum, request) => sum + request.totalAmount, 0);
  const pendingForMe = incoming.filter((request) => request.status === "pending").length;

  const recentActivity: BookingRequest[] = [...incoming, ...outgoing]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const stats = [
    { label: "Listings", value: String(listings.length), icon: Package },
    { label: "Items you rent", value: String(rentals.length), icon: ShoppingBag },
    { label: "Earned", value: `₹${earnings.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Spent", value: `₹${spend.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Your profile</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Details renters and owners see, plus a summary of your rental activity.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-4"
            >
              <stat.icon className="w-4 h-4 text-blue-600" />
              <p className="text-lg font-bold mt-2">{stat.value}</p>
              <p className="text-[11px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.fullName}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold">{form.fullName || user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Full name
              </span>
              <input
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Phone
              </span>
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Pickup address
              </span>
              <input
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                placeholder="Where renters collect your items"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                City
              </span>
              <input
                value={form.city}
                onChange={(event) => handleChange("city", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                State
              </span>
              <input
                value={form.state}
                onChange={(event) => handleChange("state", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                About you
              </span>
              <textarea
                value={form.bio}
                onChange={(event) => handleChange("bio", event.target.value)}
                rows={3}
                placeholder="A line or two about the gear you share"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </label>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>

            {savedAt > 0 && !isSaving && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Rental activity</h2>
              <Link
                href="/dashboard/view-booking?tab=notifications"
                className="text-[11px] font-semibold text-blue-600"
              >
                {pendingForMe > 0 ? `${pendingForMe} to review` : "View all"}
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
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

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Your items</h2>
              <Link
                href="/dashboard/view-booking"
                className="text-[11px] font-semibold text-blue-600"
              >
                Manage
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-500">You have not listed anything yet.</p>
                <Link
                  href="/list-item"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"
                >
                  <Plus className="w-3.5 h-3.5" /> List an item
                </Link>
              </div>
            ) : (
              listings.slice(0, 5).map((listing) => (
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
                      {listing.rental ? ` · ${rentalDays(listing.rental)} day booking` : ""}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                    {LISTING_STATUS_LABELS[listing.status]}
                  </span>
                </div>
              ))
            )}

            <Link
              href="/saved"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 pt-1"
            >
              <Heart className="w-3.5 h-3.5" /> Your favorites
            </Link>
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
