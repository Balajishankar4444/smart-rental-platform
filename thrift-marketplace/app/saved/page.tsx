"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Search, ShieldCheck, Zap } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useFavorites } from "@/hooks/useFavorites";
import {
  fetchListings,
  listingDailyPrice,
  listingImage,
  listingLocation,
  listingTitle,
  ListingSummary,
  LISTING_STATUS_LABELS,
} from "@/utils/listings";

export default function SavedPage() {
  const { favoriteIds, toggleFavorite, isLoading: isLoadingFavorites, isSignedIn } = useFavorites();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchListings({})
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
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const savedListings = useMemo(
    () =>
      listings
        .filter((item) => favoriteIds.includes(item.id))
        .filter(
          (item) =>
            !query ||
            [listingTitle(item), item.category, item.brand]
              .filter(Boolean)
              .some((field) => field.toLowerCase().includes(query))
        ),
    [listings, favoriteIds, query]
  );

  const isLoading = isLoadingFavorites || isLoadingListings;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" /> Favorites
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Every listing you hearted, saved to your account.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {!isSignedIn ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-sm font-semibold text-slate-900">Sign in to see your favorites</p>
            <Link href="/login" className="mt-2 inline-block text-sm font-semibold text-blue-600">
              Go to login
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : savedListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-sm font-semibold text-slate-900">No favorites yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Tap the heart on any listing and it shows up here.
            </p>
            <Link href="/browse" className="mt-3 inline-block text-sm font-semibold text-blue-600">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Link href={`/listings/${item.id}`}>
                    <img
                      src={listingImage(item)}
                      alt={listingTitle(item)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    aria-label="Remove from favorites"
                    aria-pressed
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>

                  {item.instantBooking && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> Instant Book
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" /> {listingLocation(item)}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {item.category || "General"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {LISTING_STATUS_LABELS[item.status]}
                      </span>
                    </div>

                    <Link
                      href={`/listings/${item.id}`}
                      className="block font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition-colors"
                    >
                      {listingTitle(item)}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-black text-slate-900">
                        ₹{listingDailyPrice(item)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium"> / day</span>
                    </div>
                    <Link
                      href={`/listings/${item.id}`}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
