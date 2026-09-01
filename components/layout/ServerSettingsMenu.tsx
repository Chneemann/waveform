/**
 * @file components/layout/ServerSettingsMenu.tsx
 * @description Header button triggering the server overview/settings modal.
 */

"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { EditServerModal } from "@/components/modals/EditServerModal";

/**
 * Props for the ServerSettingsMenu component.
 *
 * @interface ServerSettingsMenuProps
 * @property {string} serverId - The unique identifier of the server.
 * @property {string} serverName - The display name of the server.
 */
interface ServerSettingsMenuProps {
  serverId: string;
  serverName: string;
}

/**
 * Renders a settings button that opens the edit server modal.
 *
 * @param {ServerSettingsMenuProps} props - The component props.
 * @param {string} props.serverId - The unique identifier of the server.
 * @param {string} props.serverName - The display name of the server.
 * @returns {JSX.Element} The rendered server settings trigger and modal component.
 */
export function ServerSettingsMenu({
  serverId,
  serverName,
}: ServerSettingsMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Server Settings"
        className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>

      <EditServerModal
        isOpen={isModalOpen}
        serverId={serverId}
        initialName={serverName}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
