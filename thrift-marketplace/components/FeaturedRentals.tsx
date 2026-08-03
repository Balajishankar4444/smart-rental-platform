"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Eye } from "lucide-react";
import { QuickViewModal, ItemDetail } from "./ui/QuickViewModal";

const FEATURED_ITEMS: ItemDetail[] = [
  {
    id: "1",
    title: "Sony Alpha a7 IV + 24-70mm f/2.8 GM Lens",
    category: "Photography",
    pricePerDay: 1850,
    marketValue: "₹2,40,000",
    rating: 4.96,
    reviews: 42,
    location: "Indiranagar, Bengaluru",
    distance: "2.4 km away",
    owner: "Rohan V.",
    ownerBadge: "Super Lender",
    ownerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "2",
    title: "Sony PlayStation 5 Disc Edition + 2 Controllers",
    category: "Gaming",
    pricePerDay: 690,
    marketValue: "₹54,990",
    rating: 4.98,
    reviews: 89,
    location: "Koramangala, Bengaluru",
    distance: "1.1 km away",
    owner: "Priya S.",
    ownerBadge: "Top Rated",
    ownerImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "3",
    title: "DJI Mini 3 Pro Fly More Combo (4K HDR)",
    category: "Drones",
    pricePerDay: 1450,
    marketValue: "₹89,000",
    rating: 4.92,
    reviews: 31,
    location: "Bandra West, Mumbai",
    distance: "3.8 km away",
    owner: "Aman K.",
    ownerBadge: "Super Lender",
    ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "4",
    title: "Ather 450X Gen 3 Electric Scooter",
    category: "Vehicles",
    pricePerDay: 490,
    marketValue: "₹1,45,000",
    rating: 4.89,
    reviews: 57,
    location: "Connaught Place, New Delhi",
    distance: "0.8 km away",
    owner: "Karan M.",
    ownerBadge: "Verified Pro",
    ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
];

export const FeaturedRentals = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ItemDetail | null>(null);

  const filteredItems =
    activeTab === "all"
      ? FEATURED_ITEMS
      : FEATURED_ITEMS.filter((item) => item.category.toLowerCase() === activeTab);

  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="browse">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Trending Listings Near You</h2>
          <p className="text-gray-500 text-sm mt-2">Verified quality gear backed by 100% buyer protection.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {["all", "photography", "gaming", "drones", "vehicles"].map((tab) => (
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
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-[#2563EB]">{item.category}</span>
                      <div className="flex items-center gap-1 font-num text-gray-900 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-gray-400">({item.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.location} • {item.distance}</span>
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
                    <span className="text-xs text-gray-400 font-medium"> / day</span>
                  </div>
                  <span className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    Quick Rent
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