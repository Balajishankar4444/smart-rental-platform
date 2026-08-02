"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Star, CheckCircle2, ShieldCheck } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";

export const Hero = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="absolute top-1/3 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-[100px]" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-[#2563EB] mb-6 shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>India’s Most Trusted Peer-to-Peer Rental Network</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.08] font-heading"
            >
              Your Things. <br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-emerald-500 bg-clip-text text-transparent">
                Your Income.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-gray-600 sm:text-xl max-w-2xl leading-relaxed"
            >
              Turn your unused camera, gaming console, bike, or drone into a steady passive income stream. Fully insured, instant UPI payouts, and 100% verified renters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <RippleButton className="w-full sm:w-auto gap-3 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25">
                <span>List Your Item</span>
                <ArrowRight className="h-5 w-5" />
              </RippleButton>

              <a
                href="#browse"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[18px] border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Browse Items
              </a>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-gray-200/80 pt-8 w-full"
            >
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-num">₹12Cr+</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Lender Earnings</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-num">50K+</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Verified Users</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-num">1L+</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Items Rented</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-extrabold text-gray-900 font-num">4.9</p>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs font-medium text-gray-500 mt-1">Average Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Right Parallax Hero Canvas */}
          <motion.div
            style={{ y: yParallax }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]"
          >
            <div className="relative w-full max-w-md aspect-4/5 rounded-[32px] overflow-hidden shadow-2xl border border-white/60 bg-white p-3">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000"
                alt="Sony Camera Gear"
                className="w-full h-full object-cover rounded-[24px]"
              />

              {/* Floating Overlay Card 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-6 left-6 glass-panel rounded-[20px] p-3.5 shadow-xl flex items-center gap-3 border border-white/80 max-w-[220px]"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Payout Released</p>
                  <p className="text-sm font-bold text-emerald-600 font-num">+₹3,400 credited</p>
                </div>
              </motion.div>

              {/* Floating Overlay Card 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-6 glass-panel rounded-[20px] p-4 shadow-xl flex items-center gap-3 border border-white/80"
              >
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">₹50,000 Guaranteed</p>
                  <p className="text-xs text-gray-500">Damage Coverage Active</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};