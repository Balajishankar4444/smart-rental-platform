import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Add your actual database validation here
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Simulate successful login check (replace with real auth logic)
    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful. Please verify OTP.",
        user: { email, name: email.split("@")[0] } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}