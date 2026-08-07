// thrift-marketplace/utils/listings.ts

export type ListingStatus = "active" | "pending" | "rented" | "completed" | "cancelled";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  pending: "Pending",
  rented: "Rented",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface ListingRental {
  renterId?: string;
  startDate?: string;
  endDate?: string;
  bookedAt?: string;
}

export interface ListingSummary {
  id: string;
  userId: string;
  status?: ListingStatus | string;
  rental?: ListingRental | null;
  productName: string;
  category: string;
  subcategory?: string;
  brand?: string;
  condition?: string;
  description?: string;
  primaryImage?: string;
  images?: string[];
  dailyPrice: string | number;
  weeklyPrice?: string | number;
  monthlyPrice?: string | number;
  securityDeposit?: string | number;
  city?: string;
  state?: string;
  instantBooking?: boolean;
  createdAt?: string;
  ownerName?: string;
  ownerAvatar?: string;
  latitude?: string;   // NEW  
  longitude?: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";

export function listingImage(listing: Pick<ListingSummary, "primaryImage" | "images">) {
  if (listing.primaryImage) return listing.primaryImage;
  if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images[0];
  return FALLBACK_IMAGE;
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

export function deriveListingStatus(listing: ListingSummary): ListingStatus {
  if (listing.status) {
    return listing.status as ListingStatus;
  }
  if (listing.rental && listing.rental.renterId) {
    return "rented";
  }
  return "active";
}

export function rentalDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export async function fetchListings(params: {
  userId?: string;
  renterId?: string;
  excludeUserId?: string;
  status?: string;
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