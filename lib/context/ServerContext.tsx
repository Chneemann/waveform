/**
 * @file lib/context/ServerContext.tsx
 * @description Context for managing active server state across sidebars and mobile drawers.
 */

"use client";

import { createContext, useContext, useState } from "react";
import type { Server, Channel } from "@/db/schema";

/**
 * Type definition representing a server entity along with its associated channels array.
 */
export type ServerWithChannels = Server & { channels: Channel[] };

/**
 * Interface defining the shape of the ServerContext state and update functions.
 *
 * @interface ServerContextType
 * @property {ServerWithChannels | null} activeServer - The currently selected active server, or null if no server is active.
 * @property {(server: ServerWithChannels | null) => void} setActiveServer - Callback function to update the active server state.
 */
interface ServerContextType {
  activeServer: ServerWithChannels | null;
  setActiveServer: (server: ServerWithChannels | null) => void;
}

/**
 * React Context instance for providing and consuming active server state.
 */
const ServerContext = createContext<ServerContextType>({
  activeServer: null,
  setActiveServer: () => {},
});

/**
 * Context provider component that wraps the tree to manage and broadcast active server state.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the context provider context.
 * @returns {JSX.Element} The rendered context provider wrapper.
 */
export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [activeServer, setActiveServer] = useState<ServerWithChannels | null>(
    null,
  );

  return (
    <ServerContext.Provider value={{ activeServer, setActiveServer }}>
      {children}
    </ServerContext.Provider>
  );
}

/**
 * Custom hook to consume the ServerContext values.
 *
 * @returns {ServerContextType} The active server context state and setter method.
 * @throws {Error} Throws an error if used outside of a ServerProvider wrapper.
 */
export function useActiveServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useActiveServer must be used within a ServerProvider");
  }
  return context;
}
