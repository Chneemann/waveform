/**
 * @file components/modals/CreateServerModal.tsx
 * @description Modal dialog allowing users to create a new server with custom name and accent color.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import {
  SERVER_COLOR_CLASSES,
  SERVER_COLOR_OPTIONS,
} from "@/lib/constants/server.styles";

/**
 * Properties for the CreateServerModal component.
 *
 * @interface CreateServerModalProps
 * @property {boolean} isOpen - Indicates whether the modal dialog is currently visible.
 * @property {() => void} onClose - Callback function to handle closing the modal dialog.
 */
interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders the modal dialog for creating a new server with custom properties.
 *
 * @param {CreateServerModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered modal component or null when hidden.
 */
export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-500");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  /**
   * Handles server creation form submission via API POST request.
   *
   * @param {React.FormEvent} e - The form submission event instance.
   * @returns {Promise<void>} Resolves when request is completed or redirects on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error("Failed to create server.");
      }

      const server = await response.json();

      setName("");
      onClose();

      const channelId = server.defaultChannelId || server.channels?.[0]?.id;
      const targetUrl = channelId
        ? `/servers/${server.id}/channels/${channelId}`
        : `/servers/${server.id}`;

      window.location.href = targetUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Outer Backdrop: Schließt das Modal bei Klick */
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
    >
      {/* Inner Modal Content: Verhindert Event-Bubbling, damit Klicks hier drinnen das Modal NICHT schließen */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-surface/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Create Server</h2>
        <p className="text-sm text-muted mb-6">
          Give your new server a name and choose an accent color.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Server Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Server"
              disabled={isLoading}
              className="w-full bg-background border border-surface/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Color
            </label>
            <div className="flex items-center gap-2">
              {SERVER_COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${SERVER_COLOR_CLASSES[c]} transition-transform cursor-pointer ${
                    color === c
                      ? "ring-2 ring-white scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
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
