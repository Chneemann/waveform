/**
 * @file components/chat/ChatInput.tsx
 * @description Client component providing an input field to create messages via REST API.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Props for the ChatInput component.
 *
 * @interface ChatInputProps
 * @property {string} channelName - The name of the channel displayed in the input placeholder.
 * @property {string} channelId - The ID of the channel where the message will be sent.
 * @property {string} serverId - The ID of the server containing the channel.
 */
interface ChatInputProps {
  channelName: string;
  channelId: string;
  serverId: string;
}

/**
 * Renders an input field for sending chat messages within a channel.
 *
 * @param {ChatInputProps} props - Component properties.
 * @returns {JSX.Element} The ChatInput component.
 */
export function ChatInput({
  channelName,
  channelId,
  serverId,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles key press events, submitting the message on 'Enter' (without Shift).
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!content.trim() || isLoading) return;

      try {
        setIsLoading(true);

        const response = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            channelId,
            serverId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error while sending");
        }

        setContent("");
        router.refresh();
      } catch (error) {
        console.error("Error sending the message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-background shrink-0">
      <div className="bg-surface border border-surface rounded-lg p-2.5 flex items-center focus-within:ring-1 focus-within:ring-accent transition-all">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={`Message to #${channelName}`}
          className="w-full bg-transparent outline-none text-foreground placeholder-muted text-sm disabled:opacity-50"
        />
      </div>
    </div>
  );
}
