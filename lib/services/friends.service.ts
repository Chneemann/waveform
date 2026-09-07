/**
 * @file lib/services/friends.service.ts
 * @description Service module providing database queries for managing and retrieving user friendships.
 */

import { db } from "@/db";
import { friendships } from "@/db/schema";
import { eq, or } from "drizzle-orm";

/** Retrieves all friendship records where the specified user is either the sender or the receiver. */
export async function getUserFriendships(userId: string) {
  try {
    const result = await db
      .select({
        id: friendships.id,
        senderId: friendships.senderId,
        receiverId: friendships.receiverId,
        status: friendships.status,
      })
      .from(friendships)
      .where(
        or(
          eq(friendships.senderId, userId),
          eq(friendships.receiverId, userId),
        ),
      );

    return result;
  } catch (error) {
    console.error("Error fetching user friendships:", error);
    return [];
  }
}
