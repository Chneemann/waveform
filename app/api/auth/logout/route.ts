/**
 * @file app/api/auth/logout/route.ts
 * @description API route handler for logging out authenticated users and updating their online presence.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to log out a user by updating their online status and last active timestamp.
 *
 * @returns {Promise<NextResponse>} JSON response indicating success or error status.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .update(users)
      .set({
        status: "OFFLINE",
        lastSeenAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
