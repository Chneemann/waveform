/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component supporting editing, deletion, avatar rendering, and user role tracking for chat channels and direct messages.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";
import { ChatItemActions } from "./ChatItemActions";
import { ChatItemEdit } from "./ChatItemEdit";

/**
 * Composite message type extending base database Message with channel/conversation details and member relation.
 *
 * @interface MessageWithMember
 * @property {string} id - The unique identifier of the message.
 * @property {string} content - The text content of the message.
 * @property {string | Date} createdAt - The creation timestamp of the message.
 * @property {string | Date} [updatedAt] - The optional update timestamp of the message.
 * @property {string} [channelId] - Optional associated channel identifier.
 * @property {string} [conversationId] - Optional associated conversation identifier.
 * @property {"chat" | "dm"} [type] - Optional chat type indicator.
 * @property {{ id: string; role: string; user: User }} member - Associated member details including user relation.
 */
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

/**
 * Properties for the ChatItem component.
 *
 * @interface ChatItemProps
 * @property {"chat" | "dm"} type - The type of chat context (channel chat or direct message).
 * @property {MessageWithMember} message - The message object containing member and content data.
 * @property {string} [currentUserId] - The unique identifier of the currently logged-in user.
 * @property {(id: string) => void} [onDeleteSuccess] - Optional callback executed when a message is successfully deleted.
 * @property {(id: string, newContent: string) => void} [onEditSuccess] - Optional callback executed when a message is successfully edited.
 */
interface ChatItemProps {
  type: "chat" | "dm";
  message: MessageWithMember;
  currentUserId: string;
  onDeleteSuccess?: (id: string) => void;
  onEditSuccess?: (id: string, newContent: string) => void;
}

/**
 * Renders an individual chat message row with support for inline editing, deletion, and status indicators.
 *
 * @param {ChatItemProps} props - The component props.
 * @param {"chat" | "dm"} props.type - The type of chat context.
 * @param {MessageWithMember} props.message - The message object.
 * @param {string} [props.currentUserId] - The unique identifier of the current user.
 * @param {(id: string) => void} [props.onDeleteSuccess] - Callback on successful deletion.
 * @param {(id: string, newContent: string) => void} [props.onEditSuccess] - Callback on successful edit.
 * @returns {JSX.Element} The rendered chat item component.
 */
export function ChatItem({
  type,
  message,
  currentUserId,
  onDeleteSuccess,
  onEditSuccess,
}: ChatItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);

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

  // Dynamischen Endpunkt basierend auf Chat-Typ bestimmen
  const apiEndpoint = isDirect
    ? `/api/dm/messages/${message.id}`
    : `/api/messages/${message.id}`;

  /**
   * Handles the asynchronous deletion of the chat message.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the delete operation completes or fails.
   */
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

  /**
   * Handles the asynchronous update/editing of the chat message content.
   *
   * @async
   * @function handleEdit
   * @returns {Promise<void>} Resolves when the edit operation completes or fails.
   */
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
