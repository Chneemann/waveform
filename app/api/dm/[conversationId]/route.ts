/**
 * @file app/api/dm/[conversationId]/route.ts
 * @description API route handler for creating new direct messages within a specific conversation.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { conversations, directMessages } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Regular expression to validate UUID format for conversation IDs. */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Handles POST requests to send a new direct message in a conversation.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request containing the message content.
 * @param {Object} context - The route context.
 * @param {Promise<{ conversationId: string }>} context.params - The route parameters containing the conversation ID.
 * @returns {Promise<NextResponse>} The JSON response with the created message or an error status.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await params;

    if (!UUID_REGEX.test(conversationId)) {
      return NextResponse.json(
        { error: "Invalid Conversation ID" },
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

    // Sicherstellen, dass der User Teil der Unterhaltung ist
    const [conversation] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          or(
            eq(conversations.userOneId, session.user.id),
            eq(conversations.userTwoId, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found or forbidden" },
        { status: 404 },
      );
    }

    const [newMessage] = await db
      .insert(directMessages)
      .values({
        content: content.trim(),
        conversationId,
        senderId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("API Direct Messages POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
