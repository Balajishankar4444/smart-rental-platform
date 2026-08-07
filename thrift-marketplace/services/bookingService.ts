// services/bookingClient.ts

import { BookingRequest, BookingRequestAction } from "@/utils/bookingRequests";

export async function fetchBookingRequests(userId: string): Promise<BookingRequest[]> {
  try {
    const res = await fetch(`/api/auth/booking-requests?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("Failed to fetch booking requests:", err);
    return [];
  }
}

export async function updateBookingRequest(
  requestId: string,
  userId: string,
  action: BookingRequestAction
): Promise<BookingRequest | null> {
  try {
    const res = await fetch("/api/auth/booking-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: requestId, userId, action }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Failed to update booking request:", err);
    return null;
  }
}