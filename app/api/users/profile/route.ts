/**
 * @file app/api/users/profile/route.ts
 * @description API route handler for updating user profile settings (status, color).
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users, UserStatus } from "@/db/schema";
import { MEMBER_COLOR_OPTIONS } from "@/lib/constants/member.styles";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
