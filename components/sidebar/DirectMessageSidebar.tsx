/**
 * @file components/sidebar/DirectMessageSidebar.tsx
 * @description Sidebar listing direct messages and friends list when no server is selected.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { PanelLeftClose, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { FriendUser } from "../friends/FriendsView";

/**
 * Represents a direct message conversation in the sidebar.
 *
 * @interface SidebarConversation
 * @property {string} id - The unique identifier of the conversation.
 * @property {FriendUser} partner - The other user participating in the conversation.
 */
export interface SidebarConversation {
  id: string;
  partner: FriendUser;
}

/**
 * Properties for the DirectMessageSidebar component.
 *
 * @interface DirectMessageSidebarProps
 * @property {SidebarConversation[]} [conversations=[]] - Array of active direct message conversations.
 */
interface DirectMessageSidebarProps {
  conversations?: SidebarConversation[];
}

/**
 * Renders the direct message sidebar with navigation options, friends view link, and a list of active DM chats.
 *
 * @param {DirectMessageSidebarProps} props - The component props.
 * @param {SidebarConversation[]} [props.conversations=[]] - Array of active direct message conversations.
 * @returns {JSX.Element} The rendered direct message sidebar.
 */
export function DirectMessageSidebar({
  conversations = [],
}: DirectMessageSidebarProps) {
  const { toggleNav } = useSidebarStore();
  const pathname = usePathname();

  return (
    <div className="flex-1 w-full md:w-60 bg-surface/50 border-r border-background flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-background flex items-center justify-between px-4 font-bold text-white shadow-sm">
        <span>Direct Messages</span>
        <button
          type="button"
          onClick={toggleNav}
          title="Collapse the sidebar"
          className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation & List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-1">
          <Link
            href="/"
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
              pathname === "/"
                ? "text-white bg-accent/20"
                : "text-muted hover:text-white hover:bg-surface/50",
            )}
          >
            <Users className="w-4 h-4" />
            <span className="font-bold">Friends</span>
          </Link>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted px-2 mb-2 uppercase tracking-wider">
            All Messages
          </div>

          {conversations.length === 0 ? (
            <div className="text-sm text-muted px-2 py-1 italic">
              No active chats
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((c) => {
                const isActive = pathname === `/dm/${c.id}`;

                return (
                  <Link
                    key={c.id}
                    href={`/dm/${c.id}`}
                    className={clsx(
                      "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent/20 text-white"
                        : "text-muted hover:text-white hover:bg-surface/50",
                    )}
                  >
                    {/* UserAvatar Integration */}
                    <UserAvatar user={c.partner} size="xs" />

                    <span className="truncate">{c.partner.username}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
