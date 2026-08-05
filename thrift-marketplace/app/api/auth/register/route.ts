import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/services/DbService";
import { User } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, phone } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const users = getUsers();

    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      username: email.split("@")[0],
      email,
      password,
      phone: phone || "",

      avatar: "",
      coverPhoto: "",
      bio: "",
      gender: "",
      dob: "",
      governmentId: "",
      governmentVerified: false,
      emailVerified: true,
      phoneVerified: false,
      rating: 5,
      reviewCount: 0,
      walletBalance: 0,
      completedRentals: 0,
      completedLendings: 0,
      activeBookings: 0,
      savedProducts: [],
      wishlist: [],
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      address: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      latitude: 0,
      longitude: 0,
      joinedDate: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isOnline: true,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    saveUsers(users);

    return NextResponse.json({
      success: true,
      message: "User created",
      user: newUser,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: String(err),
      },
      { status: 500 }
    );
  }
}