/**
 * @file components/sidebar/ChannelSidebar.tsx
 * @description Sidebar component for navigating text channels within an active server, featuring channel creation, editing, and mobile responsiveness.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActiveServer } from "@/lib/context/ServerContext";
import { DirectMessageSidebar } from "@/components/sidebar/DirectMessageSidebar";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { EditChannelModal } from "@/components/modals/EditChannelModal";
import { PanelLeftClose, Plus, Settings } from "lucide-react";
import type { Channel } from "@/db/schema";

/**
 * Renders the channel sidebar for the active server with text channel lists, creation triggers, and settings handlers.
 *
 * @returns {JSX.Element} The rendered channel sidebar container.
 */
export function ChannelSidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

  const params = useParams();
  const currentChannelId = params?.channelId as string;
  const { activeServer } = useActiveServer();
  const { closeNav, toggleNav } = useSidebarStore();

  /**
   * Handles channel selection clicks, automatically closing the mobile navigation drawer on smaller screens.
   *
   * @function handleChannelClick
   * @returns {void}
   */
  const handleChannelClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      closeNav();
    }
  };

  /**
   * Opens the channel settings modal for the selected channel, preventing event propagation.
   *
   * @function handleOpenSettings
   * @param {React.MouseEvent} e - The mouse click event.
   * @param {Channel} channel - The channel object to edit.
   * @returns {void}
   */
  const handleOpenSettings = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChannel(channel);
  };

  if (!activeServer) {
    return <DirectMessageSidebar />;
  }

  return (
    <>
      <div className="flex-1 w-full md:w-72 bg-surface/50 border-r border-background flex flex-col h-full shrink-0">
        {/* Server Header */}
        <div className="h-14 border-b border-background flex items-center justify-between px-4 font-bold text-white shadow-sm">
          <span className="truncate">{activeServer.name}</span>
          <button
            type="button"
            onClick={toggleNav}
            title="Collapse the sidebar"
            className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted px-2 py-1 uppercase tracking-wider">
            <span>Text Channels</span>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1 rounded text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
              aria-label="Create channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-0.5">
            {activeServer.channels.map((channel) => {
              const isActive = currentChannelId === channel.id;

              return (
                <Link
                  key={channel.id}
                  href={`/servers/${activeServer.id}/channels/${channel.id}`}
                  onClick={handleChannelClick}
                  prefetch={false}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all group ${
                    isActive
                      ? "bg-accent/50 text-white font-medium"
                      : "text-muted hover:bg-surface hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-muted group-hover:text-white text-base">
                      #
                    </span>
                    <span className="truncate">{channel.name}</span>
                  </div>

                  {/* Gear Button */}
                  {!channel.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenSettings(e, channel)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-white focus:outline-none transition-all cursor-pointer"
                      aria-label="Channel Settings"
                      title="Channel Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        serverId={activeServer.id}
      />

      <EditChannelModal
        isOpen={!!editingChannel}
        onClose={() => setEditingChannel(null)}
        channel={editingChannel}
      />
    </>
  );
}
