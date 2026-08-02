"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Freelance Photographer",
    text: "Listing my secondary camera body on RentIt pays my monthly studio rent effortlessly. Payouts arrive in under 2 hours directly via UPI!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Vikramaditya Roy",
    role: "PS5 Lender",
    text: "I was hesitant at first about letting strangers use my PS5, but the ₹50,000 protection guarantee and Aadhaar verification gave me complete peace of mind.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
];

export const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="py-20 bg-white border-t border-gray-200/80">
      <div className="mx-auto max-w-[1000px] px-6 text-center">
        <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Community Feedback</span>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">Trusted by 50,000+ Lenders & Renters</h2>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative mt-12 p-8 md:p-12 rounded-[32px] bg-[#FAFAFA] border border-gray-200/80 shadow-2xs"
        >
          <Quote className="h-10 w-10 text-blue-200 mx-auto mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <p className="text-lg md:text-xl font-medium text-gray-800 italic max-w-2xl leading-relaxed">
                "{REVIEWS[current].text}"
              </p>

              <div className="flex items-center gap-1 my-4">
                {[...Array(REVIEWS[current].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <img
                src={REVIEWS[current].avatar}
                alt={REVIEWS[current].name}
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md mb-2"
              />
              <h4 className="text-base font-bold text-gray-900">{REVIEWS[current].name}</h4>
              <p className="text-xs text-gray-500">{REVIEWS[current].role}</p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setCurrent((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1))}
              aria-label="Previous testimonial"
              className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % REVIEWS.length)}
              aria-label="Next testimonial"
              className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};