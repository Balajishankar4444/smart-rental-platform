// thrift-marketplace/components/FeaturedRentals.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Eye, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/app/context/AuthContext";
import { QuickViewModal, ItemDetail } from "./ui/QuickViewModal";
import {
  fetchListings,
  listingDailyPrice,
  listingImage,
  listingLocation,
  listingTitle,
  ListingSummary,
} from "@/utils/listings";

function toItemDetail(listing: ListingSummary): ItemDetail {
  return {
    id: listing.id,
    title: listingTitle(listing),
    category: listing.category || "General",
    pricePerDay: listingDailyPrice(listing),
    marketValue: listing.securityDeposit ? `\u20b9${listing.securityDeposit} deposit` : "No deposit",
    rating: 0,
    reviews: 0,
    location: listingLocation(listing),
    distance: listing.subcategory || "",
    owner: listing.ownerName || "Verified host",
    ownerBadge: listing.instantBooking ? "Instant Booking" : "Request to Book",
    ownerImage: listing.ownerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    image: listingImage(listing),
    verified: Boolean(listing.instantBooking),
  };
}

export const FeaturedRentals = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ItemDetail | null>(null);
  const [items, setItems] = useState<ItemDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    fetchListings({ status: "active", excludeUserId: user?.id })
      .then((listings) => {
        if (!cancelled) setItems(listings.map(toItemDetail));
      })
      .catch((err) => console.error("Failed to load listings", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category.toLowerCase())))];

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.category.toLowerCase() === activeTab);

  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="browse">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Featured Rooms Near You</h2>
          <p className="text-gray-500 text-sm mt-2">Verified quality rooms backed by secure booking and local hosts.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                activeTab === tab
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-gray-900">No active rooms yet</p>
          <p className="mt-1 text-xs text-gray-500">Be the first to list your space for rent.</p>
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(item)}
                className="group rounded-[24px] bg-white border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-gray-300 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick View Button */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-gray-900 shadow-md">
                        <Eye className="h-4 w-4" />
                        Quick View
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                      Value: {item.marketValue}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={isFavorite(item.id)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite(item.id) ? "fill-red-500 text-red-500" : "text-gray-700"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-[#2563EB]">{item.category}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        Available
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{[item.location, item.distance].filter(Boolean).join(" • ")}</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.ownerImage}
                          alt={item.owner}
                          className="h-7 w-7 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-none">{item.owner}</p>
                          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{item.ownerBadge}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-gray-900 font-num">₹{item.pricePerDay}</span>
                    <span className="text-xs text-gray-400 font-medium"> / night</span>
                  </div>
                  <span className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    Book Now
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Quick View Drawer */}
      <QuickViewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default FeaturedRentals;