/**
 * @file lib/services/member.service.ts
 * @description Service module providing data access functions for server members using Drizzle ORM.
 */

import { db } from "@/db";
import { members, users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves all members belonging to a specific server, including user profile details.
 *
 * @async
 * @function getServerMembers
 * @param {string} serverId - The unique identifier of the server to fetch members for.
 * @returns {Promise<Array<{ id: string, username: string, color: string | null, status: string | null }>>} Array of member user profiles, or an empty array if an error occurs.
 */
export async function getServerMembers(serverId: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        color: users.color,
        status: users.status,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(members.serverId, serverId));

    return result;
  } catch (error) {
    console.error("Error fetching server members:", error);
    return [];
  }
}
