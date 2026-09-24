/**
 * @file components/settings/SettingsView.tsx
 * @description Main container for user settings view displaying header and profile card.
 */

"use client";

import { useUser } from "@/lib/context/UserContext";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsProfileCard } from "./SettingsProfileCard";

/** Renders the settings view layout for managing user profile settings. */
export function SettingsView() {
  const { currentUser, updateCurrentUser } = useUser();

  /** Sends optimistic updates to context and persists profile changes to the server API. */
  const updateProfile = (fields: Partial<typeof currentUser>) => {
    updateCurrentUser(fields);
    fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }).catch((err) => console.error("Failed to update profile", err));
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full w-full bg-background text-white gap-6">
      <SettingsHeader />
      <SettingsProfileCard onUpdate={updateProfile} />
    </div>
  );
}
