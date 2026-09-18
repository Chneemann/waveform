/**
 * @file components/members/MemberItem.tsx
 * @description Member item component rendering user details with role badge and popover toggle.
 */

"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { UserAvatar } from "../ui/UserAvatar";
import { UserProfilePopover } from "../ui/UserProfilePopover";
import {
  ServerMemberWithUser,
  useActiveServer,
} from "@/lib/context/ServerContext";
import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { useUser } from "@/lib/context/UserContext";
import { Crown, ShieldCheck } from "lucide-react";
import { Member } from "@/db/schema";

/** Renders an individual member item with an interactive user profile popover and role badge. */
export function MemberItem({ member }: { member: ServerMemberWithUser }) {
  const router = useRouter();
  const { setActiveServer } = useActiveServer();
  const { closeMembers } = useSidebarStore();
  const { currentUser, friendships } = useUser();

  const currentUserId = currentUser.id;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /** Map of server member roles to their corresponding icon elements. */
  const ROLE_ICONS: Partial<Record<Member["role"], ReactNode>> = {
    OWNER: <Crown className="w-4 h-4 text-amber-400" />,
    MODERATOR: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
  };

  /** Closes popover on click outside or ESC key press. */
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
    if (!member.id || member.id === currentUserId || !friendships) {
      return null;
    }

    const friendship = friendships.find(
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
          "w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group text-left focus:outline-none",
          member.status == "OFFLINE" && "opacity-50",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <UserAvatar user={member} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
              {member.username}
            </p>
            <p className="text-xs text-muted truncate leading-tight font-medium capitalize">
              {member.role.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Role Badges & Icons */}
        <div className="shrink-0 ml-1 flex items-center gap-1">
          {ROLE_ICONS[member.role]}
        </div>
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
