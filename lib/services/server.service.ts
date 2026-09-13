/**
 * @file lib/services/server.service.ts
 * @description Service module providing database queries for managing server data, user memberships, and associated channels.
 */

import { db } from "@/db";
import { members, servers, channels } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.uuid();

/** Retrieves a server along with its channels and categories sorted chronologically if the specified user is a verified member. */
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
        // NEU: Categories mitladen
        categories: {
          orderBy: (categories, { asc }) => [asc(categories.createdAt)],
        },
      },
    });

    return server ?? null;
  } catch (error) {
    console.error(`Error fetching server ${serverId}:`, error);
    return null;
  }
}

/** Fetches all servers that the specified user belongs to, including each server's sorted channels and categories list. */
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
            // NEU: Categories mitladen
            categories: {
              orderBy: (categories, { asc }) => [asc(categories.createdAt)],
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

/** Retrieves a single server by its ID without checking membership. */
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
