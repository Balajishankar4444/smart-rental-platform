"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Bell,
  CreditCard,
  Globe,
  Eye,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Key,
  SmartphoneNfc,
  Laptop,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RippleButton } from "@/components/ui/RippleButton";

export default function SettingsPage() {
  // Track form changes for sticky save bar
  const [hasChanges, setHasChanges] = useState(false);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    rentalRequests: true,
    messages: true,
    reviews: true,
    promotions: false,
    securityAlerts: true,
    push: true,
    sms: false,
    email: true,
  });

  // Localization Settings
  const [localization, setLocalization] = useState({
    currency: "EUR",
    language: "German",
    timezone: "Europe/Berlin",
    dateFormat: "DD/MM/YYYY",
    region: "Germany",
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    publicProfile: "Everyone",
    hideEmail: "Verified Users",
    hidePhone: "Only Me",
    rentalHistoryVisibility: "Verified Users",
    showReviews: "Everyone",
  });

  // Security toggles / state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Danger zone modals
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert("Settings successfully saved and synced across your RentIt account.");
  };

  const handleDiscard = () => {
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-32 lg:px-12 space-y-10">
        
        {/* TOP SECTION: Settings Overview Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/60 text-blue-600 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Enterprise Account Control</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-heading">Settings & Preferences</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your security score, payouts, verified credentials, and notifications.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Login Active (Frankfurt, DE)
            </span>
          </div>
        </div>

        {/* KPI / SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Completion</span>
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform font-extrabold text-xs">
                92%
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[92%]"></div>
              </div>
              <p className="text-[11px] text-gray-500">Add tax ID to reach 100%</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security Score</span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">98 / 100</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Enterprise Secure</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verifications</span>
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">5 / 5 Passed</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Fully verified renter & owner</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Devices</span>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-gray-900">2 Devices</p>
              <p className="text-[11px] text-gray-500 mt-0.5">MacBook Pro & iPhone 15</p>
            </div>
          </div>
        </div>

        {/* TRUST & VERIFICATION SECTION */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Trust & Verification Badges
              </h2>
              <p className="text-xs text-gray-500 font-medium">Verified credentials increase booking trust by up to 3x on RentIt.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Email Verified", status: "Verified", desc: "alex.schmidt@rentit.de", verified: true },
              { name: "Phone Verified", status: "Verified", desc: "+49 151 9876543", verified: true },
              { name: "Address Verified", status: "Verified", desc: "Stuttgart, Germany", verified: true },
              { name: "Government ID", status: "Verified", desc: "Passport Checked", verified: true },
              { name: "Bank Account", status: "Verified", desc: "IBAN Connected", verified: true },
            ].map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {v.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{v.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY CENTER */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Security Center & 2FA
              </h2>
              <p className="text-xs text-gray-500 font-medium">Protect your account with enterprise-grade authentication credentials.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => alert("Password reset modal triggered.")}
                className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password Status</span>
              <p className="text-xs font-bold text-gray-900">Last changed 3 months ago</p>
              <p className="text-[11px] text-emerald-600 font-medium">Strong cryptographic hash</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Two-Factor Auth</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600">Active</span>
              </div>
              <p className="text-xs font-bold text-gray-900">Authenticator App (TOTP)</p>
              <button 
                onClick={() => { setTwoFactorEnabled(!twoFactorEnabled); setHasChanges(true); }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {twoFactorEnabled ? "Configure 2FA Methods" : "Enable 2FA Now"}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recovery Email</span>
              <p className="text-xs font-bold text-gray-900 truncate">backup.schmidt@rentit.de</p>
              <p className="text-[11px] text-emerald-600 font-medium">Verified & active</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recovery Phone</span>
              <p className="text-xs font-bold text-gray-900">+49 151 9876543</p>
              <p className="text-[11px] text-emerald-600 font-medium">SMS OTP enabled</p>
            </div>
          </div>
        </div>

        {/* PAYMENT & PAYOUTS */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment & Payouts (Stripe Connect)
              </h2>
              <p className="text-xs text-gray-500 font-medium">Manage connected credit cards, bank accounts, and automated Stripe escrow payouts.</p>
            </div>
            <button 
              onClick={() => alert("Add payment card modal opened.")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Card / Bank
            </button>
          </div>

          {/* Earnings / Payout KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Last Payout</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">€1,240.00</p>
                <p className="text-[10px] text-gray-500">Paid to Commerzbank (...4892)</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Upcoming Payout</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">€450.00</p>
                <p className="text-[10px] text-gray-500">Scheduled for Aug 5, 2026</p>
              </div>
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Lifetime Earnings</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">€14,890.00</p>
                <p className="text-[10px] text-gray-500">Total marketplace revenue</p>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Saved Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Saved Cards</h3>
              <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-xs tracking-widest shadow-sm">
                    VISA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Visa ending in •••• 4242</p>
                    <p className="text-[11px] text-gray-500">Expires 08/28 • Default for rentals</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">Default</span>
              </div>
            </div>

            {/* Bank Accounts & Stripe */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Bank Accounts & Payouts</h3>
              <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    IBAN
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">DE89 •••• •••• 1234</p>
                    <p className="text-[11px] text-gray-500">Stripe Connect • Instant payout enabled</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS CENTER */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-500 font-medium">Choose how and when you want to receive booking updates and alerts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "bookingUpdates", title: "Booking Updates", desc: "Status changes, pickups & returns" },
              { key: "rentalRequests", title: "Rental Requests", desc: "New bookings from potential renters" },
              { key: "messages", title: "Direct Messages", desc: "Instant chat notifications from users" },
              { key: "reviews", title: "Reviews & Ratings", desc: "When someone reviews your gear or rental" },
              { key: "promotions", title: "Promotions & Tips", desc: "Rental discounts and platform updates" },
              { key: "securityAlerts", title: "Security Alerts", desc: "Login attempts and password changes" },
              { key: "push", title: "Push Notifications", desc: "Browser and app push delivery" },
              { key: "sms", title: "SMS Notifications", desc: "Text alerts for urgent rental updates" },
              { key: "email", title: "Email Digests", desc: "Summary emails of activity and invoices" },
            ].map((item) => {
              const isActive = notifications[item.key as keyof typeof notifications];
              return (
                <div key={item.key} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-snug">{item.desc}</p>
                  </div>
                  {/* iOS Toggle Switch */}
                  <button
                    onClick={() => handleToggle(item.key as keyof typeof notifications)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isActive ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* LOCALIZATION & REGION */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Localization & Currency
              </h2>
              <p className="text-xs text-gray-500 font-medium">Set your preferred currency, language, timezone, and regional format.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Display Currency</label>
              <select
                value={localization.currency}
                onChange={(e) => { setLocalization({ ...localization, currency: e.target.value }); setHasChanges(true); }}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Preferred Language</label>
              <select
                value={localization.language}
                onChange={(e) => { setLocalization({ ...localization, language: e.target.value }); setHasChanges(true); }}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="English">English</option>
                <option value="German">German (Deutsch)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Timezone</label>
              <select
                value={localization.timezone}
                onChange={(e) => { setLocalization({ ...localization, timezone: e.target.value }); setHasChanges(true); }}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Date Format</label>
              <select
                value={localization.dateFormat}
                onChange={(e) => { setLocalization({ ...localization, dateFormat: e.target.value }); setHasChanges(true); }}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRIVACY SETTINGS */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Privacy & Profile Visibility
              </h2>
              <p className="text-xs text-gray-500 font-medium">Control who can view your profile, contact details, and rental history.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Public Profile Visibility", key: "publicProfile" },
              { label: "Hide Email Address", key: "hideEmail" },
              { label: "Hide Phone Number", key: "hidePhone" },
              { label: "Rental History Visibility", key: "rentalHistoryVisibility" },
              { label: "Show Reviews & Ratings", key: "showReviews" },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
                <label className="text-xs font-bold text-gray-800">{p.label}</label>
                <select
                  value={privacy[p.key as keyof typeof privacy]}
                  onChange={(e) => { setPrivacy({ ...privacy, [p.key]: e.target.value }); setHasChanges(true); }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer shadow-sm"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="Verified Users">Verified Users</option>
                  <option value="Only Me">Only Me</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* CONNECTED DEVICES */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-gray-900 font-heading flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Connected Devices & Sessions
              </h2>
              <p className="text-xs text-gray-500 font-medium">Review active login sessions and revoke unauthorized device access.</p>
            </div>
            <button
              onClick={() => alert("All other sessions signed out successfully.")}
              className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer"
            >
              Sign Out All Other Devices
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-900">MacBook Pro 16" (Chrome 125)</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Current Device</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Frankfurt am Main, Germany • Active Now</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">This Browser</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">iPhone 15 Pro (RentIt iOS App)</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Stuttgart, Germany • Last login 2 hours ago</p>
                </div>
              </div>
              <button
                onClick={() => alert("Device signed out.")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-gray-600 border border-gray-200 text-xs font-bold transition-all cursor-pointer"
              >
                Sign Out Device
              </button>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-rose-100 shadow-xl shadow-rose-500/5 space-y-6">
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-rose-600 font-heading flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h2>
              <p className="text-xs text-gray-500 font-medium">Deactivate your account temporarily or permanently delete your data.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/60">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Deactivate Account</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Temporarily hide your profile, active listings, and rentals without deleting history.</p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              Deactivate Account
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/60">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Delete Account Permanently</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Permanently erase all your RentIt data, payment records, and saved favorites.</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-rose-500/20"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* STICKY SAVE BAR */}
        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-xl text-white px-6 py-4 rounded-3xl shadow-2xl border border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md animate-pulse">
                  !
                </div>
                <div>
                  <p className="text-xs font-bold text-white">You have unsaved changes</p>
                  <p className="text-[11px] text-gray-400">Be sure to save your settings before leaving this page.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-all cursor-pointer whitespace-nowrap"
                >
                  Discard
                </button>
                <RippleButton
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  Save Changes
                </RippleButton>
              </div>
            </div>
          </div>
        )}

        {/* Deactivate Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-extrabold text-gray-900">Deactivate RentIt Account?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Your profile and gear will be hidden immediately. You can reactivate your account anytime simply by logging back in.</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowDeactivateModal(false)} className="px-4 py-2 rounded-2xl bg-gray-100 text-xs font-bold text-gray-700">Cancel</button>
                <button onClick={() => { alert("Account deactivated."); setShowDeactivateModal(false); }} className="px-4 py-2 rounded-2xl bg-rose-600 text-xs font-bold text-white">Confirm Deactivation</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-extrabold text-rose-600">Permanently Delete Account?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">This action cannot be undone. All your rental history, wallet balances, and saved gear will be permanently destroyed.</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-2xl bg-gray-100 text-xs font-bold text-gray-700">Cancel</button>
                <button onClick={() => { alert("Account deletion request submitted."); setShowDeleteModal(false); }} className="px-4 py-2 rounded-2xl bg-rose-600 text-xs font-bold text-white">Permanently Delete</button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}