/**
 * @file components/chat/ChatInput.tsx
 * @description Client component providing an input field for composing and sending chat messages.
 */

/**
 * Renders the input container component for sending messages in a chat channel.
 *
 * @returns {JSX.Element} The rendered chat input UI element.
 */
export function ChatInput() {
  return (
    <div className=" bg-background shrink-0">
      <div className="bg-surface border border-surface rounded-lg p-2.5 flex items-center focus-within:ring-1 focus-within:ring-accent transition-all">
        <input
          type="text"
          placeholder="Nachricht an #allgemein"
          className="w-full bg-transparent outline-none text-foreground placeholder-muted text-sm"
        />
      </div>
    </div>
  );
}
