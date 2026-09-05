/**
 * @file components/chat/ChatMessages.tsx
 * @description Scrollable container component that displays message history, handles date dividers, and renders individual chat items for both channels and direct messages.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChatItem, type MessageWithMember } from "./ChatItem";

/**
 * Properties for the ChatMessages component.
 *
 * @interface ChatMessagesProps
 * @property {"chat" | "dm"} type - The context type of the chat, either channel chat or direct message.
 * @property {string} name - The name of the channel or the direct message recipient.
 * @property {MessageWithMember[]} initialMessages - Initial array of messages loaded for the view.
 * @property {string} [currentUserId] - The unique identifier of the currently logged-in user.
 * @property {(id: string) => void} [onDeleteMessage] - Optional callback function triggered when a message is deleted.
 * @property {(id: string, newContent: string) => void} [onEditMessage] - Optional callback function triggered when a message is edited.
 */
export interface ChatMessagesProps {
  type: "chat" | "dm";
  name: string;
  initialMessages: MessageWithMember[];
  currentUserId: string;
  onDeleteMessage?: (id: string) => void;
  onEditMessage?: (id: string, newContent: string) => void;
}

/**
 * Formats a date string or Date object into a readable label (Today, Yesterday, or formatted date).
 *
 * @function formatDateLabel
 * @param {string | Date} dateString - The date string or object to format.
 * @returns {string} The formatted date label.
 */
function formatDateLabel(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Renders the scrollable message feed with greetings, date dividers, and interactive chat items.
 *
 * @param {ChatMessagesProps} props - The component props.
 * @param {"chat" | "dm"} props.type - The context type of the chat.
 * @param {string} props.name - The name of the channel or user.
 * @param {MessageWithMember[]} props.initialMessages - Initial array of messages.
 * @param {string} [props.currentUserId] - The unique identifier of the current user.
 * @param {(id: string) => void} [props.onDeleteMessage] - Optional message deletion callback.
 * @param {(id: string, newContent: string) => void} [props.onEditMessage] - Optional message editing callback.
 * @returns {JSX.Element} The rendered chat messages container.
 */
export function ChatMessages({
  type,
  name,
  initialMessages,
  currentUserId,
  onDeleteMessage,
  onEditMessage,
}: ChatMessagesProps) {
  const [messages, setMessages] =
    useState<MessageWithMember[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Synchronisiere den State, wenn der Server neue initialMessages liefert (z.B. nach router.refresh())
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  /**
   * Handles local state update and triggers parent callback upon successful message deletion.
   *
   * @function handleDeleteMessage
   * @param {string} id - The unique identifier of the deleted message.
   * @returns {void}
   */
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    onDeleteMessage?.(id);
  };

  /**
   * Handles local state update and triggers parent callback upon successful message edit.
   *
   * @function handleEditMessage
   * @param {string} id - The unique identifier of the edited message.
   * @param {string} newContent - The updated content text of the message.
   * @returns {void}
   */
  const handleEditMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content: newContent, updatedAt: new Date() } : m,
      ),
    );
    onEditMessage?.(id, newContent);
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto flex flex-col min-h-0 py-2 mt-4"
    >
      <div className="flex flex-col mt-auto mb-4">
        {/* Chat Header Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {type === "dm"
              ? `Direct Messages with @${name}`
              : `Welcome to #${name}!`}
          </h2>
          <p className="text-muted text-sm">
            {type === "dm"
              ? `This is the start of your direct message history with @${name}.`
              : `This is the beginning of the channel #${name}.`}
          </p>
        </div>

        {/* Message Feed */}
        <div className="space-y-4">
          {messages.map((message, index) => {
            const currentDateLabel = formatDateLabel(message.createdAt);
            const previousMessage = messages[index - 1];
            const previousDateLabel = previousMessage
              ? formatDateLabel(previousMessage.createdAt)
              : null;

            const showDateDivider = currentDateLabel !== previousDateLabel;

            return (
              <div className="m-0" key={message.id}>
                {showDateDivider && (
                  <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted/30" />
                    </div>
                    <div className="relative bg-background px-2 text-xs font-semibold text-muted rounded-full border border-muted/30">
                      {currentDateLabel}
                    </div>
                  </div>
                )}

                <ChatItem
                  type={type}
                  message={message}
                  currentUserId={currentUserId}
                  onDeleteSuccess={handleDeleteMessage}
                  onEditSuccess={handleEditMessage}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
