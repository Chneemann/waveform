/**
 * @file components/members/MemberItem.tsx
 * @description Member item component rendering user details with popover toggle for profile views and direct actions.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/db/schema";
import { clsx } from "clsx";
import { UserAvatar } from "../ui/UserAvatar";
import { UserProfilePopover } from "../ui/UserProfilePopover";
import { useActiveServer } from "@/lib/context/ServerContext";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";

/** Props for the MemberItem component. */
interface MemberItemProps {
  member: User;
  currentUserId: string;
  userFriendships: Array<{
    senderId: string;
    receiverId: string;
    status: string;
  }>;
  isOffline?: boolean;
}

/** Renders an individual member item with an interactive user profile popover. */
export function MemberItem({
  member,
  currentUserId,
  userFriendships = [],
  isOffline = false,
}: MemberItemProps) {
  const router = useRouter();
  const { setActiveServer } = useActiveServer();
  const { closeMembers } = useSidebarStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popover on click outside or ESC key press
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  /** Determines the friendship status between the logged-in user and this member. */
  const getFriendshipStatus = () => {
    if (!member.id || member.id === currentUserId || !userFriendships) {
      return null;
    }

    const friendship = userFriendships.find(
      (f) =>
        (f.senderId === member.id && f.receiverId === currentUserId) ||
        (f.receiverId === member.id && f.senderId === currentUserId),
    );

    return friendship ? friendship.status : null;
  };

  /** Initiates or navigates to a direct message conversation with the target member. */
  const handleStartConversation = async (recipientId: string) => {
    try {
      const res = await fetch("/api/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        setActiveServer(null);
        closeMembers();
        router.push(`/dm/${conversation.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  /** Sends a friend request to the specified username. */
  const handleAddFriend = async (username: string) => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className={clsx(
          "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group text-left focus:outline-none",
          isOffline && "opacity-60",
        )}
      >
        <div className="relative shrink-0">
          <UserAvatar user={member} size="md" />
        </div>
        <span className="text-sm font-medium text-muted group-hover:text-white truncate">
          {member.username}
        </span>
      </button>

      {isProfileOpen && (
        <UserProfilePopover
          user={member}
          currentUserId={currentUserId}
          triggerRef={triggerRef}
          friendshipStatus={getFriendshipStatus()}
          onDirectMessage={handleStartConversation}
          onAddFriend={handleAddFriend}
        />
      )}
    </div>
  );
}
