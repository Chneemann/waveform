/**
 * @file components/layout/MemberSidebar.tsx
 * @description Sidebar component displaying the server member list directly from activeServer context.
 */

"use client";

import { useEffect, useRef } from "react";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { useActiveServer } from "@/lib/context/ServerContext";
import { MemberList } from "@/components/members/MemberList";
import { X } from "lucide-react";
import { clsx } from "clsx";

/** Props for the MemberHeader component. */
interface MemberHeaderProps {
  title: string;
  onClose: () => void;
}

/** Header component for the member sidebar with close button. */
function MemberHeader({ title, onClose }: MemberHeaderProps) {
  return (
    <div className="h-14 border-b border-surface/50 flex items-center justify-between px-4 shrink-0">
      <span className="font-semibold text-xs text-muted uppercase tracking-wider">
        Members
      </span>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-md text-muted hover:text-white hover:bg-background transition-colors cursor-pointer"
        title={title}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

/** Sidebar component displaying active server members with responsive drawer behavior. */
export function MemberSidebar() {
  const { isMembersOpen, closeMembers } = useSidebarStore();
  const { activeServer } = useActiveServer();
  const desktopSidebarRef = useRef<HTMLElement>(null);
  const members = activeServer?.members ?? [];

  /** Closes the members sidebar when clicking outside of it. */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (document.querySelector("[data-user-profile-popover]") !== null) {
        return;
      }

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

  return (
    <>
      {isMembersOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={closeMembers}
        />
      )}

      <aside
        ref={desktopSidebarRef}
        className={clsx(
          "fixed inset-y-0 right-0 z-40 sm:static sm:z-20 flex flex-col h-full bg-surface shrink-0 transition-all duration-300 ease-in-out border-l border-surface/50 overflow-hidden",
          isMembersOpen
            ? "w-full sm:w-60 opacity-100"
            : "w-0 opacity-0 pointer-events-none border-l-0",
        )}
      >
        <div className="w-full sm:w-60 flex flex-col h-full">
          <MemberHeader
            title="Mitgliederliste einklappen"
            onClose={closeMembers}
          />
          <div className="flex-1 overflow-y-auto">
            <MemberList members={members} />
          </div>
        </div>
      </aside>
    </>
  );
}
