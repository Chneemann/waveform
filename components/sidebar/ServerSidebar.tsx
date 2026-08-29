/**
 * @file components/sidebar/ServerSidebar.tsx
 * @description Sidebar navigation component for switching between servers, home view, and server creation.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import {
  useActiveServer,
  type ServerWithChannels,
} from "@/lib/context/ServerContext";
import { cn } from "@/lib/utils";
import {
  SERVER_COLOR_CLASSES,
  BASE_ICON_STYLES,
  ACTIVE_ICON_STYLES,
  INACTIVE_ICON_STYLES,
} from "@/lib/constants/server.styles";
import { CreateServerModal } from "@/components/modals/CreateServerModal";

/**
 * Component props for ServerItem.
 */
interface ServerItemProps {
  server: ServerWithChannels;
  pathname: string;
  onSelect: (server: ServerWithChannels) => void;
}

/**
 * Renders an individual server icon link with active status styling and target channel routing.
 *
 * @param {ServerItemProps} props - The component props.
 * @param {ServerWithChannels} props.server - The server object containing channels and styling attributes.
 * @param {string} props.pathname - The current active route pathname.
 * @param {(server: ServerWithChannels) => void} props.onSelect - Callback handler triggered when the server is selected.
 * @returns {JSX.Element} The rendered server navigation link item.
 */
function ServerItem({ server, pathname, onSelect }: ServerItemProps) {
  const isActive = pathname.startsWith(`/servers/${server.id}`);
  const initial = server.name.charAt(0).toUpperCase();
  const serverBg = SERVER_COLOR_CLASSES[server.color] || "bg-indigo-500";

  const firstChannelId = server.channels?.[0]?.id;
  const targetHref = firstChannelId
    ? `/servers/${server.id}/channels/${firstChannelId}`
    : `/servers/${server.id}`;

  return (
    <Link
      href={targetHref}
      title={server.name}
      prefetch={false}
      onClick={() => onSelect(server)}
      style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
      className={cn(
        BASE_ICON_STYLES,
        serverBg,
        "text-white text-2xl font-semibold",
        isActive ? ACTIVE_ICON_STYLES : INACTIVE_ICON_STYLES,
      )}
    >
      {initial}
    </Link>
  );
}

/**
 * Renders the main server navigation sidebar including the home link, server list, and trigger for adding new servers.
 *
 * @param {Object} props - The component props.
 * @param {ServerWithChannels[]} props.servers - Initial list of servers with channels passed from the parent component.
 * @returns {JSX.Element} The rendered server sidebar and accompanying creation modal.
 */
export function ServerSidebar({
  servers: initialServers,
}: {
  servers: ServerWithChannels[];
}) {
  const pathname = usePathname();
  const { setActiveServer } = useActiveServer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servers, setServers] = useState(initialServers);

  // Synchronisiert den Zustand sofort bei Änderungen serverseitiger Daten
  useEffect(() => {
    setServers(initialServers);
  }, [initialServers]);

  return (
    <>
      <aside className="w-18 bg-surface flex flex-col items-center py-3 gap-3 border-r border-background shrink-0 h-full justify-between">
        <div className="flex flex-col items-center gap-3 w-full flex-1 min-h-0">
          {/* Home Icon */}
          <Link
            href="/"
            title="Home"
            prefetch={false}
            onClick={() => setActiveServer(null)}
            className={cn(
              BASE_ICON_STYLES,
              "bg-surface/50 overflow-hidden",
              pathname === "/" ? ACTIVE_ICON_STYLES : INACTIVE_ICON_STYLES,
            )}
          >
            <NextImage
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>

          <div className="w-8 h-0.5 bg-background/80 rounded-full shrink-0" />

          {/* Server List */}
          <div className="flex flex-col gap-3 w-full items-center overflow-y-auto flex-1 min-h-0 p-1">
            {servers.map((server) => (
              <ServerItem
                key={server.id}
                server={server}
                pathname={pathname}
                onSelect={setActiveServer}
              />
            ))}
          </div>

          {/* Add Server Button */}
          <button
            type="button"
            title="Server hinzufügen"
            onClick={() => setIsModalOpen(true)}
            className={cn(
              BASE_ICON_STYLES,
              "bg-background text-muted hover:bg-accent hover:text-white text-2xl font-light",
              INACTIVE_ICON_STYLES,
            )}
          >
            +
          </button>
        </div>
      </aside>

      <CreateServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
