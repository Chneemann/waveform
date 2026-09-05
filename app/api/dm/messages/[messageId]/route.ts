/**
 * @file app/api/dm/messages/[messageId]/route.ts
 * @description API route handlers for updating (PATCH) and deleting (DELETE) direct messages by their unique ID, including validation and permission checks.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { directMessages } from "@/db/schema";
import { isValidUuid } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles PATCH requests to update the content of an existing direct message.
 *
 * @async
 * @function PATCH
 * @param {Request} req - The incoming HTTP request object containing the updated message content.
 * @param {Object} context - The route context containing dynamic parameters.
 * @param {Promise<{ messageId: string }>} context.params - A promise resolving to the route parameters including the message ID.
 * @returns {Promise<NextResponse>} The updated message JSON response or an appropriate error response.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params;

    if (!isValidUuid(messageId)) {
      return NextResponse.json(
        { error: "Invalid Message ID" },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 },
      );
    }

    const [existingMessage] = await db
      .select()
      .from(directMessages)
      .where(eq(directMessages.id, messageId))
      .limit(1);

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (existingMessage.senderId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedMessage] = await db
      .update(directMessages)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(directMessages.id, messageId))
      .returning();

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("API Direct Message PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to remove a direct message by its unique ID.
 *
 * @async
 * @function DELETE
 * @param {Request} req - The incoming HTTP request object.
 * @param {Object} context - The route context containing dynamic parameters.
 * @param {Promise<{ messageId: string }>} context.params - A promise resolving to the route parameters including the message ID.
 * @returns {Promise<NextResponse>} A success JSON response or an appropriate error response.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params;

    if (!isValidUuid(messageId)) {
      return NextResponse.json(
        { error: "Invalid Message ID" },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existingMessage] = await db
      .select()
      .from(directMessages)
      .where(eq(directMessages.id, messageId))
      .limit(1);

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (existingMessage.senderId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(directMessages).where(eq(directMessages.id, messageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Direct Message DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
