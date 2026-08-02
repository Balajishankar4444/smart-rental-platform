"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Menu, X } from "lucide-react";
import { RippleButton } from "./ui/RippleButton";

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "Browse", href: "#browse" },
  { name: "Categories", href: "#categories" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Become a Lender", href: "#calculator" },
  { name: "Trust & Safety", href: "#trust-and-safety" },
  { name: "Contact", href: "#faq" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-panel border-b border-gray-200/80 py-3 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Animated Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
            >
              <Zap className="h-5 w-5 fill-current" />
            </motion.div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(link.name)}
                  className={`relative text-sm font-semibold transition-colors duration-200 ${
                    isActive ? "text-[#2563EB]" : "text-gray-600 hover:text-[#2563EB]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#2563EB]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-semibold text-gray-700 hover:text-[#2563EB] sm:block cursor-pointer">
              Log In
            </button>
            <RippleButton className="hidden sm:inline-flex gap-2 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25">
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Start Earning</span>
            </RippleButton>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 lg:hidden focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-white/95 backdrop-blur-xl px-6 pt-28 pb-10 lg:hidden"
          >
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className="text-2xl font-bold text-gray-900 hover:text-[#2563EB] transition-colors font-heading"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
              <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800">
                Log In
              </button>
              <RippleButton className="w-full py-3.5 rounded-2xl bg-[#2563EB] text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                Start Earning
              </RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};