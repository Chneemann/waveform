/**
 * @file components/layout/AppHeader.tsx
 * @description Unified application header supporting general views, chat channels, and DM views.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { PanelLeftOpen, PanelLeftClose, Users, Hash } from "lucide-react";

/**
 * Properties for the AppHeader component.
 *
 * @interface AppHeaderProps
 * @property {string} [title] - Optional channel or page title to display in the header.
 * @property {boolean} [showMembersButton=false] - Flag indicating whether to display the member list toggle button.
 */
interface AppHeaderProps {
  title?: string;
  showMembersButton?: boolean;
}

/**
 * Renders the application header bar with navigation controls, dynamic page titles, and member list toggle capability.
 *
 * @param {AppHeaderProps} props - The component props.
 * @param {string} [props.title] - Optional channel or page title to display.
 * @param {boolean} [props.showMembersButton=false] - Whether to show the button toggling the right sidebar/member panel.
 * @returns {JSX.Element} The header component visual structure.
 */
export function AppHeader({
  title,
  showMembersButton = false,
}: AppHeaderProps) {
  const { isNavOpen, toggleNav, toggleMembers } = useSidebarStore();

  const hasContent = !isNavOpen || !!title || showMembersButton;

  return (
    <div
      className={`flex items-center justify-between bg-background shrink-0 pb-2 ${
        hasContent ? "border-b border-muted/50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Toggle button for navigation */}
        <button
          type="button"
          onClick={toggleNav}
          title={isNavOpen ? "Collapse navigation" : "Expand Navigation"}
          className={`p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer ${
            isNavOpen ? "md:hidden" : "block"
          }`}
        >
          {isNavOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        {/* Dynamic Title (Channel/Page Name) */}
        {title && (
          <div className="flex items-center gap-1.5 ml-1">
            <Hash className="w-4 h-4 text-muted" />
            <h1 className="font-bold text-white text-base truncate">{title}</h1>
          </div>
        )}
      </div>

      {/* Button for the member bar */}
      {showMembersButton && (
        <button
          type="button"
          onClick={toggleMembers}
          title="Mitgliederliste umschalten"
          className="p-1.5 rounded-md text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
        >
          <Users className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
