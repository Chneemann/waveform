/**
 * @file components/sidebar/ChannelSidebar.tsx
 * @description Channel sidebar component rendering categories, channels, and modals for creation and editing.
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveServer } from "@/lib/context/ServerContext";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";
import { EditChannelModal } from "@/components/modals/EditChannelModal";
import { EditCategoryModal } from "@/components/modals/EditCategoryModal";
import { CategorySection } from "./CategorySection";
import { PanelLeftClose } from "lucide-react";
import type { Category, Channel } from "@/db/schema";

/** Renders the channel sidebar navigation for the active server. */
export function ChannelSidebar() {
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const params = useParams();
  const currentChannelId = params?.channelId as string;
  const { activeServer } = useActiveServer();
  const { closeNav, toggleNav } = useSidebarStore();

  if (!activeServer) return null;

  /** Opens the create channel modal for an optional category. */
  const openCreateChannel = (catId: string | null = null) => {
    setSelectedCategoryId(catId);
    setIsCreateChannelOpen(true);
  };

  const uncategorizedChannels = activeServer.channels.filter(
    (c) => !c.categoryId,
  );
  const categories = (activeServer.categories || []).map((cat) => ({
    ...cat,
    channels: activeServer.channels.filter((c) => c.categoryId === cat.id),
  }));

  return (
    <>
      <div className="flex-1 w-full bg-surface/50 border-r border-background flex flex-col h-full min-w-0 overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-background flex items-center justify-between px-4 font-bold text-white shadow-sm shrink-0">
          <span className="truncate">{activeServer.name}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleNav}
              className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer shrink-0"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 min-w-0">
          {/* Uncategorized channels */}
          <CategorySection
            id="uncategorized"
            title="Text Channels"
            channels={uncategorizedChannels}
            currentChannelId={currentChannelId}
            serverId={activeServer.id}
            onCloseNav={closeNav}
            onCreateChannel={() => openCreateChannel(null)}
            onEditChannel={setEditingChannel}
          />

          {/* Custom categories */}
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              id={category.id}
              title={category.name}
              channels={category.channels}
              currentChannelId={currentChannelId}
              serverId={activeServer.id}
              onCloseNav={closeNav}
              onCreateChannel={() => openCreateChannel(category.id)}
              onEditChannel={setEditingChannel}
              onEditCategory={() => setEditingCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        serverId={activeServer.id}
      />
      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
      />
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
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
