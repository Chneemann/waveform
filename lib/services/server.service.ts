/**
 * @file lib/services/server.service.ts
 * @description Service module providing database queries for managing server data, user memberships, and associated channels.
 */

import { db } from "@/db";
import { members, servers, channels } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.uuid();

/**
 * Retrieves a server along with its channels sorted chronologically if the specified user is a verified member.
 * Validates UUID formats prior to database execution to prevent database errors.
 *
 * @param {string} serverId - The unique identifier of the server to retrieve.
 * @param {string} userId - The unique identifier of the requesting user.
 * @returns {Promise<Object | null>} The server record with nested channels array, or null if the user is not a member, the server does not exist, or an invalid ID was provided.
 */
export async function getServerWithChannels(serverId: string, userId: string) {
  if (
    !uuidSchema.safeParse(serverId).success ||
    !uuidSchema.safeParse(userId).success
  ) {
    return null;
  }

  try {
    const isMember = await db.query.members.findFirst({
      where: and(eq(members.serverId, serverId), eq(members.userId, userId)),
    });

    if (!isMember) return null;

    const server = await db.query.servers.findFirst({
      where: eq(servers.id, serverId),
      with: {
        channels: {
          orderBy: (channels, { asc }) => [asc(channels.createdAt)],
        },
      },
    });

    return server ?? null;
  } catch (error) {
    console.error(`Error fetching server ${serverId}:`, error);
    return null;
  }
}

/**
 * Fetches all servers that the specified user belongs to, including each server's sorted channels list.
 *
 * @param {string} userId - The unique identifier of the user whose servers are to be fetched.
 * @returns {Promise<Array<Object>>} An array of server objects associated with the user.
 */
export async function getUserServers(userId: string) {
  if (!uuidSchema.safeParse(userId).success) {
    return [];
  }

  try {
    const userMemberships = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        server: {
          with: {
            channels: {
              orderBy: (channels, { asc }) => [asc(channels.createdAt)],
            },
          },
        },
      },
    });

    return userMemberships
      .map((membership) => membership.server)
      .filter(Boolean);
  } catch (error) {
    console.error(`Error fetching servers for user ${userId}:`, error);
    return [];
  }
}

/**
 * Retrieves a single server by its ID without checking membership.
 *
 * @param {string} serverId - The unique identifier of the server to retrieve.
 * @returns {Promise<Object | null>} The server record or null if not found/invalid ID.
 */
export async function getServerById(serverId: string) {
  if (!uuidSchema.safeParse(serverId).success) {
    return null;
  }

  try {
    const server = await db.query.servers.findFirst({
      where: eq(servers.id, serverId),
    });

    return server ?? null;
  } catch (error) {
    console.error(`Error fetching server by ID ${serverId}:`, error);
    return null;
  }
}
