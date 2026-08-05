// services/authService.ts
import { User } from "../types/user";
import { USERS } from "../data/users";

let currentUserSession: User | null = USERS[0]; // Default logged in for development convenience

export const authService = {
  async login(email: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 300));
    const user = USERS.find((u) => u.email === email) || USERS[0];
    currentUserSession = user;
    return user;
  },

  async signup(userData: Partial<User>): Promise<User> {
    await new Promise((res) => setTimeout(res, 300));
    const newUser: User = {
      id: `user-${USERS.length + 1}`,
      fullName: userData.fullName || "New User",
      username: userData.username || `user_${USERS.length + 1}`,
      email: userData.email || "user@example.com",
      phone: userData.phone || "+919999999999",
      avatar: userData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      coverPhoto: userData.coverPhoto || "https://images.unsplash.com/photo-1500000000000",
      bio: userData.bio || "",
      gender: userData.gender || "Other",
      dob: userData.dob || "1995-01-01",
      governmentId: "GOV-NEW",
      governmentVerified: false,
      emailVerified: false,
      phoneVerified: false,
      rating: 5.0,
      reviewCount: 0,
      walletBalance: 0,
      completedRentals: 0,
      completedLendings: 0,
      activeBookings: 0,
      savedProducts: [],
      wishlist: [],
      notificationSettings: { email: true, push: true, sms: false, marketing: false },
      address: userData.address || "",
      city: userData.city || "Bengaluru",
      state: userData.state || "Karnataka",
      country: userData.country || "India",
      zipcode: userData.zipcode || "560001",
      latitude: 12.9716,
      longitude: 77.5946,
      joinedDate: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isOnline: true,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    USERS.push(newUser);
    currentUserSession = newUser;
    return newUser;
  },

  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    currentUserSession = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await new Promise((res) => setTimeout(res, 100));
    return currentUserSession;
  },
};