"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck, Zap, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Steps: 'email' -> 'otp' -> 'new-password'
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  // New Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Step 1: Submit email and open OTP verification
  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

  // Handle OTP input changes
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation for OTP inputs
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Step 2: Verify OTP (checks if code equals 000000 or any 6-digit fill)
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Move to new password creation step
      setStep("new-password");
    }, 1000);
  };

  // Step 3: Check passwords match and finish -> redirect to login page
  const handlePasswordReset = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <main className="h-screen bg-[#FAFAFA] text-slate-950 overflow-hidden font-sans flex flex-col justify-between">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      {/* Header - Back to login / home aligned right */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-end px-6 py-4 lg:px-12">
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] font-heading"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to login</span>
        </Link>
      </header>

      {/* Main Grid Content */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[1fr_1.1fr] lg:px-12 my-auto">
        {/* Left Content (Desktop) - Logo and Branding matching your theme */}
        <div className="hidden lg:flex flex-col items-start justify-center pl-4">
          <Link href="/" className="flex items-center gap-3.5 group mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[35%] bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-xl shadow-blue-500/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
              <Zap className="h-8 w-8 fill-current" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-gray-900 font-heading">
              Rent<span className="text-[#2563EB]">It</span>
            </span>
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] font-heading">
            <ShieldCheck className="h-3.5 w-3.5" />
            Account Security & Recovery
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 font-heading">
            Forgot your password? No worries.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
            We&apos;ll send you secure instructions to reset your password and get you back to borrowing or renting out gear safely.
          </p>

          <div className="mt-5 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-950 font-heading">Encrypted Reset</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Secure tokens that expire safely after use.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-950 font-heading">Instant Delivery</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Check your inbox within seconds for instructions.</p>
            </div>
          </div>
        </div>

        {/* Forgot Password Card (Right) */}
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-2.5 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="rounded-[1.4rem] border border-slate-100 bg-white px-6 py-6">
              
              {/* STEP 1: Enter Email */}
              {step === "email" && (
                <>
                  <div className="mb-5">
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] font-heading">
                      <ShieldCheck className="h-3 w-3" />
                      Password Recovery
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                      Reset password
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Enter the email address associated with your RentIt account.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleEmailSubmit}>
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
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition duration-300 font-heading tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: Enter 6-Digit OTP (Default 000000) */}
              {step === "otp" && (
                <>
                  <div className="mb-5">
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] font-heading">
                      <ShieldCheck className="h-3 w-3" />
                      Security Check
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                      Enter verification code
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      We sent a 6-digit code to <span className="font-bold text-slate-800">{email}</span> (hint: use <span className="text-[#2563EB]">000000</span>).
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`forgot-otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-base font-bold text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
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
                      {isVerifying ? "Verifying OTP..." : "Verify Code"}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setStep("email")}
                        className="text-xs font-bold text-slate-500 hover:text-[#2563EB] font-heading cursor-pointer"
                      >
                        ← Back to email entry
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* STEP 3: New Password & Re-enter Password matching window */}
              {step === "new-password" && (
                <>
                  <div className="mb-5">
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB] font-heading">
                      <ShieldCheck className="h-3 w-3" />
                      New Credentials
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                      Create new password
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Enter and confirm your new password below.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    {errorMsg && (
                      <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200">
                        {errorMsg}
                      </div>
                    )}

                    {/* New Password */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-700 font-heading uppercase tracking-wide">
                        Re-enter Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2563EB] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isResetting}
                      className={`group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition duration-300 font-heading tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer ${
                        isResetting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isResetting ? "Saving New Password..." : "Save New Password"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </form>
                </>
              )}

              <p className="mt-6 text-center text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4">
                Remember your password?{" "}
                <Link href="/login" className="font-bold text-[#2563EB] hover:underline font-heading">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer copyright spacer */}
      <footer className="py-2 text-center text-[10px] text-slate-400">
        &copy; {new Date().getFullYear()} RentIt. All rights reserved.
      </footer>
    </main>
  );
}