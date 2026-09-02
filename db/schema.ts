/**
 * @file db/schema.ts
 * @description Database schema definition using Drizzle ORM, containing enums, table definitions, relations, and TypeScript type exports for users, servers, members, channels, messages, and friendships.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ==========================================
// Enums
// ==========================================

/**
 * Enum representing member access roles within a server.
 */
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "MEMBER"]);

/**
 * Enum representing online status of a user.
 */
export const userStatusEnum = pgEnum("user_status", [
  "ONLINE",
  "OFFLINE",
  "IDLE",
  "DND",
]);

/**
 * Enum representing friendship status between two users.
 */
export const friendshipStatusEnum = pgEnum("friendship_status", [
  "PENDING",
  "ACCEPTED",
  "BLOCKED",
]);

// ==========================================
// Tables
// ==========================================

/**
 * Database table definition for application users.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  color: varchar("color", { length: 50 }).default("bg-indigo-500").notNull(),
  status: userStatusEnum("status").default("OFFLINE").notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Database table definition for chat servers.
 */
export const servers = pgTable("servers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 32 }).notNull(),
  color: varchar("color", { length: 50 }).default("bg-indigo-500").notNull(),
  inviteCode: varchar("invite_code", { length: 20 }).notNull().unique(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Database table definition linking users to servers with specific roles.
 */
export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: roleEnum("role").default("MEMBER").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  serverId: uuid("server_id")
    .references(() => servers.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Database table definition for text channels within servers.
 */
export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 32 }).notNull(),
  serverId: uuid("server_id")
    .references(() => servers.id, { onDelete: "cascade" })
    .notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Database table definition for chat messages sent within channels by members.
 */
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  channelId: uuid("channel_id")
    .references(() => channels.id, { onDelete: "cascade" })
    .notNull(),
  memberId: uuid("member_id")
    .references(() => members.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Database table definition for friendships / friend requests between users.
 */
export const friendships = pgTable("friendships", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: friendshipStatusEnum("status").default("PENDING").notNull(),
  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  receiverId: uuid("receiver_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// Drizzle Relations
// ==========================================

/**
 * Relational definitions for the users table.
 */
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(members),
  sentFriendRequests: many(friendships, { relationName: "sentFriendships" }),
  receivedFriendRequests: many(friendships, {
    relationName: "receivedFriendships",
  }),
}));

/**
 * Relational definitions for the servers table.
 */
export const serversRelations = relations(servers, ({ many }) => ({
  channels: many(channels),
  members: many(members),
}));

/**
 * Relational definitions for the members table.
 */
export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  server: one(servers, {
    fields: [members.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
}));

/**
 * Relational definitions for the channels table.
 */
export const channelsRelations = relations(channels, ({ one, many }) => ({
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
}));

/**
 * Relational definitions for the messages table.
 */
export const messagesRelations = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  member: one(members, {
    fields: [messages.memberId],
    references: [members.id],
  }),
}));

/**
 * Relational definitions for the friendships table.
 */
export const friendshipsRelations = relations(friendships, ({ one }) => ({
  sender: one(users, {
    fields: [friendships.senderId],
    references: [users.id],
    relationName: "sentFriendships",
  }),
  receiver: one(users, {
    fields: [friendships.receiverId],
    references: [users.id],
    relationName: "receivedFriendships",
  }),
}));

// ==========================================
// Type Exports
// ==========================================

export type User = typeof users.$inferSelect;
export type Server = typeof servers.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
export type Friendship = typeof friendships.$inferSelect;
export type FriendshipStatus = (typeof friendshipStatusEnum.enumValues)[number];
