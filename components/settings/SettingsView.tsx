/**
 * @file components/settings/SettingsView.tsx
 * @description Main settings container component for managing user profile and preferences.
 */

"use client";

import { UserAvatar } from "@/components/ui/UserAvatar";
import { User } from "@/db/schema";

interface SettingsViewProps {
  userId: string;
  currentUser: User;
}

export function SettingsView({ userId, currentUser }: SettingsViewProps) {
  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full w-full bg-background text-white gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
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
      </div>
    </div>
  );
}
