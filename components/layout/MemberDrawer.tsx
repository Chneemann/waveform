/**
 * @file components/layout/MemberDrawer.tsx
 * @description Responsive drawer and sidebar component that manages the visibility, mobile overlay, click-outside dismissal, and rendering of the member list.
 */

"use client";

import { useEffect, useRef } from "react";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { MemberSidebar } from "@/components/sidebar/MemberSidebar";
import { X } from "lucide-react";
import { clsx } from "clsx";

/**
 * Renders the desktop sidebar panel and mobile drawer for displaying channel members, handling state triggers and click-outside closing logic.
 *
 * @returns {JSX.Element} The rendered member drawer component for desktop and mobile views.
 */
export function MemberDrawer() {
  const { isMembersOpen, closeMembers } = useSidebarStore();
  const desktopSidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /**
     * Handles mouse click events outside of the desktop sidebar to close it.
     *
     * @param {MouseEvent} event - The native DOM mouse event.
     */
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest('button[title*="Mitgliederliste"]')) return;

      if (
        isMembersOpen &&
        desktopSidebarRef.current &&
        !desktopSidebarRef.current.contains(target)
      ) {
        closeMembers();
      }
    }

    if (isMembersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMembersOpen, closeMembers]);

  /**
   * Internal header component for the member drawer containing title labeling and close action button.
   *
   * @param {Object} props - The component props.
   * @param {string} props.title - The tooltip title for the close button.
   * @returns {JSX.Element} The header element.
   */
  const Header = ({ title }: { title: string }) => (
    <div className="h-14 border-b border-surface/50 flex items-center justify-between px-4 shrink-0">
      <span className="font-semibold text-xs text-muted uppercase tracking-wider">
        Members
      </span>
      <button
        type="button"
        onClick={closeMembers}
        className="p-1.5 rounded-md text-muted hover:text-white hover:bg-background transition-colors cursor-pointer"
        title={title}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <aside
        ref={desktopSidebarRef}
        className={clsx(
          "hidden md:flex flex-col h-full bg-surface shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-l border-surface/50",
          isMembersOpen
            ? "w-60 opacity-100"
            : "w-0 opacity-0 pointer-events-none border-l-0",
        )}
      >
        <div className="w-60 flex flex-col h-full">
          <Header title="Mitgliederliste einklappen" />
          <div className="flex-1 overflow-y-auto">
            <MemberSidebar />
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMembersOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={closeMembers}
        />
      )}

      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-40 flex flex-col h-full w-screen sm:w-64 bg-surface transition-transform duration-200 ease-in-out md:hidden shadow-2xl border-l border-surface/50",
          isMembersOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Header title="Schließen" />
        <div className="flex-1 overflow-y-auto">
          <MemberSidebar />
        </div>
      </div>
    </>
  );
}
