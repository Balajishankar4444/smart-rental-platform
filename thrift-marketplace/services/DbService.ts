import fs from "fs";
import path from "path";
import { User } from "@/types/user";

// Force absolute path starting from process.cwd()
const filePath = path.join(process.cwd(), "data", "users.json");

export function getUsers(): User[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ users.json not found at:", filePath);
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(fileData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("❌ Error reading users database:", error);
    return [];
  }
}

export function saveUsers(users: User[]): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
    console.log(`✅ Successfully wrote ${users.length} users to disk at: ${filePath}`);
  } catch (error) {
    console.error("❌ Error writing users database:", error);
    throw new Error("Failed to save user data to server storage.");
  }
}