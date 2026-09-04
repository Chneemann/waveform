/**
 * @file components/friends/FriendsHeader.tsx
 * @description Renders a responsive sub-header with tabs for navigating between all friends, pending requests, and adding a friend.
 */

"use client";

import { Users, Clock } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";

/**
 * Available tab types for the friends navigation view.
 *
 * @type {TabType}
 */
export type TabType = "all" | "pending" | "add";

/**
 * Properties for the FriendsHeader component.
 *
 * @interface FriendsHeaderProps
 * @property {TabType} activeTab - The currently active friends tab identifier.
 * @property {(tab: TabType) => void} setActiveTab - Callback function to update the active friends tab.
 * @property {number} [allCount=0] - The total number of friends.
 * @property {number} [pendingCount=0] - The number of pending friend requests.
 */
interface FriendsHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  allCount?: number;
  pendingCount?: number;
}

/**
 * Renders a responsive sub-header with tabs for navigating between all friends, pending requests, and adding a friend.
 *
 * @param {FriendsHeaderProps} props - The component props.
 * @param {TabType} props.activeTab - The currently active tab.
 * @param {(tab: TabType) => void} props.setActiveTab - Function to change the active tab.
 * @param {number} [props.allCount=0] - Total count of all friends.
 * @param {number} [props.pendingCount=0] - Count of pending friend requests.
 * @returns {JSX.Element} The rendered friends navigation header component.
 */
export function FriendsHeader({
  activeTab,
  setActiveTab,
  allCount = 0,
  pendingCount = 0,
}: FriendsHeaderProps) {
  return (
    <nav
      aria-label="Friends navigation"
      className="flex items-center gap-2 h-12"
    >
      {/* Title / Icon Indicator */}
      <div className="flex items-center gap-2.5 pr-3 border-r border-muted/20 text-foreground font-bold tracking-wide">
        <Users className="w-5 h-5 text-accent" />
        <span className="hidden sm:inline text-sm">Friends</span>
      </div>

      {/* Tabs Container */}
      <div className="flex items-center gap-1.5 text-sm font-medium">
        {/* All Friends Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-2 active:scale-95 ${
            activeTab === "all"
              ? "bg-surface text-foreground shadow-sm font-semibold"
              : "text-muted hover:bg-surface/50 hover:text-foreground"
          }`}
        >
          <span>All</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeTab === "all"
                ? "bg-muted/20 text-foreground"
                : "bg-surface text-muted"
            }`}
          >
            {allCount}
          </span>
        </button>

        {/* Pending Requests Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-95 ${
            activeTab === "pending"
              ? "bg-surface text-foreground shadow-sm font-semibold"
              : "text-muted hover:bg-surface/50 hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4 hidden sm:block opacity-70" />
          <span>Pending</span>
          {pendingCount > 0 && (
            <span className="bg-destructive text-foreground text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <span className="mx-1"></span>

        {/* Add Friend Tab */}
        <ActionButton
          type="button"
          variant="primary"
          onClick={() => setActiveTab("add")}
          size="sm"
        >
          <span className="inline sm:hidden">Add</span>
          <span className="hidden sm:inline">Add Friend</span>
        </ActionButton>
      </div>
    </nav>
  );
}
