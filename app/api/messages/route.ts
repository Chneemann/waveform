/**
 * @file app/api/messages/route.ts
 * @description API route handler for creating new messages in a channel.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { members, messages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to create a new message within a specific channel and server.
 *
 * @param {Request} req - The incoming HTTP request containing content, channelId, and serverId in the JSON body.
 * @returns {Promise<NextResponse>} JSON response containing the created message object or an error message.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, channelId, serverId } = await req.json();

    if (!content?.trim() || !channelId || !serverId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // Find member ID of the current user for this server
    const [member] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, session.user.id),
          eq(members.serverId, serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json(
        { error: "Not a member of this server" },
        { status: 403 },
      );
    }

    // Insert message into the database
    const [newMessage] = await db
      .insert(messages)
      .values({
        content: content.trim(),
        channelId,
        memberId: member.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("API Message POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
