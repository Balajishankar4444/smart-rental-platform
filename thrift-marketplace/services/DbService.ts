// services/DbService.ts
import fs from "fs";
import path from "path";
import { ListingRental } from "@/utils/listings";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");
const BOOKINGS_PATH = path.join(process.cwd(), "data", "booking-requests.json");

export interface StoredListingRecord {
  id: string;
  userId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  productName?: string;
  category?: string;
  brand?: string;
  model?: string;
  condition?: string;
  age?: string;
  dailyPrice?: string;
  weeklyPrice?: string;
  monthlyPrice?: string;
  securityDeposit?: string;
  lateReturnFee?: string;
  images?: string[];
  city?: string;
  state?: string;
  address?: string;
  instantBooking?: boolean;
  description?: string;
  usageInstructions?: string;
  weight?: string;
  color?: string;
  dimensions?: string;
  warranty?: boolean;
  pickupTime?: string;
  deliveryAvailable?: boolean;
  accessoriesIncluded?: string;
  propertyType?: string;
  numGuests?: string | number;
  numBeds?: string | number;
  availableFrom?: string;
  availableTo?: string;
  amenities?: Record<string, boolean>;
  checkInTime?: string;
  checkOutTime?: string;
  quietHours?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  visitorsAllowed?: boolean;
  createdAt?: string;
  rental?: ListingRental | null;
  deletedAt?: string | null;
  updatedAt?: string;
  status?: string;
}

interface DatabaseSchema {
  listings: StoredListingRecord[];
  bookingRequests: any[];
  users: any[];
}

class DbService {
  private readFile<T>(filePath: string, fallback: T): T {
    try {
      if (!fs.existsSync(filePath)) return fallback;
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
      return fallback;
    }
  }

  private writeFile(filePath: string, data: any): void {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error(`Error writing ${filePath}:`, err);
    }
  }

  public readDb(): DatabaseSchema {
    return {
      listings: this.readFile<StoredListingRecord[]>(PRODUCTS_PATH, []),
      bookingRequests: this.readFile<any[]>(BOOKINGS_PATH, []),
      users: this.readFile<any[]>(USERS_PATH, []),
    };
  }

  public writeDb(data: DatabaseSchema): void {
    this.writeFile(PRODUCTS_PATH, data.listings);
    this.writeFile(BOOKINGS_PATH, data.bookingRequests);
    this.writeFile(USERS_PATH, data.users);
  }

  public getAllListings(): StoredListingRecord[] {
    return this.readFile<StoredListingRecord[]>(PRODUCTS_PATH, []);
  }

  public getListingById(id: string): StoredListingRecord | null {
    const listings = this.getAllListings();
    return listings.find((item) => item.id === id) || null;
  }

  public saveListing(listing: StoredListingRecord): void {
    const listings = this.getAllListings();
    const existingIndex = listings.findIndex((item) => item.id === listing.id);
    
    if (existingIndex >= 0) {
      listings[existingIndex] = { ...listings[existingIndex], ...listing };
    } else {
      listings.unshift({
        ...listing,
        createdAt: listing.createdAt || new Date().toISOString(),
      });
    }

    this.writeFile(PRODUCTS_PATH, listings);
  }

  public deleteListing(id: string): boolean {
    const listings = this.getAllListings();
    const initialLength = listings.length;
    const filtered = listings.filter((item) => item.id !== id);
    if (filtered.length !== initialLength) {
      this.writeFile(PRODUCTS_PATH, filtered);
      return true;
    }
    return false;
  }
}

export const dbService = new DbService();

export function getUsers() {
  return dbService.readDb().users;
}

export function saveUsers(users: any[]) {
  const db = dbService.readDb();
  db.users = users;
  dbService.writeDb(db);
}