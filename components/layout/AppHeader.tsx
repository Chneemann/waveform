/**
 * @file components/layout/AppHeader.tsx
 * @description Application top header component providing navigation controls, dynamic channel or friend tab titles, and optional server settings or member list toggles.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { PanelLeftOpen, PanelLeftClose, Users, Hash } from "lucide-react";
import { ServerSettingsMenu } from "./ServerSettingsMenu";
import { FriendsHeader, TabType } from "@/components/friends/FriendsHeader";

/**
 * Properties for the AppHeader component.
 *
 * @interface AppHeaderProps
 * @property {string} [title] - The title of the current channel or view.
 * @property {boolean} [showMembersButton=false] - Whether to show the button that toggles the members sidebar.
 * @property {{ id: string; name: string }} [server] - Optional server configuration object containing its unique identifier and name.
 * @property {boolean} [showFriendsTabs=false] - Whether to display the friends navigation tabs in the header.
 * @property {TabType} [activeTab] - The currently active friends tab identifier.
 * @property {(tab: TabType) => void} [setActiveTab] - Callback function to update the active friends tab.
 * @property {number} [allCount=0] - The total number of friends.
 * @property {number} [pendingCount=0] - The number of pending friend requests.
 */
interface AppHeaderProps {
  title?: string;
  showMembersButton?: boolean;
  server?: {
    id: string;
    name: string;
  };
  showFriendsTabs?: boolean;
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
  allCount?: number;
  pendingCount?: number;
}

/**
 * Renders the application header with navigation controls, dynamic titles, tabs, and action buttons.
 *
 * @param {AppHeaderProps} props - The component props.
 * @param {string} [props.title] - The title of the current channel or view.
 * @param {boolean} [props.showMembersButton=false] - Whether to show the members list toggle button.
 * @param {{ id: string; name: string }} [props.server] - Optional server details object.
 * @param {boolean} [props.showFriendsTabs=false] - Whether to display the friends tabs.
 * @param {TabType} [props.activeTab] - The active friends tab.
 * @param {(tab: TabType) => void} [props.setActiveTab] - Function to change the active friends tab.
 * @param {number} [props.allCount=0] - Count of all friends.
 * @param {number} [props.pendingCount=0] - Count of pending friend requests.
 * @returns {JSX.Element} The rendered application header container.
 */
export function AppHeader({
  title,
  showMembersButton = false,
  server,
  showFriendsTabs = false,
  activeTab,
  setActiveTab,
  allCount = 0,
  pendingCount = 0,
}: AppHeaderProps) {
  const { isNavOpen, toggleNav, toggleMembers } = useSidebarStore();

  const hasContent =
    !isNavOpen || !!title || showMembersButton || !!server || showFriendsTabs;

  return (
    <div
      className={`flex items-center justify-between bg-background shrink-0 pb-3 h-12 ${
        hasContent ? "border-b border-muted/50" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        {/* Toggle button for navigation */}
        <button
          type="button"
          onClick={toggleNav}
          title={isNavOpen ? "Collapse navigation" : "Expand Navigation"}
          className={`p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer shrink-0 ${
            isNavOpen ? "md:hidden" : "block"
          }`}
        >
          {isNavOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        {/* Dynamic Channel Title */}
        {title && (
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <Hash className="w-4 h-4 text-muted shrink-0" />
            <h1 className="font-bold text-white text-base truncate">{title}</h1>
          </div>
        )}

        {/* Friends Header Component */}
        {showFriendsTabs && setActiveTab && activeTab && (
          <FriendsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allCount={allCount}
            pendingCount={pendingCount}
          />
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {server && (
          <ServerSettingsMenu serverId={server.id} serverName={server.name} />
        )}

        {showMembersButton && (
          <button
            type="button"
            onClick={toggleMembers}
            title="Toggle Member List"
            className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
          >
            <Users className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
