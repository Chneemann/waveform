/**
 * @file components/chat/ChatMessages.tsx
 * @description Message history container component displaying initial channel greeting, date separators, and a list of individual chat messages.
 */

"use client";

import { ChatItem, type MessageWithMember } from "./ChatItem";

/**
 * Properties for the ChatMessages component.
 *
 * @interface ChatMessagesProps
 * @property {string} channelName - The name of the active chat channel to display in the header greeting.
 * @property {MessageWithMember[]} messages - Array of message objects, each containing message details and associated member information.
 * @property {string} [currentUserId] - The unique identifier of the currently logged-in user.
 */
interface ChatMessagesProps {
  channelName: string;
  messages: MessageWithMember[];
  currentUserId?: string;
}

/**
 * Formats a given date string or object into a human-readable label ("Today", "Yesterday", or a localized date string).
 *
 * @function formatDateLabel
 * @param {string | Date} dateString - The date value to format.
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
 * Renders the scrollable message list along with a welcoming channel header and dynamic date separators.
 *
 * @param {ChatMessagesProps} props - The component props.
 * @param {string} props.channelName - The name of the active chat channel to display in the header greeting.
 * @param {MessageWithMember[]} props.messages - Array of message objects, each containing message details and associated member information.
 * @param {string} [props.currentUserId] - The unique identifier of the currently logged-in user.
 * @returns {JSX.Element} The rendered chat messages container.
 */
export function ChatMessages({
  channelName,
  messages,
  currentUserId,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col justify-end mb-4">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome to #{channelName}!
        </h2>
        <p className="text-muted text-sm">
          This is the beginning of the channel #{channelName}.
        </p>
      </div>

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
              {/* Date separator */}
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

              <ChatItem message={message} currentUserId={currentUserId} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
