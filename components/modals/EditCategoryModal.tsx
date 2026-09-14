/**
 * @file components/modals/EditCategoryModal.tsx
 * @description Modal dialog component to edit category settings or delete a category.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { useActiveServer } from "@/lib/context/ServerContext";
import type { Category } from "@/db/schema";
import { ActionButton } from "../ui/ActionButton";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

/** Renders a modal dialog allowing users to edit or delete a category. */
export function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { updateCategory, removeCategory } = useActiveServer();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsConfirmingDelete(false);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const isChanged = name.trim() !== category.name;
  const isValid = name.trim().length > 0;
  const canSave = isChanged && isValid && !isLoading && !isDeleting;

  /** Handles the update of the category name via PATCH. */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Error updating the category.");
      }

      const updated = await response.json();
      updateCategory(updated);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Handles the deletion of the category via DELETE. */
  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    if (isDeleting || isLoading) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting the category.");
      }

      removeCategory(category.id);
      router.refresh();
      onClose();
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

        <h2 className="text-xl font-bold text-white mb-1">Edit Category</h2>
        <p className="text-sm text-muted mb-6">
          Change category details or delete this category.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
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
              placeholder="CATEGORY NAME"
              disabled={isLoading || isDeleting}
              autoFocus
              className="w-full bg-background border border-surface/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex items-center justify-between pt-4">
            <ActionButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isLoading}
              icon={Trash2}
            >
              {isConfirmingDelete ? "Sure?" : "Delete Category"}
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
