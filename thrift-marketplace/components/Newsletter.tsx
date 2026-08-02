"use client";

import { useState } from "react";
import { RippleButton } from "./ui/RippleButton";
import { CheckCircle2 } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="py-16 bg-gray-900 text-white text-center px-6">
      <div className="max-w-xl mx-auto">
        <h3 className="text-2xl font-bold font-heading">Get Exclusive Rental Offers</h3>
        <p className="text-sm text-gray-400 mt-2">Join our community of over 50,000 members and never miss a deal.</p>
        
        {success ? (
          <div className="mt-6 inline-flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-950/50 px-4 py-2 rounded-xl border border-emerald-800">
            <CheckCircle2 className="h-5 w-5" /> You are successfully subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <RippleButton isLoading={loading} className="px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold">
              Subscribe
            </RippleButton>
          </form>
        )}
        {error && <p className="text-xs text-red-400 mt-2 text-left">{error}</p>}
      </div>
    </div>
  );
};