/**
 * @file components/chat/ChatHeader.tsx
 * @description Client component rendering the top header of the chat interface with sidebar toggles and current channel details.
 */

"use client";

import { Menu, Hash, Users } from "lucide-react";
import { useSidebarStore } from "@/lib/store/useSidebarStore";

/**
 * Renders the top navigation header for the chat view, providing toggle triggers for mobile navigation and member list sidebars.
 *
 * @returns {JSX.Element} The rendered chat header component.
 */
export function ChatHeader() {
  const { toggleNav, toggleMembers } = useSidebarStore();

  return (
    <header className="h-12 border-b border-neutral-800 flex items-center justify-between px-4 bg-background shrink-0">
      <div className="flex items-center gap-3 font-semibold">
        <button
          onClick={toggleNav}
          className="md:hidden text-muted hover:text-foreground focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <Hash className="w-5 h-5 text-muted" />
          <span className="text-foreground">general</span>
        </div>
      </div>

      <button
        onClick={toggleMembers}
        className="xl:hidden text-muted hover:text-foreground focus:outline-none cursor-pointer"
        aria-label="Toggle Members"
      >
        <Users className="w-5 h-5" />
      </button>
    </header>
  );
}
