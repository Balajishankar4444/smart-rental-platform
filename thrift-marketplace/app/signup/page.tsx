"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Error States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Store the target page to return to after signup
  const [returnUrl, setReturnUrl] = useState<string>("/");

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      setReturnUrl(redirectParam);
      sessionStorage.setItem("auth_redirect_url", redirectParam);
      return;
    }

    const storedRedirect = sessionStorage.getItem("auth_redirect_url");
    if (storedRedirect) {
      setReturnUrl(storedRedirect);
      return;
    }

    setReturnUrl("/");
  }, [searchParams]);

  // Handle Form Submission: Check if email exists first, then trigger OTP popup if clear
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setOtpErrorMessage(null);
    setIsCheckingEmail(true);

    try {
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const contentType = checkResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const checkResult = await checkResponse.json();
        if (!checkResponse.ok || checkResult.exists) {
          setIsCheckingEmail(false);
          setErrorMessage(checkResult.message || "This email address is already registered.");
          return;
        }
      }
    } catch (err) {
      console.warn("Check-email route bypassed or unavailable:", err);
    }

    setIsCheckingEmail(false);
    setShowOtpModal(true);
  };

  // Handle OTP input changes
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpErrorMessage) setOtpErrorMessage(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation for OTP inputs
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP (Requires '000000'). Clears digit fields on submission, keeps button active.
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setOtpErrorMessage(null);

    const enteredOtpString = otp.join("");
    setOtp(["", "", "", "", "", ""]);

    if (enteredOtpString !== "000000") {
      setOtpErrorMessage("Invalid OTP code.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
        }),
      });

      const contentType = response.headers.get("content-type");
      let result: any = {};
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      setIsVerifying(false);

      if (!response.ok || (result && result.success === false)) {
        setShowOtpModal(false);
        setErrorMessage(result.message || "Registration failed.");
        return;
      }

      setShowOtpModal(false);

      localStorage.setItem("isLogin", "1");
      login(email, fullName);

      const finalDestination = returnUrl;
      sessionStorage.removeItem("auth_redirect_url");
      router.push(finalDestination);
    } catch (err: any) {
      setIsVerifying(false);
      setShowOtpModal(false);
      setErrorMessage(err.message || "An error occurred during registration.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "google.user@example.com", fullName: "Google User" }),
      });

      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || "Google signup failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      localStorage.setItem("isLogin", "1");
      login(data.user?.email || "google.user@example.com", data.user?.name || "Google User");

      const finalDestination = returnUrl;
      sessionStorage.removeItem("auth_redirect_url");
      router.push(finalDestination);
    } catch (err: any) {
      setErrorMessage(err.message || "Google signup failed");
    }
  };

  return (
    <main className="h-screen bg-[#FAFAFA] text-slate-950 overflow-hidden font-sans flex flex-col justify-between">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-end px-6 py-4 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] font-heading"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main Grid Content */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[1fr_1.1fr] lg:px-12 my-auto">
        <div className="hidden lg:flex flex-col items-start justify-center pl-4">
          <Link href="/" className="flex items-center gap-3.5 group mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-xl shadow-blue-500/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
              <Zap className="h-8 w-8 fill-current" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] font-heading">
            <Sparkles className="h-3.5 w-3.5" />
            Join India&apos;s trusted peer-to-peer rental marketplace
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 font-heading">
            Start borrowing & lending on Rent<span className="text-[#2563EB]">It</span>.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
            Set up your rental profile to discover nearby tools, cameras, and gear—or monetize your idle equipment with guaranteed security.
          </p>

          <div className="mt-5 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-950 font-heading">Verified Community</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Simple profile checks and local rating system.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-950 font-heading">Rental Protection</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Escrow payouts and security deposits for lenders.</p>
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-2.5 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="rounded-[1.4rem] border border-slate-100 bg-white px-6 py-5">
              <div className="mb-3">
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] font-heading">
                  <ShieldCheck className="h-3 w-3" />
                  Quick Account Setup
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                  Create your account
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  Provide your basic details to start renting or listing items near you.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-3 flex items-center justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                  {errorMessage.includes("already registered") && (
                    <Link href="/login" className="font-bold underline text-rose-900 shrink-0">
                      Log in
                    </Link>
                  )}
                </div>
              )}

              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="you@example.com"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password (min 8 characters)"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    required
                    id="terms"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <label htmlFor="terms" className="text-[11px] font-medium text-slate-600 leading-tight">
                    I agree to RentIt&apos;s{" "}
                    <Link href="/terms" className="text-[#2563EB] font-bold hover:underline font-heading">
                      Terms of Service
                    </Link>{" "}
                    & Privacy Rules.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingEmail}
                  className={`group flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-lg transition duration-300 font-heading tracking-wide cursor-pointer mt-1 ${
                    isCheckingEmail
                      ? "bg-slate-300 shadow-none cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  {isCheckingEmail ? "Checking availability..." : "Create Account"}
                  {!isCheckingEmail && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </button>
              </form>

              <div className="my-3.5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] cursor-pointer font-heading tracking-wide"
              >
                Sign up with Google
              </button>

              <p className="mt-3.5 text-center text-xs font-semibold text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#2563EB] hover:underline font-heading">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-2 text-center text-[10px] text-slate-400">
        &copy; {new Date().getFullYear()} RentIt. All rights reserved.
      </footer>

      {/* OTP Pop-up Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl shadow-blue-900/20">
            
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-slate-950 font-heading">
              Verify your mobile number
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 font-medium">
              We&apos;ve sent a 6-digit verification code to <span className="font-bold text-slate-800">{phone.length > 3 ? phone : "+91 98765 43210"}</span>. Enter it below to complete registration.
            </p>

            {otpErrorMessage && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{otpErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="mt-4 space-y-5">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10 flex items-center justify-center"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-lg transition duration-300 font-heading tracking-wide cursor-pointer ${
                  isVerifying
                    ? "bg-slate-300 shadow-none cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                }`}
              >
                {isVerifying ? "Verifying Code..." : "Verify & Complete Signup"}
              </button>

              <div className="text-center">
                <p className="text-xs font-medium text-slate-500">
                  Didn&apos;t receive code?{" "}
                  <button
                    type="button"
                    onClick={() => alert("New OTP sent!")}
                    className="font-bold text-[#2563EB] hover:underline font-heading cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}