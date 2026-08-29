/**
 * @file lib/providers/ServerStateSync.tsx
 * @description Syncs active server data into ServerContext on mount and updates on change.
 */

"use client";

import { useEffect } from "react";
import {
  useActiveServer,
  type ServerWithChannels,
} from "@/lib/context/ServerContext";

/**
 * Client component that synchronizes the current server state with the global server context.
 *
 * @param {Object} props - The component props.
 * @param {ServerWithChannels} props.server - The server object containing channels to be set as active.
 * @returns {null} Renders no UI elements.
 */
export function ServerStateSync({ server }: { server: ServerWithChannels }) {
  const { setActiveServer } = useActiveServer();

  useEffect(() => {
    setActiveServer(server);
  }, [server, setActiveServer]);

  return null;
}
