/**
 * @file components/sidebar/CategorySection.tsx
 * @description Sub-component for rendering a category group and its list of channels.
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { ChannelItem } from "./ChannelItem";
import type { Channel } from "@/db/schema";

/** Props for the CategorySection component. */
interface CategorySectionProps {
  title: string;
  channels: Channel[];
  currentChannelId: string;
  serverId: string;
  onCloseNav: () => void;
  onCreateChannel: () => void;
  onEditChannel: (channel: Channel) => void;
  onEditCategory?: () => void;
}

/** Renders a collapsible category section containing channels and contextual actions. */
export function CategorySection({
  title,
  channels,
  currentChannelId,
  serverId,
  onCloseNav,
  onCreateChannel,
  onEditChannel,
  onEditCategory,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  /** Handles closing mobile navigation when clicking a channel. */
  const handleChannelClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      onCloseNav();
    }
  };

  /** Opens settings for a specific channel. */
  const handleOpenChannelSettings = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    e.stopPropagation();
    onEditChannel(channel);
  };

  /** Opens settings for the current category. */
  const handleOpenCategorySettings = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEditCategory?.();
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-semibold text-muted px-1 py-1 uppercase tracking-wider group">
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer min-w-0 truncate"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="truncate">{title}</span>
        </button>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEditCategory && (
            <button
              type="button"
              onClick={handleOpenCategorySettings}
              className="p-0.5 rounded text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
              aria-label="Edit category"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onCreateChannel}
            className="p-0.5 rounded text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
            aria-label="Create channel in category"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-0.5 pl-2">
          {channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              serverId={serverId}
              isActive={currentChannelId === channel.id}
              onChannelClick={handleChannelClick}
              onOpenSettings={handleOpenChannelSettings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
