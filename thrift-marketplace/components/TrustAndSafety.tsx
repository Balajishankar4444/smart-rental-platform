// components/TrustAndSafety.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle2, Headphones, Star, KeyRound } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Transactions and deposits are held securely and handled via trusted gateways.",
  },
  {
    icon: KeyRound,
    title: "OTP Check-in",
    description: "Secure digital check-in process at the door using unique verification codes.",
  },
  {
    icon: Star,
    title: "Easy Booking Management",
    description: "Manage listings, booking requests, and payments from one simple dashboard.",
  },
  {
  icon: Headphones,
  title: "Help When You Need It",
  description: "Get assistance with your rentals, listings, and booking process whenever you need support.",
},
];

export const TrustAndSafety = () => {
  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="trust-and-safety">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Safety First</span>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">
          Protected Every Step of the Way
        </h2>
        <p className="text-gray-500 text-sm mt-3">
          We combine advanced identity verification with secure booking processes to make short-term room stays completely worry-free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRUST_FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="p-8 rounded-[24px] bg-white border border-gray-200/80 shadow-2xs hover:shadow-xl transition-all flex flex-col items-start"
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};