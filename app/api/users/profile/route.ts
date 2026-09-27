/**
 * @file app/api/users/profile/route.ts
 * @description API route handlers for updating user profile settings and deleting user accounts.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users, UserStatus } from "@/db/schema";
import { MEMBER_COLOR_OPTIONS } from "@/lib/constants/member.styles";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/** List of valid user status values. */
const VALID_STATUSES: UserStatus[] = ["ONLINE", "OFFLINE", "AFK", "DND"];

/** Handles PATCH requests to update the logged-in user's profile settings. */
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, color } = await req.json();

    const updateData: { status?: UserStatus; color?: string } = {};

    // Validate status if provided
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      updateData.status = status;
    }

    // Validate color if provided
    if (color !== undefined) {
      if (!MEMBER_COLOR_OPTIONS.includes(color)) {
        return NextResponse.json(
          { error: "Invalid color option" },
          { status: 400 },
        );
      }
      updateData.color = color;
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Update user in database
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("API User Settings PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/** Handles DELETE requests to remove the logged-in user's account. */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the email matches the GUEST_EMAIL from the .env file
    const guestEmail = process.env.GUEST_EMAIL;
    if (guestEmail && existingUser.email === guestEmail) {
      return NextResponse.json(
        { error: "Guest accounts cannot be deleted" },
        { status: 403 },
      );
    }

    // Perform deletion
    await db.delete(users).where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("API User Settings DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
