/**
 * @file components/modals/EditServerModal.tsx
 * @description Modal dialog to edit server settings (name, color) or delete the server.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, Check } from "lucide-react";
import {
  SERVER_COLOR_CLASSES,
  SERVER_COLOR_OPTIONS,
} from "@/lib/constants/server.styles";
import { ActionButton } from "../ui/ActionButton";

/**
 * Properties for the EditServerModal component.
 *
 * @interface EditServerModalProps
 * @property {boolean} isOpen - Determines whether the modal dialog is currently visible.
 * @property {() => void} onClose - Callback function triggered to close the modal.
 * @property {string} serverId - The unique identifier of the server being edited.
 * @property {string} initialName - The current name of the server.
 * @property {string} [initialColor] - The current accent color of the server.
 */
interface EditServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  initialName: string;
  initialColor: string;
}

/**
 * Renders a modal dialog allowing users to modify server properties or delete the server.
 */
export function EditServerModal({
  isOpen,
  onClose,
  serverId,
  initialName,
  initialColor,
}: EditServerModalProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor]);

  if (!isOpen) return null;

  const isChanged = name.trim() !== initialName || color !== initialColor;
  const isValid = name.trim().length > 0;
  const canSave = isChanged && isValid && !isLoading && !isDeleting;

  /**
   * Handles the asynchronous update of the server name and accent color.
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
        body: JSON.stringify({ name: name.trim(), color }),
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
   * Handles the asynchronous deletion of the server.
   */
  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

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

        <form onSubmit={handleUpdate} className="space-y-5">
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

          <div className="flex items-center justify-between pt-2">
            <ActionButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isLoading}
              icon={Trash2}
            >
              {isConfirmingDelete ? "Sure?" : "Delete Server"}
            </ActionButton>

            <div className="flex items-center gap-2">
              <ActionButton
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading || isDeleting}
              >
                Cancel
              </ActionButton>

              <ActionButton
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={!canSave || isDeleting}
              >
                Save
              </ActionButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
