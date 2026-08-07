// utils/bookingRequests.ts

export type BookingRequestStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'cancelled'
  | 'paid'
  | 'expired';

export type BookingRequestAction = 'approve' | 'decline' | 'pay' | 'cancel';

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
  decidedAt: string | null;
  approvalDeadline?: string | null;
  paymentDeadline: string | null;
  paidAt: string | null;
}

export const BOOKING_REQUEST_LABELS: Record<BookingRequestStatus, string> = {
  pending: 'Pending owner approval',
  approved: 'Approved — awaiting payment',
  declined: 'Declined by owner',
  cancelled: 'Cancelled',
  paid: 'Paid and booked',
  expired: 'Request expired',
};

// 24 hours from creation for owner approval deadline
export function approvalDeadlineFor(createdAt: string): string {
  const date = new Date(createdAt);
  date.setHours(date.getHours() + 24);
  return date.toISOString();
}

// 24 hours from decision/approval for payment deadline, capped by start date
export function paymentDeadlineFor(decidedAt: string, startDate: string): string {
  const decided = new Date(decidedAt);
  decided.setHours(decided.getHours() + 24);
  const start = new Date(startDate);
  const deadline = decided < start ? decided : start;
  return deadline.toISOString();
}

export function formatDeadline(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Derive dynamic/time-based status for a booking request
export function deriveRequestStatus(request: BookingRequest): BookingRequestStatus {
  if (['paid', 'cancelled', 'declined'].includes(request.status)) {
    return request.status;
  }

  const now = new Date();

  if (request.status === 'pending') {
    const created = new Date(request.createdAt);
    const approvalDeadline = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    if (now > approvalDeadline) {
      return 'expired';
    }
  }

  if (request.status === 'approved' && request.paymentDeadline) {
    const deadline = new Date(request.paymentDeadline);
    if (now > deadline) {
      return 'expired';
    }
  }

  return request.status;
}

// API client helper functions
export async function fetchBookingRequests(params: {
  userId?: string;
  listingId?: string;
  renterId?: string;
}): Promise<BookingRequest[]> {
  const search = new URLSearchParams();
  if (params.userId) search.set('userId', params.userId);
  if (params.listingId) search.set('listingId', params.listingId);
  if (params.renterId) search.set('renterId', params.renterId);

  // If no params are provided, return an empty array gracefully instead of triggering a 400 error
  if (!params.userId && !params.listingId && !params.renterId) {
    return [];
  }

  const res = await fetch(`/api/auth/booking-requests?${search.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch booking requests');
  return json.data;
}

export async function updateBookingRequest(
  id: string,
  userId: string,
  action: BookingRequestAction
): Promise<BookingRequest> {
  const res = await fetch('/api/auth/booking-requests', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, userId, action }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update booking request');
  return json.data;
}