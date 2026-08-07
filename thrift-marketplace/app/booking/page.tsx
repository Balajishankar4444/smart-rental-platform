// app/booking/page.tsx
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ListingSummary, listingDailyPrice, listingImage, listingTitle } from "@/utils/listings";
import { BookingRequest } from "@/utils/bookingRequests";
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

const nightsBetween = (start?: string, end?: string) => {  
  if (!start || !end) return 1;  
  const s = new Date(start).getTime();  
  const e = new Date(end).getTime();  
  if (Number.isNaN(s) || Number.isNaN(e)) return 1;  
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));  
};

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-slate-50/50" />}>
        <BookingContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function BookingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const [bookingRequest, setBookingRequest] = useState<BookingRequest | null>(null);
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!requestId || !user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch booking requests for user
        const res = await fetch(`/api/auth/booking-requests?userId=${encodeURIComponent(user.id)}`);
        if (!res.ok) throw new Error("Failed to load booking requests");
        const json = await res.json();
        const match = (json.data || []).find((r: BookingRequest) => r.id === requestId);

        if (!cancelled) {
          if (!match) {
            setBookingError("Booking request not found.");
            setLoading(false);
            return;
          }
          setBookingRequest(match);

          // 2. Fetch associated listing
          const productRes = await fetch(`/api/auth/products?id=${encodeURIComponent(match.listingId)}`);
          const productJson = await productRes.json();

          if (!cancelled) {
            if (productJson?.success && productJson.data) {
              setListing(productJson.data as ListingSummary);
            } else {
              setBookingError("This listing no longer exists. It may have been removed or republished.");
            }
          }
        }
      } catch (err) {
        console.error("Error loading checkout details:", err);
        if (!cancelled) {
          setBookingError("Failed to load booking details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [requestId, user]);

  const handlePayment = async () => {
    if (!bookingRequest || !user) return;
    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/auth/booking-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingRequest.id,
          userId: user.id,
          action: "pay",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Payment processing failed");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Payment error:", err);
      setBookingError(err.message || "Something went wrong during payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 pt-32 pb-16 flex-1 w-full text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-500">Preparing secure checkout...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isConfirmed = success || bookingRequest?.status === "paid";
  const isValidToPay = !isConfirmed && bookingRequest?.status === "approved" && listing && !bookingError;

  // Compute duration and costs directly from dates and listing price to handle stale records properly
  const nights = bookingRequest  
    ? Math.max(  
        1,  
        Math.ceil(  
          (new Date(bookingRequest.endDate).getTime() -  
            new Date(bookingRequest.startDate).getTime()) /  
            (1000 * 60 * 60 * 24)  
        )  
      )  
    : 0;  
  const perDay = listing ? listingDailyPrice(listing) : 0;  
  const computedTotal = perDay * nights;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex-1 w-full space-y-6">
        <Link
          href="/dashboard/view-booking?tab=notifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to notifications
        </Link>

        {/* Error or Stale State Banner */}
        {bookingError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">{bookingError}</p>
          </div>
        )}

        {!isValidToPay && !isConfirmed ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Checkout Not Available</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {bookingError || "This booking request is either pending, expired, cancelled, or points to an unavailable listing."}
            </p>
            <Link
              href="/dashboard/view-booking?tab=notifications"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Success State View */}
            {isConfirmed ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Payment Successful!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your rental is fully confirmed. You can coordinate pickup details directly from your dashboard rentals tab.
                </p>
                <div className="pt-4">
                  <Link
                    href="/dashboard/view-booking?tab=rentals"
                    className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    View My Rentals
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 pb-5">
                  <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                    Secure Checkout
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 mt-2">Complete Your Rental Payment</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Review your booking summary below and authorize payment.</p>
                </div>

                {/* Listing Overview Card */}
                {listing && bookingRequest && (
                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <img
                      src={listingImage(listing)}
                      alt={listingTitle(listing)}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{listingTitle(listing)}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {bookingRequest.startDate} to {bookingRequest.endDate} ({nights} days)
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        ₹{perDay} <span className="font-normal text-slate-500">/ day</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Financial Breakdown */}
                {bookingRequest && (
                  <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-100 py-4">
                    <div className="flex justify-between">
                      <span>Rental Fee ({nights} days)</span>
                      <span className="font-semibold text-slate-900">₹{computedTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & Insurance Fee</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                      <span>Total Payable</span>
                      <span className="text-blue-600">₹{computedTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}

                {/* Security Guarantee */}
                <div className="flex items-center gap-2.5 text-[11px] text-slate-500 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Protected by secure escrow. Funds are only transferred to the host upon successful handover.</span>
                </div>

                {/* Submit Action */}
                <button
                  onClick={handlePayment}
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    `Pay ₹${computedTotal.toLocaleString("en-IN")} Now`
                  )}
                </button>
              </>
            )}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}