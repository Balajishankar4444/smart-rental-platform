import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and new password are required." },
        { status: 400 }
      );
    }

    // Path to your JSON file (adjust if your JSON file is located elsewhere, e.g., data/users.json)
    const filePath = path.join(process.cwd(), "data", "users.json");

    // Check if the JSON file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "Database file not found." },
        { status: 500 }
      );
    }

    // Read existing users from the JSON file
    const fileData = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(fileData);

    // Find the user by email
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: "User not found in JSON storage." },
        { status: 404 }
      );
    }

    // Update the user's password
    users[userIndex].password = password; // Note: In production, hash this with bcrypt!

    // Write the updated array back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");

    return NextResponse.json(
      { message: "Password updated successfully in JSON file." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password in JSON:", error);
    return NextResponse.json(
      { message: "Internal server error while writing to JSON." },
      { status: 500 }
    );
  }
}