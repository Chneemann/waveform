/**
 * @file app/api/channels/route.ts
 * @description API route handler for creating new channels within a server.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { channels, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles the POST request to create a new channel within a specific server.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request containing JSON payload with `name` and `serverId`.
 * @returns {Promise<NextResponse>} The created channel object with status 201, or an error response (401, 400, 403, 500).
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, serverId } = await req.json();

    if (!name?.trim() || !serverId) {
      return NextResponse.json(
        { error: "Name and server ID are required" },
        { status: 400 },
      );
    }

    // Check if the user is a member of the server
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
        { error: "Access denied to this server" },
        { status: 403 },
      );
    }

    // Create the channel in the database
    const [newChannel] = await db
      .insert(channels)
      .values({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        serverId,
      })
      .returning();

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error("API Channel POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
