/**
 * @file app/api/friends/[friendshipId]/route.ts
 * @description API route handler for updating (PATCH) or removing (DELETE) an existing friendship relation.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { friendships } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Updates the status of a specific friendship request (e.g., to ACCEPTED or BLOCKED).
 *
 * @async
 * @function PATCH
 * @param {Request} req - The incoming HTTP request containing the updated status in JSON format.
 * @param {Object} context - The route context.
 * @param {Promise<{ friendshipId: string }>} context.params - The route parameters containing the friendship identifier.
 * @returns {Promise<NextResponse>} The updated friendship object or an error response.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  try {
    const { friendshipId } = await params;
    const session = await auth();
    const { status } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ACCEPTED", "BLOCKED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 },
      );
    }

    const [existingFriendship] = await db
      .select()
      .from(friendships)
      .where(eq(friendships.id, friendshipId))
      .limit(1);

    if (!existingFriendship) {
      return NextResponse.json(
        { error: "Friendship request not found" },
        { status: 404 },
      );
    }

    // Only the receiver can ACCEPT a pending request
    if (
      status === "ACCEPTED" &&
      existingFriendship.receiverId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only involved users can BLOCK
    if (
      status === "BLOCKED" &&
      existingFriendship.senderId !== session.user.id &&
      existingFriendship.receiverId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedFriendship] = await db
      .update(friendships)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(friendships.id, friendshipId))
      .returning();

    return NextResponse.json(updatedFriendship);
  } catch (error) {
    console.error("API Friendship PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Deletes an existing friendship relation.
 *
 * @async
 * @function DELETE
 * @param {Request} req - The incoming HTTP request.
 * @param {Object} context - The route context.
 * @param {Promise<{ friendshipId: string }>} context.params - The route parameters containing the friendship identifier.
 * @returns {Promise<NextResponse>} A success JSON response or an error response.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  try {
    const { friendshipId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existingFriendship] = await db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.id, friendshipId),
          or(
            eq(friendships.senderId, session.user.id),
            eq(friendships.receiverId, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (!existingFriendship) {
      return NextResponse.json(
        { error: "Friendship not found or forbidden" },
        { status: 404 },
      );
    }

    // Delete Friendship entry
    await db.delete(friendships).where(eq(friendships.id, friendshipId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Friendship DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
