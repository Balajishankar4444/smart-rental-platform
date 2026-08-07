// components/StartEarningSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, ShieldCheck, Clock, Award, BedDouble } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";

const earningCards = [
  {
    title: "Spare Bedroom",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
    rate: "₹1,500/night",
  },
  {
    title: "Guest Room",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400",
    rate: "₹1,200/night",
  },
  {
    title: "Studio Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
    rate: "₹2,500/night",
  },
];

export const StartEarningSection = () => {
  const [rentalDays, setRentalDays] = useState(10);
  const [avgDailyRate, setAvgDailyRate] = useState(1500);

  const monthlyEarnings = rentalDays * avgDailyRate;
  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12 bg-white" id="earn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-7">
          <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Host With Us</span>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">
            Earn Extra Income by Hosting Your Space
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
            Whether you have a spare bedroom, guest room, apartment, or weekend availability, you can turn your empty space into reliable monthly income.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Verified guests</h4>
                <p className="text-xs text-gray-500 mt-0.5">Profile checks for everyone.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Flexible Schedule</h4>
                <p className="text-xs text-gray-500 mt-0.5">Host only when it suits you.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Secure Payouts</h4>
                <p className="text-xs text-gray-500 mt-0.5">Reliable digital transfers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4">
          {earningCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`rounded-[24px] overflow-hidden bg-white border border-gray-200/80 shadow-md ${
                idx === 1 ? "translate-y-6" : ""
              }`}
            >
              <div className="h-32 w-full overflow-hidden bg-gray-100">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 text-center">
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{card.title}</p>
                <p className="text-[11px] font-extrabold text-[#2563EB] mt-0.5">{card.rate}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Embedded Calculator */}
      <div className="rounded-[32px] bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white p-8 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Hosting Income Estimator</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Calculate how much your space can earn.
            </h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Estimate your monthly earnings based on your nightly rate and expected booked nights.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Price per Night
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Spare Room", yield: 1000 },
                    { label: "Guest Room", yield: 1500 },
                    { label: "Full Apartment", yield: 2500 },
                  ].map((type) => (
                    <button
                      key={type.label}
                      onClick={() => setAvgDailyRate(type.yield)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        avgDailyRate === type.yield
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-gray-300">Booked Nights:</span>
                  <span className="text-blue-400 font-num font-extrabold text-base">{rentalDays} Nights</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Number(e.target.value))}
                  aria-label="Booked Nights"
                  className="w-full accent-[#2563EB] bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md rounded-[28px] glass-dark p-8 text-center border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Estimated Monthly Earnings
              </span>
              <p className="text-5xl sm:text-6xl font-black text-emerald-400 font-num my-4 tracking-tight">
                ₹{monthlyEarnings.toLocaleString("en-IN")}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                <span>Projected Annual Income:</span>
                <strong className="text-white font-num text-sm">
                  ₹{yearlyEarnings.toLocaleString("en-IN")} / yr
                </strong>
              </div>

              <RippleButton className="mt-8 w-full gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center">
                <span>List Your Space</span>
                <ArrowRight className="h-5 w-5" />
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartEarningSection;