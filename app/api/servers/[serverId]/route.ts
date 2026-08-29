/**
 * @file app/api/servers/[serverId]/route.ts
 * @description API route handler for deleting a server.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Handles DELETE requests to remove a server if the requesting user is the owner.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Object} context - Route parameters context.
 * @param {Promise<{ serverId: string }>} context.params - Async route parameters containing the `serverId`.
 * @returns {Promise<NextResponse>} A JSON response with the deleted server data on success, or an appropriate error response.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId } = await params;

    // Delete the server only if the current user is the OWNER
    const [deletedServer] = await db
      .delete(servers)
      .where(
        and(eq(servers.id, serverId), eq(servers.ownerId, session.user.id)),
      )
      .returning();

    if (!deletedServer) {
      return new NextResponse("Server not found or forbidden", { status: 404 });
    }

    revalidatePath("/", "layout");
    return NextResponse.json(deletedServer);
  } catch (error) {
    console.error("[SERVER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
