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
  return {
    id: detailed.id,
    userId: detailed.userId,
    productName: detailed.productName,
    category: detailed.category,
    propertyType: detailed.propertyType,
    brand: detailed.brand,
    dailyPrice: detailed.dailyPrice,
    images: detailed.images,
    primaryImageIndex: detailed.primaryImageIndex,
    city: detailed.city,
    status: detailed.status,
    rental: detailed.rental,
    createdAt: detailed.createdAt,
    latitude: detailed.latitude,
    longitude: detailed.longitude,
    instantBooking: detailed.instantBooking,
  };
}