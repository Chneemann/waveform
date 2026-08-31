/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component supporting inline editing, deletion, and user association details.
 */

"use client";

import type { Message, Member, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Trash2, X } from "lucide-react";

/**
 * Composite message type extending base database Message with populated member and user relation.
 *
 * @interface MessageWithMember
 * @property {string} id - The unique identifier of the message.
 * @property {string} content - The text content of the message.
 * @property {string} createdAt - The timestamp when the message was created.
 * @property {string} [updatedAt] - The timestamp when the message was last updated.
 * @property {Member & { user: User }} member - The associated member and user relational data.
 */
export type MessageWithMember = Message & {
  member: Member & {
    user: User;
  };
};

/**
 * Props for the ChatItem component.
 *
 * @interface ChatItemProps
 * @property {MessageWithMember} message - The message object containing member and user relational data.
 * @property {string} [currentUserId] - The unique identifier of the currently logged-in user.
 */
interface ChatItemProps {
  message: MessageWithMember;
  currentUserId?: string;
}

/**
 * Renders an individual chat message row displaying user avatar, sender name, timestamp,
 * edited indicator, and inline editing or deletion capabilities.
 *
 * @async
 * @param {ChatItemProps} props - The component props.
 * @param {MessageWithMember} props.message - The message object containing member and user relational data.
 * @param {string} [props.currentUserId] - The unique identifier of the currently logged-in user.
 * @returns {JSX.Element} The rendered single chat message item.
 */
export function ChatItem({ message, currentUserId }: ChatItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);

  const user = message.member?.user;
  const fullName = user ? user.username.trim() : "Deleted Member";
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

  /**
   * Handles the asynchronous deletion of the chat message via API.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the deletion completes or fails.
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting the message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handles the asynchronous update of the chat message content via API.
   *
   * @async
   * @function handleEdit
   * @returns {Promise<void>} Resolves when the message update completes or fails.
   */
  const handleEdit = async () => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error editing the message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events during inline editing (Enter to save, Escape to cancel).
   *
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event object.
   * @returns {void}
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setContent(message.content);
    }
  };

  return (
    <div className="flex items-start gap-3 group p-2 rounded-xl hover:bg-surface transition-colors">
      <UserAvatar user={user} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-semibold text-white text-sm hover:underline cursor-pointer truncate">
              {fullName}
            </span>
            <span className="text-xs text-muted shrink-0">{formattedTime}</span>
            {isUpdated && (
              <span className="text-[10px] text-muted shrink-0">(edited)</span>
            )}
          </div>

          {/* Action Buttons */}
          {isOwner && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer shrink-0"
                aria-label="Edit Message"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-muted hover:text-red-400 focus:outline-none transition-all cursor-pointer shrink-0 disabled:opacity-50"
                aria-label="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Inline Edit Input vs. Regular Content */}
        {isEditing ? (
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full bg-background border border-surface rounded px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
            <button
              type="button"
              onClick={handleEdit}
              disabled={isLoading}
              className="p-1 text-muted hover:text-foreground cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setContent(message.content);
              }}
              className="p-1 text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-foreground text-sm leading-relaxed wrap-break-words mt-0.5">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}
