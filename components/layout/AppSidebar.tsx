/**
 * @file components/layout/AppSidebar.tsx
 * @description Responsive sidebar wrapper for server and channel sidebars with collapsible desktop support.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { ServerSidebar } from "@/components/sidebar/ServerSidebar";
import { ChannelSidebar } from "@/components/sidebar/ChannelSidebar";
import { UserPanel } from "@/components/sidebar/UserPanel";
import type { ServerWithChannels } from "@/lib/context/ServerContext";
import { clsx } from "clsx";

/**
 * Renders the responsive application sidebar containing server navigation, channel lists, and user profile.
 *
 * @param {Object} props - The component props.
 * @param {ServerWithChannels[]} props.servers - Array of server objects with channels to display in the server navigation bar.
 * @returns {JSX.Element} The rendered mobile overlay and responsive sidebar structure.
 */
export function AppSidebar({ servers }: { servers: ServerWithChannels[] }) {
  const { isNavOpen, closeAll } = useSidebarStore();

  return (
    <>
      {/* 1. DESKTOP VIEW (md:flex) - Collapses flexibly via transition/width */}
      <aside
        className={clsx(
          "hidden md:flex flex-col h-full bg-surface shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r border-background",
          isNavOpen ? "w-78 opacity-100" : "w-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-1 min-h-0 w-78">
          <ServerSidebar servers={servers} />
          <ChannelSidebar />
        </div>
        <div className="w-78">
          <UserPanel />
        </div>
      </aside>

      {/* 2. MOBILE VIEW (md:hidden) - Functions as a slide-out drawer */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={closeAll}
        />
      )}

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex flex-col h-full w-full bg-surface transition-transform duration-200 ease-in-out md:hidden",
          isNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-1 min-h-0 w-full">
          <ServerSidebar servers={servers} />
          <ChannelSidebar />
        </div>
        <UserPanel />
      </div>
    </>
  );
}
