/**
 * @file components/layout/MemberSidebar.tsx
 * @description Layout sidebar container handling member fetching, responsive drawers, and click-outside dismissal.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { useActiveServer } from "@/lib/context/ServerContext";
import { MemberList } from "@/components/members/MemberList";
import type { Member } from "@/components/members/MemberItem";
import { X, Loader2 } from "lucide-react";
import { clsx } from "clsx";

/**
 * Properties for the MemberHeader component.
 *
 * @interface MemberHeaderProps
 * @property {string} title - The tooltip or accessibility title for the close button.
 * @property {() => void} onClose - Callback function triggered when the close button is clicked.
 */
interface MemberHeaderProps {
  title: string;
  onClose: () => void;
}

/**
 * Renders the header section of the member sidebar with a title and close button.
 *
 * @param {MemberHeaderProps} props - Component properties.
 * @returns {JSX.Element} The rendered member header element.
 */
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

/**
 * Displays the list of members for the active server in a responsive sidebar or drawer layout.
 *
 * @returns {JSX.Element} The rendered member sidebar component.
 */
export function MemberSidebar() {
  const { isMembersOpen, closeMembers } = useSidebarStore();
  const { activeServer } = useActiveServer();
  const desktopSidebarRef = useRef<HTMLElement>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeServer?.id) {
      setMembers([]);
      return;
    }

    const controller = new AbortController();

    async function fetchMembers() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/servers/${activeServer?.id}/members`, {
          signal: controller.signal,
        });

        if (res.ok) {
          const data: Member[] = await res.json();
          setMembers(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error loading members:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();

    return () => {
      controller.abort();
    };
  }, [activeServer?.id]);

  useEffect(() => {
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
   * Renders either a loading spinner or the populated member list depending on state.
   *
   * @returns {JSX.Element} The active content component.
   */
  const renderContent = () => {
    if (isLoading && members.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      );
    }
    return <MemberList members={members} />;
  };

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
          <MemberHeader
            title="Mitgliederliste einklappen"
            onClose={closeMembers}
          />
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
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
        <MemberHeader title="Schließen" onClose={closeMembers} />
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </>
  );
}
