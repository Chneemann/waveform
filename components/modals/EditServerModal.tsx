/**
 * @file components/modals/EditServerModal.tsx
 * @description Modal dialog to edit server settings or delete the server.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2 } from "lucide-react";

/**
 * Properties for the EditServerModal component.
 *
 * @interface EditServerModalProps
 * @property {boolean} isOpen - Determines whether the modal dialog is currently visible.
 * @property {() => void} onClose - Callback function triggered to close the modal.
 * @property {string} serverId - The unique identifier of the server being edited.
 * @property {string} initialName - The current name of the server.
 */
interface EditServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  initialName: string;
}

/**
 * Renders a modal dialog allowing users to modify server properties or delete the server.
 *
 * @param {EditServerModalProps} props - The component props.
 * @param {boolean} props.isOpen - Determines whether the modal dialog is currently visible.
 * @param {() => void} props.onClose - Callback function triggered to close the modal.
 * @param {string} props.serverId - The unique identifier of the server.
 * @param {string} props.initialName - The current name of the server.
 * @returns {JSX.Element | null} The rendered edit server modal, or null if closed.
 */
export function EditServerModal({
  isOpen,
  onClose,
  serverId,
  initialName,
}: EditServerModalProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (!isOpen) return null;

  const isChanged = name.trim() !== initialName;
  const isValid = name.trim().length > 0;
  const canSave = isChanged && isValid && !isLoading && !isDeleting;

  /**
   * Handles the asynchronous update of the server name.
   *
   * @async
   * @function handleUpdate
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Resolves when the server update process completes or fails.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/servers/${serverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Error updating the server.");
      }

      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the asynchronous deletion of the server and redirects the user to the home page.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the server deletion process completes or fails.
   */
  const handleDelete = async () => {
    if (isDeleting || isLoading) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/servers/${serverId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting the server.");
      }

      onClose();
      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-surface/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading || isDeleting}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Edit Server</h2>
        <p className="text-sm text-muted mb-6">
          Change server details or delete this server.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Server Name
            </label>
            <input
              type="text"
              required
              value={name}
              maxLength={32}
              onChange={(e) => setName(e.target.value)}
              placeholder="server-name"
              disabled={isLoading || isDeleting}
              autoFocus
              className="w-full bg-background border border-surface/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Server
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading || isDeleting}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className="px-5 py-2 bg-accent text-white font-medium text-sm rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
