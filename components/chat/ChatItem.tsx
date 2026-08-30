/**
 * @file components/chat/ChatItem.tsx
 * @description Single message row component.
 */

"use client";

import type { Message, Member, User } from "@/db/schema";
import { UserAvatar } from "../ui/UserAvatar";

/**
 * Composite message type extending base database Message with populated member and user relation.
 */
export type MessageWithMember = Message & {
  member: Member & {
    user: User;
  };
};

/**
 * Renders an individual chat message row displaying user avatar, sender name, timestamp, and text content.
 *
 * @param {Object} props - The component props.
 * @param {MessageWithMember} props.message - The message object containing member and user relational data.
 * @returns {JSX.Element} The rendered single chat message item.
 */
export function ChatItem({ message }: { message: MessageWithMember }) {
  const user = message.member?.user;
  const fullName = user ? user.username.trim() : "Deleted Member";

  const formattedTime = new Date(message.createdAt).toLocaleTimeString(
    "de-DE",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="flex items-start gap-3 group p-2 rounded-xl hover:bg-surface transition-colors">
      {/* Avatar Component */}
      <UserAvatar user={user} size="md" />

      {/* Message Header & Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-white text-sm hover:underline cursor-pointer">
            {fullName}
          </span>
          <span className="text-xs text-muted">{formattedTime}</span>
        </div>
        <p className="text-foreground text-sm leading-relaxed wrap-break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
