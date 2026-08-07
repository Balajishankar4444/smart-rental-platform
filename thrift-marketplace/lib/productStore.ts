// lib/productStore.ts
import { dbService, StoredListingRecord } from '@/services/DbService';
import { deriveListingStatus, ListingSummary } from '@/utils/listings';

export type StoredProduct = StoredListingRecord;

export function readProducts(): StoredProduct[] {
  return dbService.getAllListings();
}

export function writeProducts(products: StoredProduct[]): void {
  const db = dbService.readDb();
  db.listings = products;
  dbService.writeDb(db);
}

export function withStatus(product: StoredProduct) {
  return {
    ...product,
    status: deriveListingStatus(product),
  };
}

export function toSummary(detailed: StoredProduct): ListingSummary {
  const d = detailed as Record<string, any>;
  return {
    id: d.id,
    userId: d.userId,
    productName: d.productName,
    category: d.category,
    propertyType: d.propertyType,
    brand: d.brand,
    dailyPrice: d.dailyPrice,
    images: d.images,
    primaryImageIndex: d.primaryImageIndex,
    city: d.city,
    status: d.status,
    rental: d.rental,
    createdAt: d.createdAt,
    latitude: d.latitude,
    longitude: d.longitude,
    instantBooking: d.instantBooking,
    state: d.state,
    numGuests: d.numGuests ?? d.maxGuests,
    petsAllowed: d.petsAllowed ?? d.petFriendly,
  };
}