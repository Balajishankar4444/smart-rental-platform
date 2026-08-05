// types/product.ts

export type ProductPurpose = "sell" | "rent" | "lease";

export type ProductCondition = "new" | "like_new" | "good" | "fair" | "refurbished";

export type ProductStatus =
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "leased"
  | "hidden"
  | "deleted"
  | "out_of_stock";

export interface SellInformation {
  sellingPrice: number;
  discount?: number;
  tax?: number;
  negotiable: boolean;
  minimumOffer?: number;
}

export interface RentInformation {
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  securityDeposit: number;
  lateReturnFee: number;
  minRentalDuration: number; // in hours or days
  maxRentalDuration: number;
  availabilityCalendarId?: string;
}

export interface LeaseInformation {
  monthlyLeasePrice: number;
  leaseDuration: number; // in months
  securityDeposit: number;
  maintenanceIncluded: boolean;
  insuranceIncluded: boolean;
  earlyTerminationFee: number;
}

export interface ProductMedia {
  mainThumbnail: string;
  galleryImages: string[];
  videos: string[];
  threeSixtyImages?: string[];
  documents: {
    title: string;
    url: string;
  }[];
}

export interface ProductLocation {
  country: string;
  state: string;
  city: string;
  postalCode: string;
  street: string;
  latitude: number;
  longitude: number;
  pickupAvailable: boolean;
  shippingAvailable: boolean;
  shippingCost?: number;
  deliveryRadiusKm?: number;
}

export interface ProductSpecification {
  attributeName: string;
  attributeValue: string | number | boolean;
}

export interface ProductAnalytics {
  views: number;
  favorites: number;
  shares: number;
  clicks: number;
  chatRequests: number;
  bookings: number;
  purchases: number;
  averageRating: number;
  totalReviews: number;
}

export interface ProductSeo {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ProductAudit {
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  publishedAt?: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy: string;
}

export interface Product {
  id: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  brand: string;
  model: string;
  sku: string;
  category: string;
  subcategory: string;
  tags: string[];
  condition: ProductCondition;
  quantity: number;
  availabilityStatus: ProductStatus;
  visibility: "public" | "private";
  purpose: ProductPurpose[];
  sellInfo?: SellInformation;
  rentInfo?: RentInformation;
  leaseInfo?: LeaseInformation;
  media: ProductMedia;
  location: ProductLocation;
  specifications: ProductSpecification[];
  analytics: ProductAnalytics;
  seo: ProductSeo;
  audit: ProductAudit;
}

export interface ProductFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  purpose?: ProductPurpose;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  brand?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
}