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
 * @property {ServerMember[]} members - The list of members belonging to the active server.
 * @property {(members: ServerMember[]) => void} setMembers - State setter function for updating the server members list.
 */
interface ServerContextType {
  activeServer: ServerWithChannels | null;
  setActiveServer: (server: ServerWithChannels | null) => void;
  members: ServerMember[];
  setMembers: (members: ServerMember[]) => void;
}

const ServerContext = createContext<ServerContextType>({
  activeServer: null,
  setActiveServer: () => {},
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

  return (
    <ServerContext.Provider
      value={{ activeServer, setActiveServer, members, setMembers }}
    >
      {children}
    </ServerContext.Provider>
  );
}

/**
 * Custom hook to access the current ServerContext state.
 *
 * @throws {Error} Throws an error if used outside of a `ServerProvider`.
 * @returns {ServerContextType} The server context value containing active server state and member management functions.
 */
export function useActiveServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useActiveServer must be used within a ServerProvider");
  }
  return context;
}
