/**
 * @file components/sidebar/UserPanel.tsx
 * @description Client component providing a footer user panel with session information, avatar display, online status, and settings/logout actions.
 */

"use client";

import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserStatus } from "@/db/schema";

/**
 * Props for the UserPanel component.
 */
interface UserPanelProps {
  /** User details including username, avatar color, and online status. */
  user: {
    username: string;
    color: string;
    status: UserStatus;
  };
}

/**
 * Renders the user panel footer containing the user's avatar, status, and action buttons.
 *
 * @param {UserPanelProps} props - Component properties.
 * @returns {JSX.Element} The rendered user panel component.
 */
export function UserPanel({ user }: UserPanelProps) {
  /**
   * Handles user logout by invalidating the local session and redirecting to the login page.
   */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="p-2 w-full bg-surface shrink-0">
      <footer className="h-14 bg-background/80 hover:bg-background/90 border border-background/50 rounded-xl flex items-center justify-between px-3 gap-2 shadow-lg backdrop-blur-md transition-all duration-200">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group">
          <UserAvatar
            user={user}
            size="sm"
            className="transition-transform group-hover:scale-105"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
              {user.username}
            </p>
            <p className="text-xs text-muted truncate leading-tight font-medium capitalize">
              {user.status.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 text-muted hover:text-foreground focus:outline-none cursor-pointer transition-colors"
            aria-label="User Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-muted hover:text-red-400 focus:outline-none cursor-pointer transition-colors"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
