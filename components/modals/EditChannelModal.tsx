/**
 * @file components/modals/EditChannelModal.tsx
 * @description Modal dialog to edit channel settings or delete the channel.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2 } from "lucide-react";
import { useActiveServer } from "@/lib/context/ServerContext";
import type { Channel } from "@/db/schema";

/**
 * Properties for the EditChannelModal component.
 *
 * @interface EditChannelModalProps
 * @property {boolean} isOpen - Determines whether the modal dialog is currently visible.
 * @property {() => void} onClose - Callback function triggered to close the modal.
 * @property {Channel | null} channel - The channel object being edited, or null if none is selected.
 */
interface EditChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
}

/**
 * Renders a modal dialog allowing users to modify channel properties or delete the channel.
 *
 * @param {EditChannelModalProps} props - The component props.
 * @param {boolean} props.isOpen - Determines whether the modal dialog is currently visible.
 * @param {() => void} props.onClose - Callback function triggered to close the modal.
 * @param {Channel | null} props.channel - The channel object being edited, or null if none is selected.
 * @returns {JSX.Element | null} The rendered edit channel modal, or null if closed or no channel is selected.
 */
export function EditChannelModal({
  isOpen,
  onClose,
  channel,
}: EditChannelModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { updateChannel, removeChannel, activeServer } = useActiveServer();

  useEffect(() => {
    if (channel) {
      setName(channel.name);
    }
  }, [channel]);

  if (!isOpen || !channel) return null;

  const isChanged = name.trim() !== channel.name;
  const isValid = name.trim().length > 0;
  const canSave = isChanged && isValid && !isLoading && !isDeleting;

  /**
   * Handles the asynchronous update of the channel name.
   *
   * @async
   * @function handleUpdate
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Resolves when the channel update process completes or fails.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/channels/${channel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Error updating the channel.");
      }

      const updated = await response.json();
      updateChannel(updated);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the asynchronous deletion of the channel and redirects the user accordingly.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the channel deletion and navigation processes complete or fail.
   */
  const handleDelete = async () => {
    if (isDeleting || isLoading) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/channels/${channel.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting the channel.");
      }

      removeChannel(channel.id);
      onClose();

      if (activeServer) {
        const remainingChannels = activeServer.channels.filter(
          (c) => c.id !== channel.id,
        );
        if (remainingChannels.length > 0) {
          router.push(
            `/servers/${activeServer.id}/channels/${remainingChannels[0].id}`,
          );
        } else {
          router.push(`/servers/${activeServer.id}`);
        }
      }
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

        <h2 className="text-xl font-bold text-white mb-1">Edit Channel</h2>
        <p className="text-sm text-muted mb-6">
          Change channel details or delete this channel.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Channel Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-muted text-sm font-semibold">
                #
              </span>
              <input
                type="text"
                required
                value={name}
                maxLength={32}
                onChange={(e) => setName(e.target.value)}
                placeholder="channel-name"
                disabled={isLoading || isDeleting}
                autoFocus
                className="w-full bg-background border border-surface/80 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
              />
            </div>
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
              Delete Channel
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
