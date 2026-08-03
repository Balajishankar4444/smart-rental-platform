"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  // Global Auth Context
  const { login } = useAuth();

  // Save auth state & redirect back to intended destination or /onboarding
  const handleLoginSuccess = (submittedEmail?: string) => {
    const targetEmail = submittedEmail || email || "user@example.com";
    login(targetEmail);
    
    // Check if there is a pending redirect (e.g., from the product booking button)
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin"); // Clean up
      router.push(redirectUrl); // Redirect back to product booking / checkout
    } else {
      router.push("/onboarding"); // Default fallback
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-950 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
            <Zap className="h-5 w-5 fill-current" />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
            Rent<span className="text-[#2563EB]">It</span>
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] font-heading"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main Grid Content */}
      <section className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 pt-6">
        {/* Left Content (Desktop) */}
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-[#2563EB] font-heading">
            <Sparkles className="h-4 w-4" />
            India&apos;s trusted peer-to-peer rental marketplace
          </div>

          <h1 className="max-w-2xl text-6xl font-extrabold leading-[0.95] tracking-tight text-slate-950 font-heading">
            Access your Rent<span className="text-[#2563EB]">It</span> portal.
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-600">
            Log in to manage your listings, view incoming booking requests, and track active rentals from one secure dashboard.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold text-slate-950 font-heading">
                Secure Access
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Protected login for renters and lenders.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold text-slate-950 font-heading">
                Verified Rentals
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track bookings, items, and rental activity easily.
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-indigo-600" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-sky-400 to-sky-600" />
            </div>

            <p className="text-sm font-semibold text-slate-600">
              Trusted by thousands of renters and lenders
            </p>
          </div>
        </div>

        {/* Login Card (Right) */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="rounded-[1.6rem] border border-slate-100 bg-white p-8">
              {/* Mobile logo */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-lg shadow-blue-500/25">
                  <Zap className="h-6 w-6 fill-current" />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-heading">
                  Rent<span className="text-[#2563EB]">It</span>
                </h1>
              </div>

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] font-heading">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure login
                </div>

                <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 font-heading">
                  Sign in to Rent<span className="text-[#2563EB]">It</span>
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-500">
                  Enter your credentials to access your dashboard and manage your rentals.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLoginSuccess(email);
                }}
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 font-heading">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700 font-heading">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-[#2563EB] hover:underline font-heading"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-base font-bold text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer font-heading tracking-wide"
                >
                  Log In
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={() => handleLoginSuccess("google.user@example.com")}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-base font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] cursor-pointer font-heading tracking-wide"
              >
                Continue with Google
              </button>

              <p className="mt-7 text-center text-sm font-semibold text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[#2563EB] hover:underline font-heading"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}