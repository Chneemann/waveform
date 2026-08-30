/**
 * @file app/api/servers/[serverId]/members/route.ts
 * @description API route handler for retrieving all members belonging to a specific server.
 */

import { NextResponse } from "next/server";
import { getServerMembers } from "@/lib/services/member.service";

/**
 * Handles HTTP GET requests to fetch members of a server.
 *
 * @param {Request} req - The incoming HTTP request object.
 * @param {Object} context - Route context parameters.
 * @param {Promise<{ serverId: string }>} context.params - Asynchronous route parameters containing the serverId.
 * @returns {Promise<NextResponse>} JSON response containing the list of server members or an error message.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  try {
    const { serverId } = await params;
    const members = await getServerMembers(serverId);
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch server members" },
      { status: 500 },
    );
  }
}
