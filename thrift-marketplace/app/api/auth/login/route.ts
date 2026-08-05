import fs from "fs";
import path from "path";
import { User } from "@/types/user";

// Force absolute path and log it so you can see where it lives
const filePath = path.join(process.cwd(), "data", "users.json");
console.log("📂 ACTIVE DATABASE FILE PATH:", filePath);

export function getUsers(): User[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ users.json does NOT exist at:", filePath);
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(fileData);
    console.log(`📖 Read ${parsed.length} users from disk.`);
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
    console.log(`✅ SUCCESSFULLY WROTE ${users.length} users to: ${filePath}`);
  } catch (error) {
    console.error("❌ Error writing users database:", error);
    throw new Error("Failed to save user data to server storage.");
  }
}