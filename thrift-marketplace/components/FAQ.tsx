// components/FAQ.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [  
  { question: "How do I book a room?", answer: "Find a verified room on our browse page, select your check-in and check-out dates, and submit your booking request securely online." },  
  { question: "When does the host receive payment?", answer: "Host payouts are securely processed and released shortly after the guest successfully checks in using the secure verification process." },  
  { question: "How does OTP check-in work?", answer: "Upon arrival, the guest provides the secure OTP received upon booking to the host at the door to verify and log the check-in." },  
  { question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking directly through your dashboard. Review our cancellation policy terms for details on refunds." },  
  { question: "Are hosts verified?", answer: "Yes, all hosts undergo mandatory identity checks and listing verifications to ensure a safe and reliable community experience." },  
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-20 mx-auto max-w-[900px] px-6" id="faq">
      <div className="text-center mb-12">
        <span className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">Got Questions?</span>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mt-2 font-heading">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-sm mt-2">Everything you need to know about booking and hosting safely.</p>
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

export default FAQ;