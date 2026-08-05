// types/product.ts
export type ProductCondition = "Brand New" | "Like New" | "Good" | "Fair";
export type ProductStatus = "active" | "inactive" | "rented" | "maintenance";

export interface Product {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number;
  condition: ProductCondition;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  securityDeposit: number;
  minimumRentalDays: number;
  maximumRentalDays: number;
  availabilityCalendar: { date: string; available: boolean }[];
  quantity: number;
  status: ProductStatus;
  city: string;
  state: string;
  country: string;
  pickupLocation: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  latitude: number;
  longitude: number;
  images: string[];
  video?: string;
  specifications: Record<string, string>;
  includedItems: string[];
  rules: string[];
  rating: number;
  reviewCount: number;
  bookingCount: number;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}