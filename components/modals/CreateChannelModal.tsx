/**
 * @file components/modals/CreateChannelModal.tsx
 * @description Modal dialog component for creating a new text channel within a server.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { useActiveServer } from "@/lib/context/ServerContext";

/**
 * Properties for the CreateChannelModal component.
 *
 * @interface CreateChannelModalProps
 * @property {boolean} isOpen - Determines whether the modal is visible.
 * @property {() => void} onClose - Callback function executed to close the modal.
 * @property {string} serverId - The unique identifier of the target server where the channel is created.
 */
interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

/**
 * Renders a modal dialog allowing users to input a name and create a new server channel.
 *
 * @param {CreateChannelModalProps} props - The component props.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.onClose - Callback function executed to close the modal.
 * @param {string} props.serverId - The unique identifier of the target server where the channel is created.
 * @returns {JSX.Element | null} The rendered modal component or null if closed.
 */
export function CreateChannelModal({
  isOpen,
  onClose,
  serverId,
}: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { addChannel } = useActiveServer();

  if (!isOpen) return null;

  /**
   * Handles form submission to create a new channel via the API.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Resolves when the channel creation request completes.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, serverId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create channel.");
      }

      const newChannel = await response.json();

      addChannel(newChannel);

      setName("");
      onClose();

      router.push(`/servers/${serverId}/channels/${newChannel.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Create Channel</h2>
        <p className="text-sm text-muted mb-6">
          Create a new text channel for messaging in this server.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="new-channel"
                disabled={isLoading}
                autoFocus
                className="w-full bg-background border border-surface/80 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-5 py-2 bg-accent text-white font-medium text-sm rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
