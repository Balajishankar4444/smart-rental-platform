import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/services/DbService";

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    const userEmail = email || "google.user@example.com";
    const userName = fullName || "Google User";

    const users = getUsers() || [];
    let user = users.find((u: any) => u.email.toLowerCase() === userEmail.toLowerCase());

    if (!user) {
      user = {
        id: Date.now().toString(),
        fullName: userName,
        username: userEmail.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
        email: userEmail,
        password: "",
        phone: "",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        bio: "New RentIt community member.",
        gender: "",
        dob: "",
        governmentId: "",
        governmentVerified: false,
        emailVerified: true,
        phoneVerified: false,
        rating: 5.0,
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
      users.push(user);
      saveUsers(users);
    }

    const token = "mock-google-oauth-token-" + Date.now();

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error during Google authentication." },
      { status: 500 }
    );
  }
}