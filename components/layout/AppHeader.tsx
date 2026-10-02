/**
 * @file components/layout/AppHeader.tsx
 * @description Application top header component providing navigation controls, dynamic channel or friend tab titles, optional server settings, member list toggles, and legal views support.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Users,
  Hash,
  Settings,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { ServerSettingsMenu } from "./ServerSettingsMenu";
import { FriendsHeader, TabType } from "@/components/friends/FriendsHeader";

/** Properties for the AppHeader component. */
interface AppHeaderProps {
  title?: string;
  showMembersButton?: boolean;
  server?: {
    id: string;
    name: string;
    color: string;
  };
  showFriendsTabs?: boolean;
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
  allCount?: number;
  pendingCount?: number;
  isSettings?: boolean;
  isLegalImprint?: boolean;
  isLegalPrivacy?: boolean;
}

/** Renders the application header with navigation controls, dynamic titles, tabs, and action buttons. */
export function AppHeader({
  title,
  showMembersButton = false,
  server,
  showFriendsTabs = false,
  activeTab,
  setActiveTab,
  allCount = 0,
  pendingCount = 0,
  isSettings = false,
  isLegalImprint = false,
  isLegalPrivacy = false,
}: AppHeaderProps) {
  const { isNavOpen, toggleNav, toggleMembers } = useSidebarStore();

  const isLegalView = isLegalImprint || isLegalPrivacy;

  const hasContent =
    !isNavOpen ||
    !!title ||
    showMembersButton ||
    !!server ||
    showFriendsTabs ||
    isSettings ||
    isLegalView;

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

        {/* Settings View Header Title */}
        {isSettings && (
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <Settings className="w-4 h-4 text-muted shrink-0" />
            <h1 className="font-bold text-white text-base truncate">
              Settings
            </h1>
          </div>
        )}

        {/* Legal Imprint Header Title */}
        {isLegalImprint && (
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <FileText className="w-4 h-4 text-muted shrink-0" />
            <h1 className="font-bold text-white text-base truncate">Imprint</h1>
          </div>
        )}

        {/* Legal Privacy Header Title */}
        {isLegalPrivacy && (
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <ShieldCheck className="w-4 h-4 text-muted shrink-0" />
            <h1 className="font-bold text-white text-base truncate">
              Privacy Policy
            </h1>
          </div>
        )}

        {/* Dynamic Channel Title */}
        {!isSettings && !isLegalView && title && (
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <Hash className="w-4 h-4 text-muted shrink-0" />
            <h1 className="font-bold text-white text-base truncate">{title}</h1>
          </div>
        )}

        {/* Friends Header Component */}
        {!isSettings &&
          !isLegalView &&
          showFriendsTabs &&
          setActiveTab &&
          activeTab && (
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
          <ServerSettingsMenu
            serverId={server.id}
            serverName={server.name}
            serverColor={server.color}
          />
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
