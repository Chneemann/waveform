/**
 * @file components/sidebar/ChannelSidebar.tsx
 * @description Sidebar component displaying server channels, navigation toggles, and modal triggers.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActiveServer } from "@/lib/context/ServerContext";
import { DirectMessageSidebar } from "@/components/sidebar/DirectMessageSidebar";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { PanelLeftClose, Plus } from "lucide-react";

/**
 * Renders the channel sidebar for active servers, allowing users to navigate channels or create new ones.
 *
 * @returns {JSX.Element} The rendered channel sidebar container.
 */
export function ChannelSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const currentChannelId = params?.channelId as string;
  const { activeServer } = useActiveServer();
  const { closeNav, toggleNav } = useSidebarStore();

  /**
   * Handles channel selection clicks, closing the mobile navigation sidebar on smaller viewports.
   *
   * @function handleChannelClick
   * @returns {void}
   */
  const handleChannelClick = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      closeNav();
    }
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
              onClick={() => setIsModalOpen(true)}
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
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all group ${
                    isActive
                      ? "bg-accent/50 text-white font-medium"
                      : "text-muted hover:bg-surface hover:text-white"
                  }`}
                >
                  <span className="text-muted group-hover:text-white text-base">
                    #
                  </span>
                  <span className="truncate">{channel.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serverId={activeServer.id}
      />
    </>
  );
}
