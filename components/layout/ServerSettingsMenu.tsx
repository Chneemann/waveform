/**
 * @file components/layout/ServerSettingsMenu.tsx
 * @description Header menu button providing server-level action options like deleting a server.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Trash2 } from "lucide-react";
import { DeleteServerModal } from "@/components/modals/DeleteServerModal";

/**
 * Props for the ServerSettingsMenu component.
 *
 * @interface ServerSettingsMenuProps
 * @property {string} serverId - The unique identifier of the server.
 * @property {string} serverName - The name of the server used for display and verification during deletion.
 */
interface ServerSettingsMenuProps {
  serverId: string;
  serverName: string;
}

/**
 * Renders a dropdown menu button for server settings, including an option to open the server deletion modal.
 *
 * @param {ServerSettingsMenuProps} props - The component props.
 * @param {string} props.serverId - The unique identifier of the server.
 * @param {string} props.serverName - The display name of the server.
 * @returns {JSX.Element} The rendered server settings dropdown menu and modal component.
 */
export function ServerSettingsMenu({
  serverId,
  serverName,
}: ServerSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    /**
     * Handles mouse click events outside of the menu container to close the dropdown.
     *
     * @param {MouseEvent} event - The mouse click event object.
     */
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Server Settings"
        className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-surface/50 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsDeleteModalOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Server
          </button>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteServerModal
        isOpen={isDeleteModalOpen}
        serverId={serverId}
        serverName={serverName}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
