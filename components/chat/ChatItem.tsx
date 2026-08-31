/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component supporting editing and deletion functionality.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message, Member, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { ChatItemActions } from "./ChatItemActions";
import { ChatItemEdit } from "./ChatItemEdit";

/**
 * Composite message type extending base database Message with populated member and user relation.
 *
 * @interface MessageWithMember
 * @property {string} id - The unique identifier of the message.
 * @property {string} content - The text content of the message.
 * @property {string} createdAt - The timestamp when the message was created.
 * @property {string | null} [updatedAt] - The timestamp when the message was last updated.
 * @property {Member & { user: User }} member - The associated member and user relational data.
 */
export type MessageWithMember = Message & {
  member: Member & {
    user: User;
  };
};

/**
 * Properties for the ChatItem component.
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
 * Renders an individual chat message row supporting message editing, deletion, and author details.
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

      if (!response.ok) throw new Error("Failed to delete message");
      router.refresh();
    } catch (error) {
      console.error("Error deleting the message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handles the asynchronous update of the chat message content.
   *
   * @async
   * @function handleEdit
   * @returns {Promise<void>} Resolves when the update process completes or fails.
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

      if (!response.ok) throw new Error("Failed to update message");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error editing the message:", error);
    } finally {
      setIsLoading(false);
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
            setContent={setContent}
            onSave={handleEdit}
            onCancel={() => {
              setIsEditing(false);
              setContent(message.content);
            }}
            isLoading={isLoading}
          />
        ) : (
          <p className="text-foreground text-sm leading-relaxed wrap-break-words mt-0.5">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}
