// components/Footer.tsx
"use client";

import Link from "next/link";
import { Zap, ArrowUp } from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-950 text-white pt-16 pb-12 border-t border-gray-800">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-heading">
                Rent<span className="text-[#2563EB]">It</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              India's premier peer-to-peer rental ecosystem connecting verified lenders with trustworthy renters.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><a href="#browse" className="hover:text-white transition">Browse Items</a></li>
              <li><a href="#categories" className="hover:text-white transition">Categories</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How it Works</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Lenders</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><a href="#calculator" className="hover:text-white transition">Income Calculator</a></li>
              <li><a href="#trust-and-safety" className="hover:text-white transition">Protection Guarantee</a></li>
              <li><a href="#faq" className="hover:text-white transition">Lending Rules</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Stay Updated</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 w-full"
              />
              <button className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} RentIt Technologies Inc. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <span>Back to top</span>
            <div className="h-8 w-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
              <ArrowUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};