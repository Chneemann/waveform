/**
 * @file lib/services/message.service.ts
 * @description Data access service for retrieving and managing message entities from the database.
 */

import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves all messages belonging to a specific channel, ordered chronologically ascending,
 * including associated member and user details.
 *
 * @param {string} channelId - The unique identifier of the target channel.
 * @returns {Promise<Array<Object>>} A promise resolving to a list of message objects populated with nested member and user data.
 */
export async function getChannelMessages(channelId: string) {
  return await db.query.messages.findMany({
    where: eq(messages.channelId, channelId),
    with: {
      member: {
        with: {
          user: true,
        },
      },
    },
    orderBy: (messages, { asc }) => [asc(messages.createdAt)],
  });
}
