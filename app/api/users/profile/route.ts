/**
 * @file app/api/users/profile/route.ts
 * @description API route handlers for updating user profile settings and deleting user accounts.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users, UserStatus } from "@/db/schema";
import { MEMBER_COLOR_OPTIONS } from "@/lib/constants/member.styles";
import { hashPassword } from "@/lib/password";
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

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, color, username, email, password } = body;

    // Protection against changes to the guest account
    const guestEmail = process.env.GUEST_EMAIL;
    const isGuest = guestEmail && existingUser.email === guestEmail;

    if (isGuest && (username || email || password)) {
      return NextResponse.json(
        { error: "Guest account details cannot be modified" },
        { status: 403 },
      );
    }

    const updateData: Partial<typeof users.$inferInsert> = {};

    // Validate status if provided (auch Gäste dürfen ihren Status/Farbe ändern)
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

    // Validate and set username
    if (username !== undefined) {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        return NextResponse.json(
          { error: "Username cannot be empty" },
          { status: 400 },
        );
      }
      updateData.username = trimmedUsername;
    }

    // Validate and set email
    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail.includes("@")) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 },
        );
      }
      updateData.email = trimmedEmail;
    }

    // Hash and set password
    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 },
        );
      }
      updateData.password = await hashPassword(password);
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
