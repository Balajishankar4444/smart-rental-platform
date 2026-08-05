import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/services/DbService";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = getUsers();
    const filteredUsers = users.filter((u) => u.id !== id);

    if (users.length === filteredUsers.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Save the updated list back to data/users.json
    saveUsers(filteredUsers);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}