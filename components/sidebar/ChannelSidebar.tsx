/**
 * @file components/sidebar/ChannelSidebar.tsx
 * @description Channel sidebar component listing categories and channels with actions for creation and editing.
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveServer } from "@/lib/context/ServerContext";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { EditChannelModal } from "@/components/modals/EditChannelModal";
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Plus,
  Settings,
} from "lucide-react";
import type { Channel } from "@/db/schema";
import Link from "next/link";

/** Renders the channel navigation sidebar for the active server. */
export function ChannelSidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  const params = useParams();
  const currentChannelId = params?.channelId as string;
  const { activeServer } = useActiveServer();
  const { closeNav, toggleNav } = useSidebarStore();

  if (!activeServer) return null;

  /** Toggles the collapsed state of a channel category. */
  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  /** Handles mobile navigation closure when clicking a channel link. */
  const handleChannelClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      closeNav();
    }
  };

  /** Opens the edit channel modal for a specific channel. */
  const handleOpenSettings = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChannel(channel);
  };

  /** Opens the create channel modal for a specific category or uncategorized. */
  const handleOpenCreateModal = (categoryId: string | null = null) => {
    setSelectedCategoryId(categoryId);
    setIsCreateModalOpen(true);
  };

  const uncategorizedChannels = activeServer.channels.filter(
    (c) => !c.categoryId,
  );

  const categoriesList = (activeServer.categories || []).map((cat) => ({
    ...cat,
    channels: activeServer.channels.filter((c) => c.categoryId === cat.id),
  }));

  /** Renders an individual channel item in the list. */
  const renderChannelItem = (channel: Channel) => {
    const isActive = currentChannelId === channel.id;
    return (
      <Link
        key={channel.id}
        href={`/servers/${activeServer.id}/channels/${channel.id}`}
        onClick={handleChannelClick}
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
            onClick={(e) => handleOpenSettings(e, channel)}
            className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-white focus:outline-none transition-all cursor-pointer shrink-0 ml-2"
            aria-label="Channel Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
      </Link>
    );
  };

  return (
    <>
      <div className="flex-1 w-full bg-surface/50 border-r border-background flex flex-col h-full min-w-0 overflow-hidden">
        {/* Server Header */}
        <div className="h-14 border-b border-background flex items-center justify-between px-4 font-bold text-white shadow-sm shrink-0">
          <span className="truncate">{activeServer.name}</span>
          <button
            type="button"
            onClick={toggleNav}
            title="Collapse the sidebar"
            className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer shrink-0"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-muted px-1 py-1 uppercase tracking-wider group">
              <button
                type="button"
                onClick={() => toggleCategory("uncategorized")}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer min-w-0 truncate"
              >
                {collapsedCategories["uncategorized"] ? (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">Text Channels</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenCreateModal(null)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
                aria-label="Create channel"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {!collapsedCategories["uncategorized"] && (
              <div className="space-y-0.5 pl-2">
                {uncategorizedChannels.map(renderChannelItem)}
              </div>
            )}
          </div>

          {/* 2. Custom Kategorien */}
          {categoriesList.map((category) => {
            const isCollapsed = collapsedCategories[category.id];

            return (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-muted px-1 py-1 uppercase tracking-wider group">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer min-w-0 truncate"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{category.name}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(category.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
                    aria-label="Channel in Kategorie erstellen"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="space-y-0.5 pl-2">
                    {category.channels.map(renderChannelItem)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        serverId={activeServer.id}
        defaultCategoryId={selectedCategoryId}
      />

      <EditChannelModal
        isOpen={!!editingChannel}
        onClose={() => setEditingChannel(null)}
        channel={editingChannel}
      />
    </>
  );
}
