/**
 * @file components/sidebar/UserProfile.tsx
 * @description User profile component rendered at the bottom of the sidebar, displaying user avatar, status indicator, username, and settings action trigger.
 */

import { Settings } from "lucide-react";

/**
 * Renders the user profile card with user information, online status, and quick access settings.
 *
 * @returns {JSX.Element} The rendered user profile footer element.
 */
export function UserProfile() {
  return (
    <div className="p-2 w-full bg-surface shrink-0">
      <footer className="h-14 bg-background/80 hover:bg-background/90 border border-background/50 rounded-xl flex items-center justify-between px-3 gap-2 shadow-lg backdrop-blur-md transition-all duration-200">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs shadow-sm transition-transform group-hover:scale-105">
              U
            </div>
            {/* Online Status Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
              Username
            </p>
            <p className="text-xs text-muted truncate leading-tight font-medium">
              Online
            </p>
          </div>
        </div>

        <button
          className="p-1.5 text-muted hover:text-foreground focus:outline-none cursor-pointer"
          aria-label="User Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
