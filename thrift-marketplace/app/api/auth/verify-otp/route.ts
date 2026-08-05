import { NextResponse } from "next/server";
import { getUsers } from "@/services/DbService";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Enter OTP" },
        { status: 400 }
      );
    }

    if (otp !== "000000") {
      return NextResponse.json(
        { message: "Invalid OTP code." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token: "mock-jwt-token-dev-mode",
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error during OTP verification." },
      { status: 500 }
    );
  }
}