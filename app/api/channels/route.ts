/**
 * @file app/api/channels/route.ts
 * @description API route handler for creating new channels within a server.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { categories, channels, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Handles the POST request to create a new channel within a specific server. */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, serverId, categoryId } = await req.json();

    if (!name || !serverId) {
      return NextResponse.json(
        { error: "Name and server ID are required" },
        { status: 400 },
      );
    }

    // Validate maximum length for channel name
    if (name.length > 32) {
      return NextResponse.json(
        { error: "Channel name cannot exceed 32 characters" },
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

    // Validate category existence and server association if provided
    if (categoryId) {
      const [category] = await db
        .select()
        .from(categories)
        .where(
          and(eq(categories.id, categoryId), eq(categories.serverId, serverId)),
        )
        .limit(1);

      if (!category) {
        return NextResponse.json(
          { error: "Invalid category provided for this server" },
          { status: 400 },
        );
      }
    }

    // Create the channel in the database
    const [newChannel] = await db
      .insert(channels)
      .values({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        serverId,
        categoryId: categoryId || null,
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
