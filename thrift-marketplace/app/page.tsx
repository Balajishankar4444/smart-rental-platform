// app/page.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Custom UI Modules (CustomCursor import removed)
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InteractiveSearch } from "@/components/InteractiveSearch";
import { Categories } from "@/components/Categories";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedRentals } from "@/components/FeaturedRentals";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { TrustAndSafety } from "@/components/TrustAndSafety";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111827] selection:bg-blue-600 selection:text-white">
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Site Header */}
      <Navbar />

      {/* Page Sections */}
      <main>
        <Hero />
        <InteractiveSearch />
        <Categories />
        <HowItWorks />
        <FeaturedRentals />
        <EarningsCalculator />
        <TrustAndSafety />
        <Testimonials />
        <FAQ />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}