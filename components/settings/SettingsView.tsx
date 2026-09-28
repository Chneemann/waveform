/**
 * @file components/settings/SettingsView.tsx
 * @description Settings view layout component managing user profile updates, editing forms, and account deletion options.
 */

"use client";

import { useUser } from "@/lib/context/UserContext";
import { SettingsProfileCard } from "./SettingsProfileCard";
import { SettingsDeleteAccountCard } from "./SettingsDeleteAccountCard";
import { SettingsProfileEditCard } from "./SettingsProfileEditCard";

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
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 min-h-0 pr-1">
      <SettingsProfileCard onUpdate={updateProfile} />
      <SettingsProfileEditCard />
      <SettingsDeleteAccountCard />
    </div>
  );
}
