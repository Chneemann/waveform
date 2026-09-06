/**
 * @file components/chat/ChatInput.tsx
 * @description Input component for sending chat messages within channels or direct message conversations, handling submission via form submit and API requests.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SendHorizontal, Loader2 } from "lucide-react";

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
 * Renders an auto-expanding chat input form allowing users to send messages via API calls with keyboard shortcut support.
 *
 * @param {ChatInputProps} props - The component props.
 * @returns {JSX.Element} The rendered chat input form component.
 */
export function ChatInput(props: ChatInputProps) {
  const { placeholderName, onMessageSent, type } = props;
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const trimmedContent = content.trim();
  const isDm = type === "dm";

  // Automatically adjust the height to fit the content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  /**
   * Handles the asynchronous form submission and sending of the chat message.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} [e] - Optional form submit event.
   * @returns {Promise<void>} Resolves when the message submission is complete.
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!trimmedContent || isLoading) return;

    try {
      setIsLoading(true);

      const endpoint = isDm
        ? `/api/dm/${props.conversationId}`
        : "/api/messages";

      const payload = isDm
        ? { content: trimmedContent }
        : {
            content: trimmedContent,
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

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (onMessageSent) {
        onMessageSent(data);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error sending the message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events to submit messages on Enter key press without shift.
   *
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - The keyboard event object.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholderText = isDm
    ? `Message @${placeholderName}`
    : `Message #${placeholderName}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-surface rounded-lg p-2.5 flex items-end gap-2 focus-within:ring-1 focus-within:ring-accent transition-all"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={placeholderText}
        className="w-full bg-transparent outline-none text-foreground placeholder-muted text-sm disabled:opacity-50 resize-none max-h-40 min-h-6"
      />
      <button
        type="submit"
        disabled={!trimmedContent || isLoading}
        title="Send Message"
        className="p-1 rounded-md text-muted hover:text-white hover:bg-accent/20 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 scrollbar-thin"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <SendHorizontal className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
