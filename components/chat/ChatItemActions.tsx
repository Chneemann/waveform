/**
 * @file components/chat/ChatItemActions.tsx
 * @description Action buttons component for editing or deleting chat messages on hover.
 */

"use client";

import { Pencil, Trash2 } from "lucide-react";

/**
 * Properties for the ChatItemActions component.
 *
 * @interface ChatItemActionsProps
 * @property {() => void} onEdit - Callback function triggered when the edit button is clicked.
 * @property {() => void} onDelete - Callback function triggered when the delete button is clicked.
 * @property {boolean} isDeleting - Flag indicating whether a deletion operation is currently in progress.
 */
interface ChatItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

/**
 * Renders action buttons (edit and delete) for a chat message item on hover.
 *
 * @param {ChatItemActionsProps} props - The component props.
 * @param {() => void} props.onEdit - Callback function triggered when the edit button is clicked.
 * @param {() => void} props.onDelete - Callback function triggered when the delete button is clicked.
 * @param {boolean} props.isDeleting - Flag indicating whether a deletion operation is currently in progress.
 * @returns {JSX.Element} The rendered chat item action buttons.
 */
export function ChatItemActions({
  onEdit,
  onDelete,
  isDeleting,
}: ChatItemActionsProps) {
  return (
    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
      <button
        type="button"
        onClick={onEdit}
        className="p-1 text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer shrink-0"
        aria-label="Edit message"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="p-1 text-muted hover:text-red-400 focus:outline-none transition-all cursor-pointer shrink-0 disabled:opacity-50"
        aria-label="Delete message"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
