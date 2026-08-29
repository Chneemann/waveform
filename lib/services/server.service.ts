/**
 * @file lib/services/server.service.ts
 * @description Service module providing database queries for managing server data, user memberships, and associated channels.
 */

import { db } from "@/db";
import { members, servers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Retrieves a server along with its channels sorted chronologically if the specified user is a verified member.
 *
 * @param {string} serverId - The unique identifier of the server to retrieve.
 * @param {string} userId - The unique identifier of the requesting user.
 * @returns {Promise<Object | null>} The server record with nested channels array, or null if the user is not a member or the server is not found.
 */
export async function getServerWithChannels(serverId: string, userId: string) {
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

  return server;
}

/**
 * Fetches all servers that the specified user belongs to, including each server's sorted channels list.
 *
 * @param {string} userId - The unique identifier of the user whose servers are to be fetched.
 * @returns {Promise<Array<Object>>} An array of server objects associated with the user.
 */
export async function getUserServers(userId: string) {
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

  return userMemberships.map((membership) => membership.server).filter(Boolean);
}
