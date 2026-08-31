/**
 * @file db/schema.ts
 * @description Database schema definition file utilizing Drizzle ORM for PostgreSQL. Defines tables, enums, relations, and exported TypeScript types for users, servers, members, channels, and messages.
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
  name: text("name").notNull(),
  color: varchar("color", { length: 50 }).default("bg-indigo-500").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
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

// ==========================================
// Drizzle Relations
// ==========================================

/**
 * Relational definitions for the users table.
 */
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(members),
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

// ==========================================
// Type Exports
// ==========================================

export type User = typeof users.$inferSelect;
export type Server = typeof servers.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
