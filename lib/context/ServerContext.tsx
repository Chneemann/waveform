/**
 * @file lib/context/ServerContext.tsx
 * @description Context for managing active server state and members across sidebars and mobile drawers.
 */

"use client";

import { createContext, useContext, useState } from "react";
import type { Server, Channel, Category } from "@/db/schema";

/** Type definition representing a server entity along with its associated channels array. */
export type ServerWithChannels = Server & {
  channels: Channel[];
  categories: Category[];
};

/** Represents a member within a server. */
export interface ServerMember {
  id: string;
  name: string;
  isOnline?: boolean;
}

/** Interface defining the shape of the ServerContext state and update handlers. */
interface ServerContextType {
  activeServer: ServerWithChannels | null;
  setActiveServer: (server: ServerWithChannels | null) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channel: Channel) => void;
  addCategory: (category: Category) => void;
  members: ServerMember[];
  setMembers: (members: ServerMember[]) => void;
}

const ServerContext = createContext<ServerContextType>({
  activeServer: null,
  setActiveServer: () => {},
  addChannel: () => {},
  removeChannel: () => {},
  updateChannel: () => {},
  addCategory: () => {},
  members: [],
  setMembers: () => {},
});

/** Provider component that wraps the application layout to provide global access to active server state and member listings. */
export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [activeServer, setActiveServer] = useState<ServerWithChannels | null>(
    null,
  );
  const [members, setMembers] = useState<ServerMember[]>([]);

  /** Helper function to update channels within the active server state. */
  const updateChannels = (fn: (channels: Channel[]) => Channel[]) => {
    setActiveServer((prev) =>
      prev ? { ...prev, channels: fn(prev.channels) } : prev,
    );
  };

  /** Adds a new channel to the active server. */
  const addChannel = (channel: Channel) =>
    updateChannels((prev) => [...prev, channel]);

  /** Removes a channel from the active server by its identifier. */
  const removeChannel = (channelId: string) =>
    updateChannels((prev) => prev.filter((c) => c.id !== channelId));

  /** Updates an existing channel within the active server. */
  const updateChannel = (updatedChannel: Channel) =>
    updateChannels((prev) =>
      prev.map((c) => (c.id === updatedChannel.id ? updatedChannel : c)),
    );

  const addCategory = (category: Category) => {
    setActiveServer((prev) =>
      prev
        ? {
            ...prev,
            categories: [...(prev.categories || []), category],
          }
        : prev,
    );
  };

  return (
    <ServerContext.Provider
      value={{
        activeServer,
        setActiveServer,
        addChannel,
        removeChannel,
        updateChannel,
        addCategory,
        members,
        setMembers,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

/** Custom hook to access the active server context. */
export function useActiveServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useActiveServer must be used within a ServerProvider");
  }
  return context;
}
