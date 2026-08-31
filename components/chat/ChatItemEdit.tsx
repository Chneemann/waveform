/**
 * @file components/chat/ChatItemEdit.tsx
 * @description Component allowing users to edit an existing chat message inline with keyboard support.
 */

"use client";

import { Check, X } from "lucide-react";

/**
 * Properties for the ChatItemEdit component.
 *
 * @interface ChatItemEditProps
 * @property {string} content - The current text content of the message being edited.
 * @property {function} setContent - Callback function to update the message content state.
 * @property {function} onSave - Callback function invoked to save the edited message.
 * @property {function} onCancel - Callback function invoked to cancel the editing process.
 * @property {boolean} isLoading - Flag indicating whether a save operation is currently in progress.
 */
interface ChatItemEditProps {
  content: string;
  setContent: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * Renders an inline text input field with save and cancel buttons for editing chat messages.
 *
 * @param {ChatItemEditProps} props - The component props.
 * @param {string} props.content - The current text content of the message being edited.
 * @param {function} props.setContent - Callback function to update the message content state.
 * @param {function} props.onSave - Callback function invoked to save the edited message.
 * @param {function} props.onCancel - Callback function invoked to cancel the editing process.
 * @param {boolean} props.isLoading - Flag indicating whether a save operation is currently in progress.
 * @returns {JSX.Element} The rendered inline message editing component.
 */
export function ChatItemEdit({
  content,
  setContent,
  onSave,
  onCancel,
  isLoading,
}: ChatItemEditProps) {
  /**
   * Handles keyboard events within the input field for quick actions (Enter to save, Escape to cancel).
   *
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event object.
   * @returns {void}
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="mt-1 flex items-center gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="w-full bg-background border border-surface rounded px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
        autoFocus
      />
      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="p-1 text-muted hover:text-foreground cursor-pointer"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 text-muted hover:text-foreground cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
