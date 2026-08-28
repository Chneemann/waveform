/**
 * @file components/sidebar/ChannelSidebar.tsx
 * @description Sidebar component for server navigation, rendering channel lists.
 */

import { Hash } from "lucide-react";

/**
 * Navigation sidebar displaying server details and text channels.
 *
 * @returns {JSX.Element} The rendered channel sidebar element.
 */
export function ChannelSidebar() {
  return (
    <aside className="w-60 bg-surface flex flex-col border-r border-background shrink-0 h-full">
      <header className="h-12 border-b border-background flex items-center px-4 font-semibold text-foreground shrink-0">
        Waveform Community
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Text Channels
          </h2>
          <nav className="space-y-0.5">
            <button className="w-full text-left px-2 py-1.5 rounded text-muted hover:bg-background hover:text-foreground font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer">
              <Hash className="w-4 h-4 text-muted shrink-0" />
              <span className="truncate">general</span>
            </button>
            <button className="w-full text-left px-2 py-1.5 rounded text-muted hover:bg-background hover:text-foreground font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer">
              <Hash className="w-4 h-4 text-muted shrink-0" />
              <span className="truncate">dev-talk</span>
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}
