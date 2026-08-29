/**
 * @file components/chat/ChatMessages.tsx
 * @description Message history container component displaying initial channel greeting and rendering a list of individual chat messages.
 */

"use client";

import { ChatItem, type MessageWithMember } from "./ChatItem";

/**
 * Properties for the ChatMessages component.
 *
 * @interface ChatMessagesProps
 * @property {string} channelName - The name of the active chat channel to display in the header greeting.
 * @property {MessageWithMember[]} messages - Array of message objects, each containing message details and associated member information.
 */
interface ChatMessagesProps {
  channelName: string;
  messages: MessageWithMember[];
}

/**
 * Renders the scrollable message list along with a welcoming channel header.
 *
 * @param {ChatMessagesProps} props - The component props.
 * @returns {JSX.Element} The rendered chat messages container.
 */
export function ChatMessages({ channelName, messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col justify-end">
      <div className="mb-4 border-b border-surface/50">
        <h2 className="text-2xl font-bold text-white">
          Welcome to #{channelName}!
        </h2>
        <p className="text-muted text-sm">
          This is the beginning of the channel #{channelName}.
        </p>
      </div>

      <div className="space-y-1 mb-4">
        {messages.map((message) => (
          <ChatItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
