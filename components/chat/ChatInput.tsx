/**
 * @file components/chat/ChatInput.tsx
 * @description Input component for sending chat messages within channels or direct message conversations, handling submission via keyboard events and API requests.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Base properties shared across all ChatInput variations.
 *
 * @interface BaseChatInputProps
 * @property {string} placeholderName - The display name for the channel or recipient used in the input placeholder text.
 * @property {(message: unknown) => void} [onMessageSent] - Optional callback function triggered after a message is successfully sent.
 */
interface BaseChatInputProps {
  placeholderName: string;
  onMessageSent?: (message: unknown) => void;
}

/**
 * Union type for ChatInput properties, supporting either a server channel or a direct message conversation context.
 *
 * @type {ChatInputProps}
 */
type ChatInputProps = BaseChatInputProps &
  (
    | {
        type: "chat";
        channelId: string;
        serverId: string;
      }
    | {
        type: "dm";
        conversationId: string;
      }
  );

/**
 * Renders an input field for writing and submitting chat messages with loading states and keyboard event handlers.
 *
 * @param {ChatInputProps} props - The component props.
 * @returns {JSX.Element} The rendered chat input component.
 */
export function ChatInput(props: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles keydown events on the input element to submit messages when pressing Enter without Shift.
   *
   * @async
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event object.
   * @returns {Promise<void>} Resolves when the message submission finishes or fails.
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!content.trim() || isLoading) return;

      try {
        setIsLoading(true);

        const endpoint =
          props.type === "dm"
            ? `/api/dm/${props.conversationId}`
            : "/api/messages";

        const payload =
          props.type === "dm"
            ? { content: content.trim() }
            : {
                content: content.trim(),
                channelId: props.channelId,
                serverId: props.serverId,
              };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error sending message");
        }

        const data = await response.json();
        setContent("");

        if (props.onMessageSent) {
          props.onMessageSent(data);
        } else {
          router.refresh();
        }
      } catch (error) {
        console.error("Error sending the message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const placeholderText =
    props.type === "dm"
      ? `Message @${props.placeholderName}`
      : `Message #${props.placeholderName}`;

  return (
    <div className="bg-surface border border-surface rounded-lg p-2.5 flex items-center focus-within:ring-1 focus-within:ring-accent transition-all">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={placeholderText}
        className="w-full bg-transparent outline-none text-foreground placeholder-muted text-sm disabled:opacity-50"
      />
    </div>
  );
}
