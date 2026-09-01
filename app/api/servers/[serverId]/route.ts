/**
 * @file app/api/servers/[serverId]/route.ts
 * @description API route handler for updating and deleting servers.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Handles PATCH requests to update an existing server's name.
 *
 * @async
 * @function PATCH
 * @param {Request} req - The incoming HTTP request object containing the updated server name in the body.
 * @param {Object} context - The route context parameters.
 * @param {Promise<{ serverId: string }>} context.params - A promise resolving to the route parameters containing the server ID.
 * @returns {Promise<NextResponse>} A JSON response containing the updated server object or an error message.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  try {
    const { serverId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const name = body?.name;

    // Ensure name is present, valid string type, and not just whitespace
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Server name is required and cannot be empty." },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    // Ensure server name stays within allowable character limits
    if (trimmedName.length > 32) {
      return NextResponse.json(
        { error: "Server name cannot exceed 32 characters." },
        { status: 400 },
      );
    }

    // Check if the server exists
    const [existingServer] = await db
      .select()
      .from(servers)
      .where(eq(servers.id, serverId))
      .limit(1);

    if (!existingServer) {
      return NextResponse.json({ error: "Server not found." }, { status: 404 });
    }

    // Check if the user is the owner of the server
    if (existingServer.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to edit this server." },
        { status: 403 },
      );
    }

    // Update Server
    const [updatedServer] = await db
      .update(servers)
      .set({ name: trimmedName })
      .where(eq(servers.id, serverId))
      .returning();

    revalidatePath("/", "layout");
    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error("API Server PATCH error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to remove an existing server.
 *
 * @async
 * @function DELETE
 * @param {Request} req - The incoming HTTP request object.
 * @param {Object} context - The route context parameters.
 * @param {Promise<{ serverId: string }>} context.params - A promise resolving to the route parameters containing the server ID.
 * @returns {Promise<NextResponse>} A JSON response confirming deletion or returning an error message.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  try {
    const { serverId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the server exists
    const [existingServer] = await db
      .select()
      .from(servers)
      .where(eq(servers.id, serverId))
      .limit(1);

    if (!existingServer) {
      return NextResponse.json({ error: "Server not found." }, { status: 404 });
    }

    // Check if the user is the owner of the server
    if (existingServer.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this server." },
        { status: 403 },
      );
    }

    // Delete Server
    await db.delete(servers).where(eq(servers.id, serverId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Server DELETE error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 },
    );
  }
}
