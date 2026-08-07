// utils/bookingRequests.ts

export type BookingRequestStatus =
  | "pending"
  | "approved"
  | "declined"
  | "expired"
  | "paid"
  | "cancelled";

export type BookingRequestAction = "approve" | "decline" | "cancel" | "pay";

export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  status: BookingRequestStatus;
  createdAt: string;
  decidedAt?: string | null;
  paymentDeadline?: string | null;
  approvalDeadline?: string | null;
  paidAt?: string | null;
}

export const BOOKING_REQUEST_LABELS: Record<BookingRequestStatus, string> = {
  pending: "Pending host approval",
  approved: "Approved — awaiting payment",
  declined: "Declined by host",
  expired: "Expired",
  paid: "Confirmed & Paid",
  cancelled: "Cancelled",
};

export const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
export const APPROVAL_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours for host to approve

export function paymentDeadlineFor(decidedAt: string) {
  const time = new Date(decidedAt).getTime();
  return Number.isNaN(time) ? null : new Date(time + PAYMENT_WINDOW_MS).toISOString();
}

/** 24-hour window for the host to approve a request from creation. */
export function approvalDeadlineFor(createdAt: string) {
  const time = new Date(createdAt).getTime();
  return Number.isNaN(time) ? null : new Date(time + APPROVAL_WINDOW_MS).toISOString();
}

export function deriveRequestStatus(
  request: Pick<BookingRequest, "status" | "paymentDeadline" | "approvalDeadline">,
  now = Date.now()
): BookingRequestStatus {
  if (request.status === "pending" && request.approvalDeadline) {
    return new Date(request.approvalDeadline).getTime() < now ? "expired" : "pending";
  }
  if (request.status !== "approved" || !request.paymentDeadline) return request.status;
  return new Date(request.paymentDeadline).getTime() < now ? "expired" : "approved";
}

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

export function formatDeadline(isoString?: string | null) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Live countdown from now to the deadline, e.g. "23h 14m 09s" or "Expired". */  
export function formatCountdown(deadline?: string | null, now = Date.now()): string {  
  if (!deadline) return "";  
  const remaining = new Date(deadline).getTime() - now;  
  if (Number.isNaN(remaining)) return "";  
  if (remaining <= 0) return "Expired";  
  
  const totalSeconds = Math.floor(remaining / 1000);  
  const h = Math.floor(totalSeconds / 3600);  
  const m = Math.floor((totalSeconds % 3600) / 60);  
  const s = totalSeconds % 60;  
  const pad = (n: number) => String(n).padStart(2, "0");  
  return `${h}h ${pad(m)}m ${pad(s)}s`;  
}