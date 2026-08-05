import { NextResponse } from "next/server";
import { getUsers } from "@/services/DbService";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    const users = getUsers() || [];
    
    // Check if either email or phone already exists in the database
    const existingUser = users.find(
      (u: any) => 
        (email && u.email && u.email.toLowerCase() === email.toLowerCase()) || 
        (phone && u.phone && u.phone.trim() === phone.trim())
    );

    if (existingUser) {
      let conflictField = "email address or phone number";
      if (email && existingUser.email && existingUser.email.toLowerCase() === email.toLowerCase()) {
        conflictField = "email address";
      } else if (phone && existingUser.phone && existingUser.phone.trim() === phone.trim()) {
        conflictField = "phone number";
      }

      return NextResponse.json(
        { 
          exists: true, 
          message: `This ${conflictField} is already registered.` 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error during user check." },
      { status: 500 }
    );
  }
}