export const BOOKING_REQUEST_STATUSES = [
  "pending",
  "approved",
  "declined",
  "paid",
  "expired",
  "cancelled",
] as const;

export type BookingRequestStatus = (typeof BOOKING_REQUEST_STATUSES)[number];

export const BOOKING_REQUEST_LABELS: Record<BookingRequestStatus, string> = {
  pending: "Awaiting owner approval",
  approved: "Approved — payment pending",
  declined: "Declined by owner",
  paid: "Paid",
  expired: "Payment window expired",
  cancelled: "Cancelled",
};

/** Renters get a day to pay once the owner approves. */
export const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  ownerId: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  status: BookingRequestStatus;
  createdAt: string;
  decidedAt?: string | null;
  paymentDeadline?: string | null;
  paidAt?: string | null;
}

/**
 * Payment is due within 24h of approval, but never later than the rental
 * itself starts — a booking starting in 6h has a 6h window.
 */
export function paymentDeadlineFor(approvedAt: string, startDate: string) {
  const approved = new Date(approvedAt).getTime();
  const start = new Date(startDate).getTime();
  const fullWindow = approved + PAYMENT_WINDOW_MS;

  if (!Number.isNaN(start) && start > approved && start < fullWindow) {
    return new Date(start).toISOString();
  }

  return new Date(fullWindow).toISOString();
}

/** An approved request whose deadline has passed counts as expired. */
export function deriveRequestStatus(
  request: Pick<BookingRequest, "status" | "paymentDeadline">,
  now = Date.now()
): BookingRequestStatus {
  if (request.status !== "approved" || !request.paymentDeadline) return request.status;
  return new Date(request.paymentDeadline).getTime() < now ? "expired" : "approved";
}

export function formatDeadline(deadline?: string | null) {
  if (!deadline) return "";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function fetchBookingRequests(userId: string): Promise<BookingRequest[]> {
  const response = await fetch(`/api/auth/booking-requests?userId=${encodeURIComponent(userId)}`);
  const result = await response.json();
  return Array.isArray(result?.data) ? result.data : [];
}

export type BookingRequestAction = "approve" | "decline" | "pay" | "cancel";

export async function updateBookingRequest(
  id: string,
  userId: string,
  action: BookingRequestAction
): Promise<BookingRequest> {
  const response = await fetch("/api/auth/booking-requests", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, userId, action }),
  });

  const result = await response.json();
  if (!response.ok || !result?.success) throw new Error(result?.error || "Request failed");
  return result.data as BookingRequest;
}
