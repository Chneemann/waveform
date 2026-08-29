/**
 * @file lib/services/channel.service.ts
 * @description Service module providing database access methods for channel management.
 */

import { db } from "@/db";
import { channels } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves a single channel record from the database by its unique identifier.
 *
 * @param {string} channelId - The unique identifier of the channel to fetch.
 * @returns {Promise<Object | undefined>} The channel object if found, or undefined if no matching channel exists.
 */
export async function getChannelById(channelId: string) {
  return await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
  });
}
