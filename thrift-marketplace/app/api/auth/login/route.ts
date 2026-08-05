import { NextResponse } from "next/server";
import { getUsers } from "@/services/DbService";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 } // Ensures response.ok is false
      );
    }

    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // If user doesn't exist or password doesn't match, return 401 Unauthorized
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 } // Ensures response.ok is false and triggers frontend catch/error block
      );
    }

    // Only if credentials match successfully:
    return NextResponse.json({
      success: true,
      message: "Credentials verified. Proceed to OTP.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error during login." },
      { status: 500 }
    );
  }
}