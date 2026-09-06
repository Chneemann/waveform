/**
 * @file components/chat/ChatItemEdit.tsx
 * @description Component allowing users to edit an existing chat message inline with auto-resizing textarea and keyboard support.
 */

"use client";

import { useEffect, useRef } from "react";
import { Check, X, Loader2 } from "lucide-react";

/**
 * Properties for the ChatItemEdit component.
 *
 * @interface ChatItemEditProps
 * @property {string} [initialContent] - The original unedited text content of the message.
 * @property {string} content - The current text content of the message being edited.
 * @property {function} setContent - Callback function to update the message content state.
 * @property {function} onSave - Callback function invoked to save the edited message.
 * @property {function} onCancel - Callback function invoked to cancel the editing process.
 * @property {boolean} isLoading - Flag indicating whether a save operation is currently in progress.
 */
interface ChatItemEditProps {
  initialContent?: string;
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
 * @param {string} [props.initialContent] - The original message content.
 * @param {string} props.content - The current text content of the message being edited.
 * @param {function} props.setContent - Callback function to update the message content state.
 * @param {function} props.onSave - Callback function invoked to save the edited message.
 * @param {function} props.onCancel - Callback function invoked to cancel the editing process.
 * @param {boolean} props.isLoading - Flag indicating whether a save operation is currently in progress.
 * @returns {JSX.Element} The rendered inline message editing component.
 */
export function ChatItemEdit({
  initialContent,
  content,
  setContent,
  onSave,
  onCancel,
  isLoading,
}: ChatItemEditProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If `initialContent` is not passed, the era is considered unchanged if `content` is empty
  const isChanged =
    initialContent !== undefined
      ? content.trim() !== initialContent.trim()
      : true;
  const isValidAndChanged = isChanged && content.trim().length > 0;

  // Automatically adjust the height to fit the content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  /**
   * Handles keyboard events for saving on Enter or cancelling on Escape.
   *
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - The keyboard event object.
   * @returns {void}
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isValidAndChanged && !isLoading) {
        onSave();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="mt-1 flex items-start gap-2">
      <textarea
        ref={textareaRef}
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="w-full bg-background border-none outline-none focus:ring-1 focus:ring-accent resize-none max-h-40 min-h-6 px-1 py-0.5 text-sm text-foreground overflow-y-auto scrollbar-thin"
        autoFocus
      />
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        <button
          type="button"
          onClick={onSave}
          disabled={!isValidAndChanged || isLoading}
          title={isValidAndChanged ? "Save changes" : "No changes to save"}
          className="p-1 text-muted hover:text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          title="Cancel"
          className="p-1 text-muted hover:text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
