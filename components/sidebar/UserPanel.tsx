/**
 * @file components/sidebar/UserPanel.tsx
 * @description Client component providing a footer user panel with session information, avatar display, online status, and settings/logout actions.
 */

"use client";

import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function UserPanel() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { user } = session;

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
            onClick={() => signOut({ callbackUrl: "/login" })}
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
