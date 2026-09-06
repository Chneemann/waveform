/**
 * @file components/chat/ChatItemActions.tsx
 * @description Action buttons component for editing or deleting chat messages on hover with deletion confirmation state.
 */

"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

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
 * Renders action buttons (edit and delete) for a chat message item on hover with an inline delete confirmation step.
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
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    onDelete();
  };

  const handleCancelDelete = () => {
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1 px-1 shadow-sm">
        <span className="text-xs text-muted px-1 select-none">Delete?</span>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="p-1 text-muted hover:text-destructive focus:outline-none transition-all cursor-pointer shrink-0 disabled:opacity-50"
          title="Confirm deletion"
          aria-label="Confirm deletion"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={handleCancelDelete}
          disabled={isDeleting}
          className="p-1 text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer shrink-0"
          title="Cancel"
          aria-label="Cancel deletion"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

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
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="p-1 text-muted hover:text-destructive focus:outline-none transition-all cursor-pointer shrink-0 disabled:opacity-50"
        aria-label="Delete message"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
