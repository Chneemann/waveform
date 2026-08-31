/**
 * @file lib/context/ServerContext.tsx
 * @description Context for managing active server state and members across sidebars and mobile drawers.
 */

"use client";

import { createContext, useContext, useState } from "react";
import type { Server, Channel } from "@/db/schema";

/**
 * Type definition representing a server entity along with its associated channels array.
 */
export type ServerWithChannels = Server & { channels: Channel[] };

/**
 * Represents a member within a server.
 *
 * @interface ServerMember
 * @property {string} id - The unique identifier of the server member.
 * @property {string} name - The display name of the server member.
 * @property {boolean} [isOnline] - Optional flag indicating whether the member is currently online.
 */
export interface ServerMember {
  id: string;
  name: string;
  isOnline?: boolean;
}

/**
 * Interface defining the shape of the ServerContext state and update handlers.
 *
 * @interface ServerContextType
 * @property {ServerWithChannels | null} activeServer - The currently active server instance with its associated channels.
 * @property {(server: ServerWithChannels | null) => void} setActiveServer - State setter function for updating the active server.
 * @property {(channel: Channel) => void} addChannel - Function to add a new channel to the active server.
 * @property {(channelId: string) => void} removeChannel - Function to remove a channel by its identifier.
 * @property {(channel: Channel) => void} updateChannel - Function to update an existing channel.
 * @property {ServerMember[]} members - The list of members belonging to the active server.
 * @property {(members: ServerMember[]) => void} setMembers - State setter function for updating the server members list.
 */
interface ServerContextType {
  activeServer: ServerWithChannels | null;
  setActiveServer: (server: ServerWithChannels | null) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channel: Channel) => void;
  members: ServerMember[];
  setMembers: (members: ServerMember[]) => void;
}

const ServerContext = createContext<ServerContextType>({
  activeServer: null,
  setActiveServer: () => {},
  addChannel: () => {},
  removeChannel: () => {},
  updateChannel: () => {},
  members: [],
  setMembers: () => {},
});

/**
 * Provider component that wraps the application layout to provide global access to active server state and member listings.
 *
 * @param {Object} props - React component properties.
 * @param {React.ReactNode} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} The rendered React provider wrapping the child elements.
 */
export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [activeServer, setActiveServer] = useState<ServerWithChannels | null>(
    null,
  );
  const [members, setMembers] = useState<ServerMember[]>([]);

  /**
   * Helper function to update channels within the active server state.
   *
   * @function updateChannels
   * @param {(channels: Channel[]) => Channel[]} fn - The updater function receiving current channels and returning new channels.
   * @returns {void}
   */
  const updateChannels = (fn: (channels: Channel[]) => Channel[]) => {
    setActiveServer((prev) =>
      prev ? { ...prev, channels: fn(prev.channels) } : prev,
    );
  };

  /**
   * Adds a new channel to the active server.
   *
   * @function addChannel
   * @param {Channel} channel - The channel object to add.
   * @returns {void}
   */
  const addChannel = (channel: Channel) =>
    updateChannels((prev) => [...prev, channel]);

  /**
   * Removes a channel from the active server by its identifier.
   *
   * @function removeChannel
   * @param {string} channelId - The unique identifier of the channel to remove.
   * @returns {void}
   */
  const removeChannel = (channelId: string) =>
    updateChannels((prev) => prev.filter((c) => c.id !== channelId));

  /**
   * Updates an existing channel within the active server.
   *
   * @function updateChannel
   * @param {Channel} updatedChannel - The updated channel object.
   * @returns {void}
   */
  const updateChannel = (updatedChannel: Channel) =>
    updateChannels((prev) =>
      prev.map((c) => (c.id === updatedChannel.id ? updatedChannel : c)),
    );

  return (
    <ServerContext.Provider
      value={{
        activeServer,
        setActiveServer,
        addChannel,
        removeChannel,
        updateChannel,
        members,
        setMembers,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

/**
 * Custom hook to access the active server context.
 *
 * @function useActiveServer
 * @throws {Error} Throws an error if used outside of a ServerProvider.
 * @returns {ServerContextType} The active server context value.
 */
export function useActiveServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useActiveServer must be used within a ServerProvider");
  }
  return context;
}
