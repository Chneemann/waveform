/**
 * @file components/sidebar/ChannelItem.tsx
 * @description Channel item component rendering channel links with active state styling and settings action.
 */

"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import type { Channel } from "@/db/schema";

/** Props for the ChannelItem component. */
interface ChannelItemProps {
  channel: Channel;
  serverId: string;
  isActive: boolean;
  onChannelClick: () => void;
  onOpenSettings: (e: React.MouseEvent, channel: Channel) => void;
}

/** Renders an individual channel item link with an optional settings trigger. */
export function ChannelItem({
  channel,
  serverId,
  isActive,
  onChannelClick,
  onOpenSettings,
}: ChannelItemProps) {
  return (
    <Link
      href={`/servers/${serverId}/channels/${channel.id}`}
      onClick={onChannelClick}
      prefetch={false}
      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-all group min-w-0 overflow-hidden ${
        isActive
          ? "bg-accent/50 text-white font-medium"
          : "text-muted hover:bg-surface hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <span className="text-muted group-hover:text-white text-base shrink-0">
          #
        </span>
        <span className="truncate">{channel.name}</span>
      </div>

      {!channel.isDefault && (
        <button
          type="button"
          onClick={(e) => onOpenSettings(e, channel)}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-white focus:outline-none transition-all cursor-pointer shrink-0 ml-2"
          aria-label="Channel Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      )}
    </Link>
  );
}
