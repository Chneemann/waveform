/**
 * @file components/ui/UserProfilePopover.tsx
 * @description User profile popover component displaying user details, email, and interactive options to message or add them as a friend.
 */

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { MessageSquare, UserPlus, Check, Clock, Loader2 } from "lucide-react";
import type { User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { ActionButton } from "./ActionButton";

/** Props for the UserProfilePopover component. */
interface UserProfilePopoverProps {
  user: User;
  currentUserId: string;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLDivElement | null>;
  friendshipStatus?: string | null;
  onDirectMessage?: (userId: string) => void;
  onAddFriend?: (username: string) => Promise<void> | void;
}

/** Popover component for displaying user info and quick actions. */
export function UserProfilePopover({
  user,
  currentUserId,
  triggerRef,
  friendshipStatus,
  onDirectMessage,
  onAddFriend,
}: UserProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const isSelf = user.id === currentUserId;
  const isAlreadyFriend = friendshipStatus === "ACCEPTED";
  const isPending = friendshipStatus === "PENDING" || justSent;
  const isButtonDisabled = isLoading || isAlreadyFriend || isPending;

  /** Precise positioning with Y- and X-axis corrections. */
  useLayoutEffect(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = triggerRect.bottom + 8;
    let left = triggerRect.left;

    if (top + popoverRect.height > viewportHeight - 16) {
      top = triggerRect.top - popoverRect.height - 8;
    }

    if (left + popoverRect.width > viewportWidth - 16) {
      left = viewportWidth - popoverRect.width - 16;
    }

    setCoords({ top, left });
    setIsVisible(true);
  }, [triggerRef]);

  /** Handles sending a friend request asynchronously. */
  const handleAddFriendClick = async () => {
    if (isButtonDisabled || !onAddFriend) return;
    setIsLoading(true);

    try {
      await onAddFriend(user.username);
      setJustSent(true);
    } catch (err) {
      console.error("Failed to add friend", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-user-profile-popover
      ref={popoverRef}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        opacity: isVisible ? 1 : 0,
      }}
      className="z-50 w-64 bg-background border border-surface/80 rounded-2xl p-4 shadow-2xl transition-opacity duration-75 pointer-events-auto"
    >
      <div className="flex items-center gap-3">
        <UserAvatar user={user} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {user.username}
          </p>
          <p className="text-xs text-muted truncate leading-tight font-medium capitalize">
            {user.status.toLowerCase()}
          </p>
        </div>
      </div>

      {!isSelf && (
        <div className="border-t border-surface/60 pt-3 mt-3 flex items-center gap-2">
          <ActionButton
            type="button"
            variant="primary"
            onClick={() => onDirectMessage?.(user.id)}
            icon={MessageSquare}
            size="sm"
            className="flex-1"
          >
            Message
          </ActionButton>

          <button
            type="button"
            disabled={isButtonDisabled}
            onClick={handleAddFriendClick}
            className={`flex items-center justify-center p-1.5 text-xs rounded-lg border transition-colors ${
              isButtonDisabled
                ? "bg-surface text-muted/50 border-transparent cursor-not-allowed"
                : "bg-surface hover:bg-surface/80 text-foreground hover:text-muted border-surface/80 cursor-pointer"
            }`}
            title={
              isAlreadyFriend
                ? "Already Friends"
                : isPending
                  ? "Request Pending"
                  : "Add Friend"
            }
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted" />
            ) : isAlreadyFriend ? (
              <Check className="w-3.5 h-3.5 text-accent" />
            ) : isPending ? (
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
