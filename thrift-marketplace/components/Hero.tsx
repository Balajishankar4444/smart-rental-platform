"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col items-start max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-[#2563EB] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>India’s Most Trusted Peer-to-Peer Rental Network</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.08] font-heading">
            Your Things. <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] bg-clip-text text-transparent">Your Income.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 sm:text-xl leading-relaxed">
            Turn your unused camera, gaming console, bike, or drone into a steady passive income stream. Fully insured, instant UPI payouts.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <RippleButton onClick={() => router.push("/browse")} className="w-full sm:w-auto gap-3 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-base font-semibold text-white shadow-xl">
              <span>Start Renting</span>
              <ArrowRight className="h-5 w-5" />
            </RippleButton>

            <RippleButton onClick={() => router.push("/list-item")} className="w-full sm:w-auto rounded-[18px] border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-2xs hover:bg-gray-50">
              Become a Lender
            </RippleButton>
          </div>
        </div>
      </div>
    </section>
  );
};