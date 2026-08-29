/**
 * @file components/sidebar/UserPanel.tsx
 * @description Client component providing a footer user panel with session information, avatar display, online status, and settings/logout actions.
 */

"use client";

import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

/**
 * Renders the user panel footer component showing current session profile details and authentication controls.
 *
 * @returns {JSX.Element} The rendered user panel component.
 */
export function UserPanel() {
  const { data: session } = useSession();

  /**
   * Triggers the NextAuth sign-out procedure and redirects the user to the login page.
   */
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const username = session?.user?.name || "User";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="p-2 w-full bg-surface shrink-0">
      <footer className="h-14 bg-background/80 hover:bg-background/90 border border-background/50 rounded-xl flex items-center justify-between px-3 gap-2 shadow-lg backdrop-blur-md transition-all duration-200">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs shadow-sm transition-transform group-hover:scale-105">
              {userInitial}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
              {username}
            </p>
            <p className="text-xs text-muted truncate leading-tight font-medium">
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 text-muted hover:text-foreground focus:outline-none cursor-pointer transition-colors"
            aria-label="User Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
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
