// components/FAQ.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How does the ₹50,000 protection guarantee work?",
    answer: "Every rental transaction is covered under our RentIt Shield. If an item is damaged or stolen during the active rental period, our team processes your reimbursement claim within 48 hours after verification.",
  },
  {
    question: "How and when do lenders get paid?",
    answer: "Lender payouts are processed instantly via UPI or bank transfer as soon as the renter picks up or receives the item, minus our small 5% platform service fee.",
  },
  {
    question: "What happens if a renter returns an item late?",
    answer: "Late returns are automatically billed to the renter's saved payment method on a per-day penalty rate (1.5x the standard daily rental rate), which is credited directly to the lender.",
  },
  {
    question: "Do I need to verify my identity to rent or list items?",
    answer: "Yes, for safety and security, all users must complete a quick Aadhaar-based DigiLocker verification or upload valid government-issued ID before renting or lending items.",
  },
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-20 mx-auto max-w-[900px] px-6" id="faq">
      <div className="text-center mb-12">
        <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Got Questions?</span>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-sm mt-2">Everything you need to know about renting and lending safely.</p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-[20px] bg-white border border-gray-200/80 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 hover:text-[#2563EB] transition cursor-pointer"
              >
                <span>{item.question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};