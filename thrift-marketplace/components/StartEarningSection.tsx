"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight, CheckCircle2, Loader2, PlusCircle, Calculator } from "lucide-react";

export const StartEarningSection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Calculator State
  const [rentalDays, setRentalDays] = useState<number>(10);
  const [avgDailyRate, setAvgDailyRate] = useState<number>(800);

  // Calculate estimated monthly earnings
  const estimatedEarnings = rentalDays * avgDailyRate;

  const handleStartEarning = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevents default anchor/scroll behavior
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // Trigger loading spinner briefly and navigate to the list-item page
    setIsLoading(true);
    setTimeout(() => {
      router.push("/list-item");
    }, 300);
  };

  const earningCards = [
    {
      title: "DSLR Camera",
      category: "Photography",
      earnings: "₹1,200/day",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Mountain Bike",
      category: "Vehicles",
      earnings: "₹700/day",
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "PlayStation 5",
      category: "Gaming",
      earnings: "₹900/day",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleCardClick = (category: string) => {
    router.push(`/browse?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      {/* Hidden anchor target so the navbar "Become a Lender" link scrolls here */}
      <div id="calculator" className="relative -top-24" aria-hidden="true" />

      <section 
        className="relative overflow-hidden py-24 lg:py-32 bg-[#FAFAFA]"
        aria-label="Start Earning Passive Income & Earnings Calculator"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
                <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
                Monetize Your Assets
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight font-heading mb-6">
                Turn Your Unused Items Into <span className="text-[#2563EB]">Monthly Income</span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed font-sans max-w-2xl mx-auto">
                Rent out cameras, bikes, electronics, tools, sports equipment and more safely to verified members of your community.
              </p>
            </motion.div>

            {/* Embedded Earnings Calculator Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 p-6 sm:p-8 rounded-3xl bg-white/90 border border-gray-200/80 shadow-xl shadow-blue-900/5 backdrop-blur-xl text-left"
            >
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm mb-6 uppercase tracking-wider">
                <Calculator className="h-4 w-4" />
                <span>Interactive Earnings Estimator</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span>Days Rented per Month</span>
                      <span className="text-[#2563EB]">{rentalDays} Days</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={rentalDays} 
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span>Expected Daily Price</span>
                      <span className="text-[#2563EB]">₹{avgDailyRate}</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="5000" 
                      step="50"
                      value={avgDailyRate} 
                      onChange={(e) => setAvgDailyRate(Number(e.target.value))}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 text-center flex flex-col justify-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Monthly Potential</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-heading">
                    ₹{estimatedEarnings.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Based on your selection of {rentalDays} days/mo</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.button
                onClick={handleStartEarning}
                disabled={isLoading}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="ripple-container relative group inline-flex items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 cursor-pointer transition-all duration-250 overflow-hidden"
                aria-label="Start Earning - Rent out your unused items and earn passive income"
              >
                {ripples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="ripple-span"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 100,
                      height: 100,
                      marginLeft: -50,
                      marginTop: -50,
                    }}
                  />
                ))}

                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <>
                    <span className="flex flex-col text-left">
                      <span className="text-lg tracking-tight font-heading">List Your Item</span>
                      <span className="text-xs font-normal text-blue-100 opacity-90">Start listing your items right away.</span>
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                      <PlusCircle className="h-5 w-5 stroke-[2.5]" />
                    </div>
                  </>
                )}
              </motion.button>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-semibold text-gray-700"
              >
                {[
                  "Earn up to ₹50,000/month",
                  "List in under 2 minutes",
                  "Secure payments",
                  "Verified renters"
                ].map((text, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="flex items-center justify-center gap-1.5 bg-white/85 px-3 py-2 rounded-xl border border-gray-200/80 shadow-2xs backdrop-blur-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {earningCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleCardClick(card.category)}
                className="glass-panel group relative overflow-hidden rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-200/80 bg-white/85 backdrop-blur-xl cursor-pointer"
              >
                <div className="relative h-52 w-full overflow-hidden rounded-2xl mb-4 bg-gray-100">
                  <motion.img
                    src={card.image}
                    alt={card.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#2563EB] shadow-sm">
                    {card.earnings}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-heading">{card.title}</h3>
                    <p className="text-xs text-gray-500 font-sans">High local demand in your city</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};