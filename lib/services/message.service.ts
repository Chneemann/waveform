/**
 * @file lib/services/message.service.ts
 * @description Service module providing database access methods for fetching and managing channel messages and associated member profiles.
 */

import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.uuid();

/**
 * Retrieves all messages for a specific channel sorted chronologically, including member and user details.
 * Validates the UUID format before querying the database and handles potential runtime errors gracefully.
 *
 * @param {string} channelId - The unique identifier of the channel whose messages are to be fetched.
 * @returns {Promise<Array<Object>>} An array of message objects with nested member and user data, or an empty array if invalid or failed.
 */
export async function getChannelMessages(channelId: string) {
  if (!uuidSchema.safeParse(channelId).success) {
    return [];
  }

  try {
    const channelMessages = await db.query.messages.findMany({
      where: eq(messages.channelId, channelId),
      orderBy: [asc(messages.createdAt)],
      with: {
        member: {
          with: {
            user: true,
          },
        },
      },
    });

    return channelMessages;
  } catch (error) {
    console.error(`Error fetching messages for channel ${channelId}:`, error);
    return [];
  }
}
