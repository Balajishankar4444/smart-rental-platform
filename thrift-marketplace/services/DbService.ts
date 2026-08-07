// services/DbService.ts
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.json");

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
}

interface DatabaseSchema {
  listings: StoredListingRecord[];
  bookingRequests: any[];
  users: any[];
}

class DbService {
  private ensureDbExists() {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        listings: [],
        bookingRequests: [],
        users: [],
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
    }
  }

  public readDb(): DatabaseSchema {
    this.ensureDbExists();
    try {
      const fileContent = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      return {
        listings: Array.isArray(parsed.listings) ? parsed.listings : [],
        bookingRequests: Array.isArray(parsed.bookingRequests) ? parsed.bookingRequests : [],
        users: Array.isArray(parsed.users) ? parsed.users : [],
      };
    } catch (err) {
      console.error("Error reading database.json, returning empty state:", err);
      return { listings: [], bookingRequests: [], users: [] };
    }
  }

  public writeDb(data: DatabaseSchema): void {
    this.ensureDbExists();
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing database.json:", err);
    }
  }

  public getAllListings(): StoredListingRecord[] {
    const db = this.readDb();
    return db.listings;
  }

  public getListingById(id: string): StoredListingRecord | null {
    const db = this.readDb();
    return db.listings.find((item) => item.id === id) || null;
  }

  public saveListing(listing: StoredListingRecord): void {
    const db = this.readDb();
    const existingIndex = db.listings.findIndex((item) => item.id === listing.id);
    
    if (existingIndex >= 0) {
      db.listings[existingIndex] = { ...db.listings[existingIndex], ...listing };
    } else {
      db.listings.unshift({
        ...listing,
        createdAt: listing.createdAt || new Date().toISOString(),
      });
    }

    this.writeDb(db);
  }

  public deleteListing(id: string): boolean {
    const db = this.readDb();
    const initialLength = db.listings.length;
    db.listings = db.listings.filter((item) => item.id !== id);
    if (db.listings.length !== initialLength) {
      this.writeDb(db);
      return true;
    }
    return false;
  }
}

export const dbService = new DbService();

export function getUsers() {
  const db = dbService.readDb();
  return db.users || [];
}

export function saveUsers(users: any[]) {
  const db = dbService.readDb();
  db.users = users;
  dbService.writeDb(db);
}