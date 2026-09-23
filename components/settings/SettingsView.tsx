/**
 * @file components/settings/SettingsView.tsx
 * @description Settings view component for updating user profile attributes like online status and avatar color.
 */

"use client";

import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserStatus } from "@/db/schema";
import {
  MEMBER_STATUS_COLOR_CLASSES,
  MEMBER_COLOR_OPTIONS,
} from "@/lib/constants/member.styles";
import { UserRound, Palette } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";

/** Renders the user settings view allowing profile, online status, and color customizations. */
export function SettingsView() {
  const { currentUser, updateCurrentUser } = useUser();

  const statuses: { label: string; value: UserStatus }[] = [
    { label: "Online", value: "ONLINE" },
    { label: "Offline", value: "OFFLINE" },
    { label: "AFK", value: "AFK" },
    { label: "DND", value: "DND" },
  ];

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Settings</h1>
        <p className="text-sm text-muted">
          Manage your profile, status, and account settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-surface border border-muted/20 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={currentUser} size="md" />
          <div>
            <h2 className="text-lg font-bold text-white">
              {currentUser.username}
            </h2>
            <p className="text-sm text-muted">{currentUser.email}</p>
          </div>
        </div>

        {/* Status Selection */}
        <div className="border-t border-muted/20 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserRound className="w-4 h-4 text-muted" /> Online Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statuses.map((status) => {
              const isSelected = currentUser.status === status.value;
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => updateProfile({ status: status.value })}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent/10 text-white font-semibold"
                      : "border-muted/20 hover:border-muted/40 text-muted hover:text-white cursor-pointer"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      MEMBER_STATUS_COLOR_CLASSES[status.value]
                    }`}
                  />
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Selection */}
        <div className="border-t border-muted/20 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted" /> Profile Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {MEMBER_COLOR_OPTIONS.map((colorClass) => {
              const isSelected = currentUser.color === colorClass;
              return (
                <button
                  key={colorClass}
                  type="button"
                  onClick={() => updateProfile({ color: colorClass })}
                  className={`w-8 h-8 rounded-full ${colorClass} transition-all flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-white ring-offset-2 ring-offset-surface scale-110"
                      : "hover:scale-105 opacity-80 hover:opacity-100 cursor-pointer"
                  }`}
                  aria-label={`Select ${colorClass}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
