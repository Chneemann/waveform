/**
 * @file components/layout/UserPanel.tsx
 * @description User panel component displaying the current user's avatar, status, settings link, and logout button.
 */

"use client";

import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useUser } from "@/lib/context/UserContext";
import Link from "next/link";

/** Renders the bottom user panel with user information and quick action controls. */
export function UserPanel() {
  const { currentUser } = useUser();

  /** Handles logging out the user and redirecting to the login page. */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="p-2 w-full bg-surface shrink-0">
      <footer className="h-14 bg-background/80 hover:bg-background/90 border border-background/50 rounded-xl flex items-center justify-between px-3 gap-2 shadow-lg backdrop-blur-md transition-all duration-200">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group">
          <UserAvatar
            user={currentUser}
            size="sm"
            className="transition-transform group-hover:scale-105"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
              {currentUser.username}
            </p>
            <p className="text-xs text-muted truncate leading-tight font-medium capitalize">
              {currentUser.status.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/settings"
            className="p-1.5 text-muted hover:text-foreground focus:outline-none transition-colors"
            aria-label="User Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

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
