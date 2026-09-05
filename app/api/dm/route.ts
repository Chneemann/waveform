/**
 * @file app/api/dm/route.ts
 * @description API route handler for creating or retrieving direct message conversations between users.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Regular expression pattern for validating UUID format.
 *
 * @type {RegExp}
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Handles HTTP POST requests to initiate or fetch a direct message conversation with a specified recipient.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request containing the recipient identifier in JSON format.
 * @returns {Promise<NextResponse>} The JSON response containing the conversation object or an error message.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId } = await req.json();

    if (
      !recipientId ||
      !UUID_REGEX.test(recipientId) ||
      recipientId === session.user.id
    ) {
      return NextResponse.json(
        { error: "Invalid recipient ID" },
        { status: 400 },
      );
    }

    // Bestehende Konversation suchen
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(
            eq(conversations.userOneId, session.user.id),
            eq(conversations.userTwoId, recipientId),
          ),
          and(
            eq(conversations.userOneId, recipientId),
            eq(conversations.userTwoId, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Neue Konversation anlegen
    const [newConversation] = await db
      .insert(conversations)
      .values({
        userOneId: session.user.id,
        userTwoId: recipientId,
      })
      .returning();

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("API Conversations POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
