export const LISTING_STATUSES = ["active", "deleted", "in_rent", "in_lease"] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  deleted: "Deleted",
  in_rent: "In Rent",
  in_lease: "In Lease",
};

export function isListingStatus(value: unknown): value is ListingStatus {
  return typeof value === "string" && (LISTING_STATUSES as readonly string[]).includes(value);
}

/** A listing as returned by GET /api/auth/products (images collapsed to `primaryImage`). */
export interface ListingSummary {
  id: string;
  userId: string;
  status: ListingStatus;
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
  status?: ListingStatus | "all";
}): Promise<ListingSummary[]> {
  const query = new URLSearchParams();
  if (params.userId) query.set("userId", params.userId);
  if (params.status) query.set("status", params.status);

  const response = await fetch(`/api/auth/products?${query.toString()}`);
  const result = await response.json();
  return Array.isArray(result?.data) ? result.data : [];
}
