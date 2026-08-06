export const LISTING_STATUSES = ["active", "deleted", "in_rent", "in_lease"] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Available",
  deleted: "Deleted",
  in_rent: "In Rent",
  in_lease: "In Lease",
};

/** A rental of 30 days or longer is treated as a lease rather than a rent. */
export const LEASE_MIN_DAYS = 30;

export interface ListingRental {
  renterId: string;
  startDate: string;
  endDate: string;
  bookedAt: string;
}

export function rentalDays(rental: ListingRental) {
  const start = new Date(rental.startDate).getTime();
  const end = new Date(rental.endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

/**
 * Status is never chosen by a user: it follows the listing's own state.
 * Removed -> deleted, booked and not yet returned -> in_rent / in_lease, otherwise available.
 */
export function deriveListingStatus(
  listing: { deletedAt?: string | null; rental?: ListingRental | null },
  now = new Date()
): ListingStatus {
  if (listing.deletedAt) return "deleted";

  const rental = listing.rental;
  if (rental && new Date(rental.endDate).getTime() >= now.getTime()) {
    return rentalDays(rental) >= LEASE_MIN_DAYS ? "in_lease" : "in_rent";
  }

  return "active";
}

/** A listing as returned by GET /api/auth/products (images collapsed to `primaryImage`). */
export interface ListingSummary {
  id: string;
  userId: string;
  status: ListingStatus;
  rental?: ListingRental | null;
  productName: string;
  category: string;
  subcategory: string;
  brand: string;
  condition: string;
  description: string;
  primaryImage: string;
  dailyPrice: string;
  weeklyPrice: string;
  monthlyPrice: string;
  securityDeposit: string;
  city: string;
  state: string;
  instantBooking: boolean;
  createdAt: string;
  ownerName: string;
  ownerAvatar: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";

export function listingImage(listing: Pick<ListingSummary, "primaryImage">) {
  return listing.primaryImage || FALLBACK_IMAGE;
}

export function listingTitle(listing: Pick<ListingSummary, "productName">) {
  return listing.productName?.trim() || "Untitled listing";
}

export function listingLocation(listing: Pick<ListingSummary, "city" | "state">) {
  return [listing.city, listing.state].filter(Boolean).join(", ") || "Location not set";
}

export function listingDailyPrice(listing: Pick<ListingSummary, "dailyPrice">) {
  return Number(listing.dailyPrice) || 0;
}

export async function fetchListings(params: {
  userId?: string;
  renterId?: string;
  excludeUserId?: string;
  status?: ListingStatus | "all";
}): Promise<ListingSummary[]> {
  const query = new URLSearchParams();
  if (params.userId) query.set("userId", params.userId);
  if (params.renterId) query.set("renterId", params.renterId);
  if (params.excludeUserId) query.set("excludeUserId", params.excludeUserId);
  if (params.status) query.set("status", params.status);

  const response = await fetch(`/api/auth/products?${query.toString()}`);
  const result = await response.json();
  return Array.isArray(result?.data) ? result.data : [];
}