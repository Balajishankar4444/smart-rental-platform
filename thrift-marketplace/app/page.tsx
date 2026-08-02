// app/page.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Custom UI Modules
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

      {/* Page Sections (Ordered to match Navbar) */}
      <main>
        {/* 1. Home / Hero & Search */}
        <Hero />
        <InteractiveSearch />

        {/* 2. Browse Section */}
        <div id="browse">
          <FeaturedRentals />
        </div>

        {/* 3. Categories Section */}
        <div id="categories">
          <Categories />
        </div>

        {/* 4. How it Works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* 5. Become a Lender */}
        <div id="calculator">
          <EarningsCalculator />
        </div>

        {/* 6. Trust & Safety */}
        <div id="trust-and-safety">
          <TrustAndSafety />
        </div>

        {/* 7. Contact / FAQ (and Testimonials) */}
        <div id="faq">
          <Testimonials />
          <FAQ />
        </div>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}