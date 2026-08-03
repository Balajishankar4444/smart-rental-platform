"use client";

import { useState, FormEvent } from "react";
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
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Building,
  Calendar,
  Package,
  AlertCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"borrower" | "lender" | "both">("both");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string>("");

  // Age validation state
  const isUnderage = age !== "" && parseInt(age, 10) < 18;

  // Handle Form Submission & Redirect
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUnderage) return;

    // Log the user in via AuthContext
    const targetEmail = email || "user@example.com";
    const targetName = fullName || "New User";
    login(targetEmail, targetName);

    // Navigate to onboarding
    router.push("/onboarding");
  };

  const handleGoogleSignup = () => {
    login("google.user@example.com", "Google User");
    router.push("/onboarding");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-950 overflow-hidden font-sans pb-12">
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
      <section className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-6 pt-4 lg:grid-cols-[1fr_1.1fr] lg:px-12">
        {/* Left Content (Desktop) */}
        <div className="hidden lg:block sticky top-8 pt-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-[#2563EB] font-heading">
            <Sparkles className="h-4 w-4" />
            Join India&apos;s trusted peer-to-peer rental marketplace
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 font-heading">
            Start borrowing & lending on Rent<span className="text-[#2563EB]">It</span>.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-7 text-slate-600">
            Set up your rental profile to discover nearby tools, cameras, and gear—or monetize your idle equipment with guaranteed security.
          </p>

          <div className="mt-8 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950 font-heading">Verified Community</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Simple profile checks and local rating system.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950 font-heading">Rental Protection</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Escrow payouts and security deposits for lenders.</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-indigo-600" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-sky-400 to-sky-600" />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Trusted by thousands of renters & lenders nationwide
            </p>
          </div>
        </div>

        {/* Signup Card (Right) */}
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="rounded-[1.6rem] border border-slate-100 bg-white p-6 sm:p-8">
              
              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] font-heading">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Quick Account Setup
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 font-heading">
                  Create your account
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 font-medium">
                  Provide your profile details to start renting or listing items near you.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Role Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                    I want to:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType("borrower")}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition cursor-pointer font-heading ${
                        accountType === "borrower"
                          ? "border-[#2563EB] bg-blue-50/50 text-[#2563EB] shadow-sm"
                          : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Package className="h-4 w-4 mb-1" />
                      Rent Items
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType("lender")}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition cursor-pointer font-heading ${
                        accountType === "lender"
                          ? "border-[#2563EB] bg-blue-50/50 text-[#2563EB] shadow-sm"
                          : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Building className="h-4 w-4 mb-1" />
                      Lend Items
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType("both")}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition cursor-pointer font-heading ${
                        accountType === "both"
                          ? "border-[#2563EB] bg-blue-50/50 text-[#2563EB] shadow-sm"
                          : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Zap className="h-4 w-4 mb-1" />
                      Both
                    </button>
                  </div>
                </div>

                {/* Name & Age Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* Age Field with Live Underage Warning */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isUnderage ? "text-rose-500" : "text-slate-400"}`} />
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 24"
                        className={`h-12 w-full rounded-2xl border ${
                          isUnderage
                            ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 bg-slate-50 text-slate-900 focus:border-[#2563EB] focus:bg-white focus:ring-blue-500/10"
                        } pl-11 pr-4 text-xs font-semibold outline-none transition placeholder:text-slate-400 focus:ring-4`}
                      />
                    </div>
                  </div>
                </div>

                {/* Underage Warning Message */}
                {isUnderage && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>You must be at least 18 years old to rent or lend items on RentIt.</span>
                  </div>
                )}

                {/* Contact: Phone & Email Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      City / Area
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indiranagar, Bengaluru"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="560038"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create password (min 8 characters)"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    required
                    id="terms"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <label htmlFor="terms" className="text-xs font-medium text-slate-600 leading-tight">
                    I agree to RentIt&apos;s{" "}
                    <Link href="/terms" className="text-[#2563EB] font-bold hover:underline font-heading">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link href="/rental-policy" className="text-[#2563EB] font-bold hover:underline font-heading">
                      Rental Policy
                    </Link>{" "}
                    & Privacy Rules.
                  </label>
                </div>

                {/* Submit Button (Disabled when underage) */}
                <button
                  type="submit"
                  disabled={isUnderage}
                  className={`group flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-xl transition duration-300 font-heading tracking-wide mt-2 ${
                    isUnderage
                      ? "bg-slate-300 shadow-none cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer"
                  }`}
                >
                  Create Account
                  <span className={`transition-transform duration-300 ${!isUnderage && "group-hover:translate-x-1"}`}>
                    →
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Secondary action */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] cursor-pointer font-heading tracking-wide"
              >
                Sign up with Google
              </button>

              <p className="mt-5 text-center text-xs font-semibold text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#2563EB] hover:underline font-heading"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom trust line */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
            Your sensitive data is encrypted & stored securely
          </div>
        </div>
      </section>
    </main>
  );
}