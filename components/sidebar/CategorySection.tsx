/**
 * @file components/sidebar/CategorySection.tsx
 * @description Sub-component for rendering a category group and its list of channels with persistent collapse state and animations.
 */

"use client";

import { ChevronDown, Plus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChannelItem } from "./ChannelItem";
import type { Channel } from "@/db/schema";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

interface CategorySectionProps {
  id: string;
  title: string;
  channels: Channel[];
  currentChannelId: string;
  serverId: string;
  onCloseNav: () => void;
  onCreateChannel: () => void;
  onEditChannel: (channel: Channel) => void;
  onEditCategory?: () => void;
}

/** Renders a collapsible category section with persistent collapse state and smooth animation. */
export function CategorySection({
  id,
  title,
  channels,
  currentChannelId,
  serverId,
  onCloseNav,
  onCreateChannel,
  onEditChannel,
  onEditCategory,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    `category_collapsed_${id}`,
    false,
  );

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleChannelClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      onCloseNav();
    }
  };

  const handleOpenChannelSettings = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    e.stopPropagation();
    onEditChannel(channel);
  };

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
          onClick={toggleCollapsed}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer min-w-0 truncate"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? -90 : 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
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

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden space-y-0.5 pl-2"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
