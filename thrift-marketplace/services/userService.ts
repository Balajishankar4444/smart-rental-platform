// services/userService.ts
import { User } from "@/types/user";
import { USERS } from "@/data/users";

export const userService = {
  async getUserById(id: string): Promise<User | null> {
    await new Promise((res) => setTimeout(res, 200));
    return USERS.find((u) => u.id === id) || null;
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    await new Promise((res) => setTimeout(res, 300));
    const index = USERS.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    USERS[index] = { ...USERS[index], ...updates, updatedAt: new Date().toISOString() };
    return USERS[index];
  },
};