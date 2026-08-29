/**
 * @file components/sidebar/ServerSidebar.tsx
 * @description Sidebar navigation component for switching between servers and home view.
 */

"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import {
  useActiveServer,
  type ServerWithChannels,
} from "@/lib/context/ServerContext";

/**
 * ServerSidebar component rendering the list of available servers, home navigation, and server creation trigger.
 *
 * @param {Object} props - The component props.
 * @param {ServerWithChannels[]} props.servers - Array of server objects containing channel and display metadata.
 * @returns {JSX.Element} The rendered server sidebar navigation.
 */
export function ServerSidebar({ servers }: { servers: ServerWithChannels[] }) {
  const pathname = usePathname();
  const { setActiveServer } = useActiveServer();

  /**
   * Mapping of Tailwind CSS background color classes for server icons.
   */
  const COLOR_CLASSES: Record<string, string> = {
    "bg-indigo-500": "bg-indigo-500",
    "bg-emerald-500": "bg-emerald-500",
    "bg-rose-500": "bg-rose-500",
    "bg-amber-500": "bg-amber-500",
    "bg-sky-500": "bg-sky-500",
    "bg-violet-500": "bg-violet-500",
  };

  /**
   * Shared base CSS utility classes for server icon buttons.
   */
  const baseIconStyles =
    "w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-md shrink-0";
  /**
   * CSS utility classes applied to the currently active server icon.
   */
  const activeIconStyles =
    "rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-surface cursor-default pointer-events-none opacity-100";
  /**
   * CSS utility classes applied to inactive server icons.
   */
  const inactiveIconStyles =
    "rounded-3xl opacity-80 hover:opacity-100 hover:rounded-xl hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-accent/40 cursor-pointer active:scale-95";

  return (
    <aside className="w-18 bg-surface flex flex-col items-center py-3 gap-3 border-r border-background shrink-0 h-full justify-between">
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Home Icon */}
        <Link
          href="/"
          title="Home"
          prefetch={false}
          onClick={() => setActiveServer(null)}
          className={`${baseIconStyles} bg-surface/50 overflow-hidden ${
            pathname === "/" ? activeIconStyles : inactiveIconStyles
          }`}
        >
          <NextImage
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="object-contain"
          />
        </Link>

        <div className="w-8 h-0.5 bg-background/80 rounded-full" />

        {/* Server List */}
        <div className="flex flex-col gap-3 w-full items-center overflow-y-auto max-h-[calc(100vh-160px)] p-1">
          {servers.map((server) => {
            const isActive = pathname.startsWith(`/servers/${server.id}`);
            const initial = server.name.charAt(0).toUpperCase();
            const serverBg = COLOR_CLASSES[server.color] || "bg-indigo-500";

            // Direkt zum ersten Channel verlinken (falls vorhanden), sonst zur Fallback-Server-Page
            const firstChannelId = server.channels?.[0]?.id;
            const targetHref = firstChannelId
              ? `/servers/${server.id}/channels/${firstChannelId}`
              : `/servers/${server.id}`;

            return (
              <Link
                key={server.id}
                href={targetHref}
                title={server.name}
                prefetch={false}
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
                className={`${baseIconStyles} ${serverBg} text-white text-2xl font-semibold ${
                  isActive ? activeIconStyles : inactiveIconStyles
                }`}
              >
                {initial}
              </Link>
            );
          })}
        </div>

        {/* Add Server Button */}
        <button
          type="button"
          title="Server hinzufügen"
          className={`${baseIconStyles} bg-background text-muted hover:bg-accent hover:text-white ${inactiveIconStyles}`}
        >
          +
        </button>
      </div>
    </aside>
  );
}
