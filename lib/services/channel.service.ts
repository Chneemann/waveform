/**
 * @file lib/services/channel.service.ts
 * @description Service module providing database access methods for channel management and validation.
 */

import { db } from "@/db";
import { channels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.uuid();

/**
 * Retrieves a single channel record from the database by its unique identifier.
 * Validates the UUID format before executing the database query.
 *
 * @param {string} channelId - The unique identifier of the channel to fetch.
 * @returns {Promise<Object | null>} The channel object if found, or null if no matching channel exists or an invalid ID was provided.
 */
export async function getChannelById(channelId: string) {
  if (!uuidSchema.safeParse(channelId).success) {
    return null;
  }

  try {
    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, channelId),
    });
    return channel ?? null;
  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error);
    return null;
  }
}
