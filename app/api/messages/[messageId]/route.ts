/**
 * @file app/api/messages/[messageId]/route.ts
 * @description API route handlers for deleting and updating individual chat messages.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { members, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles the DELETE request to remove a specific message by its ID.
 * Verifies user authentication and ensures the user owns the message before deletion.
 *
 * @async
 * @function DELETE
 * @param {Request} req - The incoming HTTP request object.
 * @param {Object} context - The route context.
 * @param {Promise<{ messageId: string }>} context.params - A promise resolving to the route parameters containing the message ID.
 * @returns {Promise<NextResponse>} JSON response indicating success or failure with appropriate HTTP status codes.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve a message and its associated member
    const [existingMessage] = await db
      .select({
        id: messages.id,
        memberId: messages.memberId,
        userId: members.userId,
      })
      .from(messages)
      .innerJoin(members, eq(messages.memberId, members.id))
      .where(eq(messages.id, messageId))
      .limit(1);

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check Permissions
    if (existingMessage.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this message" },
        { status: 403 },
      );
    }

    // Delete message
    await db.delete(messages).where(eq(messages.id, messageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Message DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles the PATCH request to update the content of a specific message by its ID.
 * Verifies user authentication, request body content, and ensures the user owns the message before updating.
 *
 * @async
 * @function PATCH
 * @param {Request} req - The incoming HTTP request object containing the updated message content.
 * @param {Object} context - The route context.
 * @param {Promise<{ messageId: string }>} context.params - A promise resolving to the route parameters containing the message ID.
 * @returns {Promise<NextResponse>} JSON response containing the updated message object or an error message with appropriate HTTP status codes.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "The content cannot be empty" },
        { status: 400 },
      );
    }

    // Check Message and Owner
    const [existingMessage] = await db
      .select({
        id: messages.id,
        memberId: messages.memberId,
        userId: members.userId,
      })
      .from(messages)
      .innerJoin(members, eq(messages.memberId, members.id))
      .where(eq(messages.id, messageId))
      .limit(1);

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check Permissions
    if (existingMessage.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to edit this message" },
        { status: 403 },
      );
    }

    // Update message
    const [updatedMessage] = await db
      .update(messages)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(messages.id, messageId))
      .returning();

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("API Message PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
