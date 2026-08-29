/**
 * @file app/api/servers/route.ts
 * @description API route handler for creating a new server along with default member and general channel entries.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { channels, members, servers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Zod validation schema for server creation requests.
 */
const createServerSchema = z.object({
  name: z.string().min(1, "Server name is required.").max(50),
  color: z.string().default("bg-indigo-500"),
});

/**
 * Handles HTTP POST requests to create a new server, assigning the creator as OWNER and creating a default "general" channel inside a transaction.
 *
 * @param {Request} req - The incoming HTTP request containing the server creation payload.
 * @returns {Promise<NextResponse>} A JSON response with the newly created server details (status 201), validation errors (status 400), or an error status (401/500).
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validation = createServerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: z.treeifyError(validation.error) },
        { status: 400 },
      );
    }

    const { name, color } = validation.data;
    const inviteCode = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

    // Transaction: Create server, owner membership, and default channel "general"
    const newServer = await db.transaction(async (tx) => {
      const [server] = await tx
        .insert(servers)
        .values({
          name,
          color,
          ownerId: session.user.id,
          inviteCode,
        })
        .returning();

      await tx.insert(members).values({
        userId: session.user.id,
        serverId: server.id,
        role: "OWNER",
      });

      const [defaultChannel] = await tx
        .insert(channels)
        .values({
          name: "general",
          serverId: server.id,
        })
        .returning();

      return {
        ...server,
        defaultChannelId: defaultChannel.id,
      };
    });

    revalidatePath("/", "layout");

    return NextResponse.json(newServer, { status: 201 });
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
