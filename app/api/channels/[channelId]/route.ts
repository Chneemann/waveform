/**
 * @file app/api/channels/[channelId]/route.ts
 * @description API route handler for updating and deleting channels.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { channels, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles PATCH requests to update an existing channel's name.
 *
 * @async
 * @function PATCH
 * @param {Request} req - The incoming HTTP request object containing the updated channel name in the body.
 * @param {Object} context - The route context parameters.
 * @param {Promise<{ channelId: string }>} context.params - A promise resolving to the route parameters containing the channel ID.
 * @returns {Promise<NextResponse>} A JSON response containing the updated channel object or an error message.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const session = await auth();
    const { name } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { error: "Channel name cannot be empty" },
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

    const [existingChannel] = await db
      .select()
      .from(channels)
      .where(eq(channels.id, channelId))
      .limit(1);

    if (!existingChannel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Protect the default channel from changes
    if (existingChannel.isDefault) {
      return NextResponse.json(
        { error: "The default channel cannot be edited." },
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
          eq(members.serverId, existingChannel.serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update Channel
    const [updatedChannel] = await db
      .update(channels)
      .set({ name: name.trim() })
      .where(eq(channels.id, channelId))
      .returning();

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error("API Channel PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to remove an existing channel.
 *
 * @async
 * @function DELETE
 * @param {Request} req - The incoming HTTP request object.
 * @param {Object} context - The route context parameters.
 * @param {Promise<{ channelId: string }>} context.params - A promise resolving to the route parameters containing the channel ID.
 * @returns {Promise<NextResponse>} A JSON response confirming deletion or returning an error message.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  try {
    const { channelId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existingChannel] = await db
      .select()
      .from(channels)
      .where(eq(channels.id, channelId))
      .limit(1);

    if (!existingChannel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Protect default channel from deletion
    if (existingChannel.isDefault) {
      return NextResponse.json(
        { error: "The default channel cannot be deleted." },
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
          eq(members.serverId, existingChannel.serverId),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete Channel
    await db.delete(channels).where(eq(channels.id, channelId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Channel DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
