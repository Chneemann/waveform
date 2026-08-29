/**
 * @file components/modals/DeleteServerModal.tsx
 * @description Confirmation modal for permanently deleting a server.
 */

"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";

/**
 * Properties for the DeleteServerModal component.
 *
 * @interface DeleteServerModalProps
 * @property {boolean} isOpen - Indicates whether the modal dialog is currently visible.
 * @property {() => void} onClose - Callback function to handle closing the modal dialog.
 * @property {string} serverId - The unique identifier of the server to be deleted.
 * @property {string} serverName - The name of the server displayed in the confirmation message.
 */
interface DeleteServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  serverName: string;
}

/**
 * Renders a confirmation modal allowing users to permanently delete a server.
 *
 * @param {DeleteServerModalProps} props - Component properties.
 * @returns {JSX.Element | null} The modal component or null if not open.
 */
export function DeleteServerModal({
  isOpen,
  onClose,
  serverId,
  serverName,
}: DeleteServerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  /**
   * Sends a DELETE request to remove the server and redirects to the home route upon success.
   */
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/servers/${serverId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete server.");
      }

      onClose();

      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Outer Backdrop */
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      {/* Inner Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-surface/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Delete Server</h2>
        </div>

        <p className="text-sm text-muted mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{serverName}</span>? This
          action cannot be undone and will permanently remove all channels and
          messages.
        </p>

        {error && <p className="text-xs text-rose-400 mb-4">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-5 py-2 bg-rose-600 text-white font-medium text-sm rounded-xl hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Server
          </button>
        </div>
      </div>
    </div>
  );
}
