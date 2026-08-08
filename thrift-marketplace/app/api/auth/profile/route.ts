// app/api/auth/profile/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types/user";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function readUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const fileData = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const EDITABLE_FIELDS = [
  "fullName",
  "phone",
  "dob",
  "bio",
  "avatar",
  "address",
  "city",
  "state",
  "gender",
  "profession",
] as const;

type EditableField = typeof EDITABLE_FIELDS[number];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const users = readUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userLanguages = Array.isArray(user.language) ? user.language : [];

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        dob: user.dob || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        gender: user.gender || "",
        profession: user.profession || "",
        language: userLanguages,
        languages: userLanguages, // Added to match frontend ProfileForm expectation safely
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updates: Partial<Record<EditableField, string>> = {};
    for (const field of EDITABLE_FIELDS) {
      if (typeof body[field] === "string") {
        updates[field] = body[field];
      }
    }

    // Handle language array safely from either key name
    const languagesInput = body.languages || body.language;
    const resolvedLanguages = Array.isArray(languagesInput) ? languagesInput : [];

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      language: resolvedLanguages,
      updatedAt: new Date().toISOString(),
    };

    writeUsers(users);

    const updatedLanguages = users[userIndex].language;

    return NextResponse.json({
      success: true,
      data: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        fullName: users[userIndex].fullName,
        phone: users[userIndex].phone,
        dob: users[userIndex].dob,
        bio: users[userIndex].bio,
        avatar: users[userIndex].avatar,
        address: users[userIndex].address,
        city: users[userIndex].city,
        state: users[userIndex].state,
        gender: users[userIndex].gender,
        profession: users[userIndex].profession,
        language: updatedLanguages,
        languages: updatedLanguages,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}