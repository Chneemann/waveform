/**
 * @file components/sidebar/DirectMessageSidebar.tsx
 * @description Sidebar listing direct messages and friends list when no server is selected.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { PanelLeftClose } from "lucide-react";
import Link from "next/link";

/**
 * DirectMessageSidebar component that renders navigation for direct messages and friends.
 * Includes a header with collapsible controls and links for viewing chat channels and active conversations.
 *
 * @returns {JSX.Element} The direct message sidebar component layout.
 */
export function DirectMessageSidebar() {
  const { toggleNav } = useSidebarStore();

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
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white bg-accent/20 font-medium transition-all"
          >
            <span>Friends</span>
          </Link>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted px-2 mb-2 uppercase tracking-wider">
            Direct Messages
          </div>
          <div className="text-sm text-muted px-2 py-1 italic">
            No active chats
          </div>
        </div>
      </div>
    </div>
  );
}
