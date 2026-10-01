/**
 * @file components/modals/CreateServerModal.tsx
 * @description Modal dialog allowing users to create a new server with custom name and accent color.
 */

"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import {
  SERVER_COLOR_CLASSES,
  SERVER_COLOR_OPTIONS,
} from "@/lib/constants/server.styles";
import { ActionButton } from "../ui/ActionButton";

/** Props for the CreateServerModal component. */
interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Renders a modal dialog to create a new server with name and accent color selection. */
export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-500");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isValid = name.trim().length !== 0;
  const canSave = isValid && !isLoading;

  /** Handles server creation form submission and redirects to the created server's channel. */
  const handleSubmit = async (e: React.SubmitEvent) => {
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

        <h2 className="text-xl font-bold text-white mb-1">Create Server</h2>
        <p className="text-sm text-muted mb-6">
          Give your new server a name and choose an accent color.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                Accent Color
              </label>
            </div>

            <div className="grid grid-cols-8 gap-3 bg-background/50 border border-surface/80 p-3.5 rounded-2xl max-h-48 overflow-y-auto">
              {SERVER_COLOR_OPTIONS.map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`group relative aspect-square rounded-full ${
                      SERVER_COLOR_CLASSES[c] || c
                    } flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-surface scale-110 z-10 shadow-lg"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </ActionButton>

            <ActionButton
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!canSave}
            >
              Save
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
