// lib/productStore.ts
import fs from 'fs';
import path from 'path';
import { deriveListingStatus, ListingRental } from '@/utils/listings';

const dataFilePath = path.join(process.cwd(), 'data', 'product.json');

export interface StoredProduct {
  id: string;
  userId: string;
  deletedAt?: string | null;
  rental?: ListingRental | null;
  images?: string[];
  primaryImageIndex?: number;
  [key: string]: unknown;
}

function ensureDataFileExists() {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
  }
}

export function readProducts(): StoredProduct[] {
  ensureDataFileExists();
  const parsed = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

export function writeProducts(products: StoredProduct[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
}

// Status is always computed from the listing's own state, never taken from the client
export function withStatus(product: StoredProduct) {
  return { ...product, status: deriveListingStatus(product) };
}

// Listing responses carry a single cover image instead of the full (base64) gallery
export function toSummary(product: StoredProduct) {
  const { images, primaryImageIndex, ...rest } = withStatus(product);
  return {
    ...rest,
    primaryImage: images?.[primaryImageIndex || 0] || '',
  };
}