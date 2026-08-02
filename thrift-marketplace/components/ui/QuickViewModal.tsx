"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { RippleButton } from "./RippleButton";

export interface ItemDetail {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  marketValue: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  owner: string;
  ownerBadge: string;
  ownerImage: string;
  image: string;
  verified: boolean;
}

interface QuickViewModalProps {
  item: ItemDetail | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl z-10 border border-gray-100"
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Market Value: {item.marketValue}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-[#2563EB] uppercase tracking-wider">{item.category}</span>
                    <div className="flex items-center gap-1 font-num text-gray-900 font-bold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-gray-400">({item.reviews} reviews)</span>
                    </div>
                  </div>

                  <h2 id="modal-title" className="text-2xl font-extrabold text-gray-900 font-heading leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>{item.location} • {item.distance}</span>
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-[#2563EB] shrink-0" />
                    <p className="text-xs text-blue-900 font-medium">
                      Backed by RentIt Guarantee up to ₹50,000 for loss or structural damage.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-gray-900 font-num">₹{item.pricePerDay}</span>
                    <span className="text-xs text-gray-400 font-medium"> / day</span>
                  </div>
                  <RippleButton className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                    Proceed to Booking
                  </RippleButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};