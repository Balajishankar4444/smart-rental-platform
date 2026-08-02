"use client";

import { motion } from "framer-motion";
import { Star, Heart, MapPin, Eye, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FEATURED_PRODUCTS } from "@/utils/constants";
import { useWishlist } from "@/hooks/useWishlist";

export const FeaturedProducts = () => {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12">
      <h2 className="text-3xl font-extrabold text-gray-900 font-heading mb-10">Trending Listings Near You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_PRODUCTS.map((item) => {
          const isFav = wishlist[item.id];
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              onClick={() => router.push(`/product/${item.id}`)}
              className="group rounded-[24px] bg-white border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <button onClick={(e) => toggleWishlist(item.id)} aria-label="Wishlist" className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                    <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                  </button>

                  <button onClick={(e) => handleShare(item.title, e)} aria-label="Share" className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                    <Share2 className="h-4 w-4 text-gray-700" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-[#2563EB] uppercase">{item.category}</span>
                    <div className="flex items-center gap-1 font-bold text-gray-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {item.location}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2.5">
                    <img
                      src={item.owner.image}
                      alt={item.owner.name}
                      onClick={(e) => { e.stopPropagation(); router.push("/profile/demo"); }}
                      className="h-7 w-7 rounded-full object-cover border cursor-pointer hover:opacity-80"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{item.owner.name}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{item.owner.badge}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-900">₹{item.pricePerDay}</span>
                  <span className="text-xs text-gray-400"> / day</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/product/${item.id}`); }} className="px-4 py-2 rounded-xl bg-blue-50 text-[#2563EB] text-xs font-bold hover:bg-[#2563EB] hover:text-white transition">
                  Rent Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};