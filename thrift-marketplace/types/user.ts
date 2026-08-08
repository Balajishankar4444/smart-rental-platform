// types/user.ts
export type UserRole = "user" | "admin" | "moderator";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password?: string; // Stored securely/mocked for local layer
  phone: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  gender: string;
  profession: string;  
  dob: string;
  governmentId: string;
  governmentVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  rating: number;
  reviewCount: number;
  walletBalance: number;
  completedRentals: number;
  completedLendings: number;
  activeBookings: number;
  savedProducts: string[]; // Product IDs
  wishlist: string[]; // Product IDs
  notificationSettings: NotificationSettings;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  joinedDate: string;
  lastSeen: string;
  isOnline: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}