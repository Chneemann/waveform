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
import type { UserStatus } from "@/db/schema";
import { clsx } from "clsx";

/**
 * Properties representing the user in the sidebar.
 *
 * @interface SidebarUser
 * @property {string} username - The display name of the user.
 * @property {string} color - The custom color assigned to the user's avatar or profile.
 * @property {UserStatus} status - The current online status of the user.
 */
export interface SidebarUser {
  username: string;
  color: string;
  status: UserStatus;
}

/**
 * Properties for the AppSidebar component.
 *
 * @interface AppSidebarProps
 * @property {ServerWithChannels[]} servers - List of available servers including their channels.
 * @property {SidebarUser} user - Information about the currently authenticated user.
 */
interface AppSidebarProps {
  servers: ServerWithChannels[];
  user: SidebarUser;
}

/**
 * Renders the responsive application sidebar containing server navigation, channel lists, and user profile.
 *
 * @param {AppSidebarProps} props - The component props.
 * @returns {JSX.Element} The rendered mobile overlay and responsive sidebar structure.
 */
export function AppSidebar({ servers, user }: AppSidebarProps) {
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
          <UserPanel user={user} />
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
        <UserPanel user={user} />
      </div>
    </>
  );
}
