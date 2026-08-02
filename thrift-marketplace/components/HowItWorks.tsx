// components/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Browse & Request",
    description: "Explore thousands of verified items nearby, select your dates, and send a booking request.",
    icon: Search,
  },
  {
    step: "02",
    title: "Verify & Pay",
    description: "Complete quick Aadhaar verification and pay securely. Funds are held in escrow for safety.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Use & Return",
    description: "Pick up the item or get it delivered, enjoy your usage, and return it safely to the owner.",
    icon: CheckCircle2,
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12 bg-gray-50/50 border-y border-gray-200/80" id="how-it-works">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Simple Process</span>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">
          How RentIt Works
        </h2>
        <p className="text-gray-500 text-sm mt-3">
          Renting or listing items takes less than 2 minutes. Here is how you can get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.15 }}
              className="relative p-8 rounded-[28px] bg-white border border-gray-200/80 shadow-2xs hover:shadow-xl transition-all flex flex-col items-start"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-3xl font-black text-gray-200 font-num">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};