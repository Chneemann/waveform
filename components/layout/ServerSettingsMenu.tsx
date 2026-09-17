/**
 * @file components/layout/ServerSettingsMenu.tsx
 * @description Single settings dropdown menu providing server management actions (Settings, Create Category, Create Channel).
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, FolderPlus, PlusCircle, Sliders } from "lucide-react";
import { EditServerModal } from "@/components/modals/EditServerModal";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";

/** Props for the ServerSettingsMenu component. */
interface ServerSettingsMenuProps {
  serverId: string;
  serverName: string;
}

/** Renders a server management dropdown menu with modal triggers for channel, category, and server settings. */
export function ServerSettingsMenu({
  serverId,
  serverName,
}: ServerSettingsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditServerOpen, setIsEditServerOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicked outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        title="Server-Optionen"
        className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Dropdown Menü */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-surface border border-background rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsCreateChannelOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-white hover:bg-background transition-colors text-left cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Kanal erstellen</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsCreateCategoryOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-white hover:bg-background transition-colors text-left cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Kategorie erstellen</span>
          </button>

          <div className="my-1 border-t border-background" />

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsEditServerOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-white hover:bg-background transition-colors text-left cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Servereinstellungen</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <EditServerModal
        isOpen={isEditServerOpen}
        serverId={serverId}
        initialName={serverName}
        onClose={() => setIsEditServerOpen(false)}
      />
      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        serverId={serverId}
      />
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        serverId={serverId}
      />
    </div>
  );
}
