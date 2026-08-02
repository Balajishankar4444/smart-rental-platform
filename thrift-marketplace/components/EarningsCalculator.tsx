"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";

export const EarningsCalculator = () => {
  const [calcDays, setCalcDays] = useState(10);
  const [calcItemType, setCalcItemType] = useState(1200);

  const monthlyEarnings = calcDays * calcItemType;
  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <section className="py-16 mx-auto max-w-[1440px] px-6 lg:px-12" id="calculator">
      <div className="rounded-[32px] bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white p-8 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Passive Income Estimator</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
              Calculate how much your idle belongings can earn.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-4 leading-relaxed">
              Most electronics, cameras, and leisure gear sit unused 25 days a month. Turn those idle days into guaranteed monthly income.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Select Item Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "DSLR / Camera", yield: 1500 },
                    { label: "PS5 Console", yield: 700 },
                    { label: "4K Drone", yield: 1800 },
                  ].map((type) => (
                    <button
                      key={type.label}
                      onClick={() => setCalcItemType(type.yield)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        calcItemType === type.yield
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
                  <span className="text-gray-300">Days rented per month:</span>
                  <span className="text-blue-400 font-num font-extrabold text-base">{calcDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  aria-label="Days rented per month"
                  className="w-full accent-[#2563EB] bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md rounded-[28px] glass-dark p-8 text-center border border-white/10 shadow-2xl">
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

              <RippleButton className="mt-8 w-full gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30">
                <span>Become a Lender Now</span>
                <ArrowRight className="h-5 w-5" />
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};