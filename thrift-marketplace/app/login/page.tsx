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
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("000000");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { login } = useAuth();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

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

  const handleLoginSuccess = (submittedEmail?: string) => {
    const targetEmail = submittedEmail || email || "user@example.com";
    localStorage.setItem("isLogin", "1");
    login(targetEmail);
    const finalDestination = returnUrl;
    sessionStorage.removeItem("auth_redirect_url");
    router.push(finalDestination);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingEmail(email);
    setShowOtpModal(true);
  };

  const handleQuickLogin = (quickEmail: string) => {
    localStorage.setItem("isLogin", "1");
    login(quickEmail, quickEmail === "google.user@example.com" ? "Google User" : "User");
    const finalDestination = returnUrl;
    sessionStorage.removeItem("auth_redirect_url");
    router.push(finalDestination);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-login-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-login-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpModal(false);
      handleLoginSuccess(pendingEmail);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-950 overflow-x-hidden font-sans flex flex-col justify-between">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      {/* Header - Top-left logo removed, Back to home button made slightly larger */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-end px-6 py-5 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] font-heading"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main Grid Content - Added engaging trust/feature elements to fill the empty space */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-12 my-auto py-6">
        
        {/* Left Side: Filled Empty Space with Interactive Brand Highlights */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-[#2563EB] font-heading shadow-sm">
            <Sparkles className="h-4 w-4" />
            Peer-to-Peer Rental Revolution
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl font-heading leading-[1.1]">
              Rent anything, <br />
              <span className="text-[#2563EB]">anywhere, anytime.</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 max-w-lg">
              Join thousands of community members lending and renting verified items securely. Experience low deposits, instant bookings, and total peace of mind.
            </p>
          </div>

          {/* Feature Grid filling former empty layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="flex gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">100% Verified Users</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Government ID & phone verified profiles.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">Damage Protection</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Comprehensive coverage options on every rental.</p>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                <div className="h-7 w-7 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">K</div>
                <div className="h-7 w-7 rounded-full border-2 border-white bg-sky-500 flex items-center justify-center text-[10px] text-white font-bold">R</div>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                <span className="font-bold text-slate-900">4.9/5</span> rating from 10k+ reviews
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Centered Login Form Card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-2.5 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="rounded-[1.4rem] border border-slate-100 bg-white px-6 py-6">
              
              {/* Header Title with Logo next to the name */}
              <div className="mb-6">
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] font-heading">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Access
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[35%] bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/25">
                    <Zap className="h-5 w-5 fill-current" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                    Sign in to Rent<span className="text-[#2563EB]">It</span>
                  </h2>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 font-heading">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 font-heading">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-[#2563EB] hover:underline font-heading"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
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

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer font-heading tracking-wide"
                >
                  Sign In
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={() => handleQuickLogin("google.user@example.com")}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] cursor-pointer font-heading tracking-wide"
              >
                Continue with Google
              </button>

              <p className="mt-5 text-center text-xs font-semibold text-slate-500">
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

      {/* Footer copyright spacer */}
      <footer className="py-3 text-center text-[10px] text-slate-400">
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

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-slate-950 font-heading">
              Verify your login
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 font-medium">
              We&apos;ve sent a 6-digit verification code to <span className="font-bold text-slate-800">{pendingEmail || "your email/phone"}</span>. Enter it below to sign in.
            </p>

            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-login-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 text-center text-base font-bold text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.some((d) => !d)}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-lg transition duration-300 font-heading tracking-wide cursor-pointer ${
                  isVerifying || otp.some((d) => !d)
                    ? "bg-slate-300 shadow-none cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                }`}
              >
                {isVerifying ? "Verifying Code..." : "Verify & Sign In"}
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