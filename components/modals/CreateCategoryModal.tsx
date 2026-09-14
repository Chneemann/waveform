/**
 * @file components/modals/CreateCategoryModal.tsx
 * @description Modal dialog component for creating a new channel category within a server.
 */

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useActiveServer } from "@/lib/context/ServerContext";
import { ActionButton } from "../ui/ActionButton";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

/** Renders a modal dialog allowing users to create a new category in a server. */
export function CreateCategoryModal({
  isOpen,
  onClose,
  serverId,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addCategory } = useActiveServer();

  if (!isOpen) return null;

  const isValid = name.trim().length !== 0;
  const canSave = isValid && !isLoading;

  /** Handles form submission to create a new category via the API. */
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, serverId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category.");
      }

      const newCategory = await response.json();

      addCategory(newCategory);
      setName("");
      onClose();
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

        <h2 className="text-xl font-bold text-white mb-1">Create Category</h2>
        <p className="text-sm text-muted mb-6">
          Create a category to group channels together in this server.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              maxLength={32}
              onChange={(e) => setName(e.target.value)}
              placeholder="NEW CATEGORY"
              disabled={isLoading}
              autoFocus
              className="w-full bg-background border border-surface/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-4">
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
