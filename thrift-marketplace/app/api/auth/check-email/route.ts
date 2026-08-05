import { NextResponse } from "next/server";
import { getUsers } from "@/services/DbService";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const userExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return NextResponse.json(
        { success: false, exists: true, message: "This email address is already registered." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, exists: false },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error during email check." },
      { status: 500 }
    );
  }
}