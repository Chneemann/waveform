/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component supporting editing, deletion, avatar rendering, and user profile popover with quick action triggers.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Message, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { ChatItemActions } from "./ChatItemActions";
import { ChatItemEdit } from "./ChatItemEdit";
import { UserProfilePopover } from "../ui/UserProfilePopover";
import { useActiveServer } from "@/lib/context/ServerContext";

/** Composite message type extending base database Message with channel/conversation details and member relation. */
export type MessageWithMember = Omit<Message, "channelId"> & {
  channelId?: string;
  conversationId?: string;
  type?: "chat" | "dm";
  member: {
    id: string;
    role: string;
    user: User;
  };
};

/** Properties for the ChatItem component. */
interface ChatItemProps {
  type: "chat" | "dm";
  message: MessageWithMember;
  userFriendships: Array<{
    senderId: string;
    receiverId: string;
    status: string;
  }>;
  currentUserId: string;
  onDeleteSuccess?: (id: string) => void;
  onEditSuccess?: (id: string, newContent: string) => void;
}

/** Renders an individual chat message row with support for user profiles, editing, and deletion. */
export function ChatItem({
  type,
  message,
  currentUserId,
  userFriendships,
  onDeleteSuccess,
  onEditSuccess,
}: ChatItemProps) {
  const router = useRouter();
  const { setActiveServer } = useActiveServer();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [content, setContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const nameBtnRef = useRef<HTMLButtonElement>(null);

  const isDirect = type;
  const user = message.member.user;
  const fullName = user.username.trim();
  const isOwner = user?.id === currentUserId;
  const isUpdated =
    message.updatedAt &&
    new Date(message.updatedAt).getTime() >
      new Date(message.createdAt).getTime();

  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "de-DE",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const apiEndpoint =
    isDirect === "dm"
      ? `/api/dm/messages/${message.id}`
      : `/api/messages/${message.id}`;

  /** Closes the profile popover when clicking outside or pressing the Escape key. */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
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

  /** Determines the friendship status between the current user and the message author. */
  const getFriendshipStatus = () => {
    if (
      !user?.id ||
      user.id === currentUserId ||
      !Array.isArray(userFriendships)
    ) {
      return null;
    }

    const friendship = userFriendships.find(
      (f) =>
        (f.senderId === user.id && f.receiverId === currentUserId) ||
        (f.receiverId === user.id && f.senderId === currentUserId),
    );

    return friendship ? friendship.status : null;
  };

  const friendshipStatus = getFriendshipStatus();

  /** Starts a direct message conversation with the specified recipient. */
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
        router.push(`/dm/${conversation.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  /** Sends a friend request to the user with the specified username. */
  const handleAddFriend = async (username: string) => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        console.error("Failed to send friend request:", data.error);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  /** Deletes the current chat message via API call. */
  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete message");

      if (onDeleteSuccess) {
        onDeleteSuccess(message.id);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting the message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /** Updates the message content via API PATCH request. */
  const handleEdit = async () => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(apiEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to update message");

      setIsEditing(false);

      if (onEditSuccess) {
        onEditSuccess(message.id, content.trim());
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error editing the message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3 group p-2 rounded-xl hover:bg-surface transition-colors relative">
      <button
        type="button"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className="focus:outline-none cursor-pointer shrink-0"
      >
        <UserAvatar user={user} size="md" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-baseline gap-2 min-w-0 relative"
            ref={profileRef}
          >
            <button
              ref={nameBtnRef}
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="font-semibold text-white text-sm hover:underline cursor-pointer truncate focus:outline-none text-left"
            >
              {fullName}
            </button>

            {isProfileOpen && (
              <UserProfilePopover
                user={user}
                currentUserId={currentUserId}
                triggerRef={nameBtnRef}
                friendshipStatus={friendshipStatus}
                onDirectMessage={handleStartConversation}
                onAddFriend={handleAddFriend}
              />
            )}

            <span className="text-xs text-muted shrink-0">{formattedTime}</span>
            {isUpdated && (
              <span className="text-[10px] text-muted shrink-0">(edited)</span>
            )}
          </div>

          {isOwner && !isEditing && (
            <ChatItemActions
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </div>

        {isEditing ? (
          <ChatItemEdit
            content={content}
            initialContent={message.content}
            setContent={setContent}
            onSave={handleEdit}
            onCancel={() => {
              setIsEditing(false);
              setContent(message.content);
            }}
            isLoading={isLoading}
          />
        ) : (
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap wrap-break-words mt-0.5">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}
