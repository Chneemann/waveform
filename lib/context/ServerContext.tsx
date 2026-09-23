/**
 * @file lib/context/ServerContext.tsx
 * @description Context for managing active server state, current user state, and members across sidebars and mobile drawers.
 */

"use client";

import { createContext, useContext, useState } from "react";
import type { Server, Channel, Category, User, Member } from "@/db/schema";

/** Member type combining User details with server Role. */
export type ServerMemberWithUser = User & {
  role: Member["role"];
};

/** Server type including associated channels, categories, and members. */
export type ServerWithChannels = Server & {
  channels: Channel[];
  categories: Category[];
  members: ServerMemberWithUser[];
};

/** Simplified member representation within server context. */
export interface ServerMember {
  id: string;
  name: string;
  isOnline?: boolean;
}

/** Shape of the server context state and dispatch functions. */
interface ServerContextType {
  activeServer: ServerWithChannels | null;
  setActiveServer: (server: ServerWithChannels | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateCurrentUser: (partialUser: Partial<User>) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channel: Channel) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  members: ServerMember[];
  setMembers: (members: ServerMember[]) => void;
}

const ServerContext = createContext<ServerContextType | null>(null);

/** Provides active server, channel, user, and member management state to child components. */
export function ServerProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [activeServer, setActiveServer] = useState<ServerWithChannels | null>(
    null,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [members, setMembers] = useState<ServerMember[]>([]);

  /** Updates the active server state using a partial updater function. */
  const updateServer = (
    fn: (prev: ServerWithChannels) => Partial<ServerWithChannels>,
  ) => {
    setActiveServer((prev) => (prev ? { ...prev, ...fn(prev) } : null));
  };

  /** Updates the local current user state and reflects changes in active server members list. */
  const updateCurrentUser = (partialUser: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...partialUser } : null));

    if (currentUser?.id) {
      updateServer((s) => ({
        members: s.members.map((m) =>
          m.id === currentUser.id ? { ...m, ...partialUser } : m,
        ),
      }));
    }
  };

  /** Adds a new channel to the active server. */
  const addChannel = (ch: Channel) =>
    updateServer((s) => ({ channels: [...s.channels, ch] }));

  /** Removes a channel by ID from the active server. */
  const removeChannel = (id: string) =>
    updateServer((s) => ({ channels: s.channels.filter((c) => c.id !== id) }));

  /** Updates an existing channel in the active server. */
  const updateChannel = (ch: Channel) =>
    updateServer((s) => ({
      channels: s.channels.map((c) => (c.id === ch.id ? ch : c)),
    }));

  /** Adds a new category to the active server. */
  const addCategory = (cat: Category) =>
    updateServer((s) => ({ categories: [...(s.categories || []), cat] }));

  /** Updates an existing category in the active server. */
  const updateCategory = (cat: Category) =>
    updateServer((s) => ({
      categories: s.categories.map((c) => (c.id === cat.id ? cat : c)),
    }));

  /** Removes a category by ID and unassigns its channels. */
  const removeCategory = (id: string) =>
    updateServer((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      channels: s.channels.map((c) =>
        c.categoryId === id ? { ...c, categoryId: null } : c,
      ),
    }));

  return (
    <ServerContext.Provider
      value={{
        activeServer,
        setActiveServer,
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        addChannel,
        removeChannel,
        updateChannel,
        addCategory,
        updateCategory,
        removeCategory,
        members,
        setMembers,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

/** Custom hook to consume active server context state. */
export function useActiveServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useActiveServer must be used within a ServerProvider");
  }
  return context;
}
