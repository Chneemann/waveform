/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component with support for user avatars, metadata, and deletion handling.
 */

"use client";

import type { Message, Member, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

/**
 * Composite message type extending base database Message with populated member and user relation.
 *
 * @interface MessageWithMember
 * @property {string} id - The unique identifier of the message.
 * @property {string} content - The text content of the message.
 * @property {string} createdAt - The timestamp when the message was created.
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
 * Renders an individual chat message row displaying user avatar, sender name, timestamp, and text content.
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

  const user = message.member?.user;
  const fullName = user ? user.username.trim() : "Deleted Member";
  const isOwner = user?.id === currentUserId;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "de-DE",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  /**
   * Handles the asynchronous deletion of the chat message.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the deletion process completes or fails.
   */
  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error while deleting");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting the message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-3 group p-2 rounded-xl hover:bg-surface transition-colors">
      {/* Avatar Component */}
      <UserAvatar user={user} size="md" />

      {/* Message Content & Top Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-semibold text-white text-sm hover:underline cursor-pointer truncate">
              {fullName}
            </span>
            <span className="text-xs text-muted shrink-0">{formattedTime}</span>
          </div>

          {/* Delete Button */}
          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-400 focus:outline-none transition-all cursor-pointer shrink-0 disabled:opacity-50"
              aria-label="Delete message"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-foreground text-sm leading-relaxed wrap-break-words mt-0.5">
          {message.content}
        </p>
      </div>
    </div>
  );
}
