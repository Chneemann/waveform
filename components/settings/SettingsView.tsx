/**
 * @file components/settings/SettingsView.tsx
 * @description Main settings container component for managing user profile and preferences.
 */

"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserStatus, User } from "@/db/schema";
import { MEMBER_STATUS_COLOR_CLASSES } from "@/lib/constants/member.styles";
import { UserRound } from "lucide-react";

/** Props for the SettingsView component. */
interface SettingsViewProps {
  userId: string;
  currentUser: User;
}

/** Renders the user settings view for profile management and status selection. */
export function SettingsView({ userId, currentUser }: SettingsViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(
    currentUser.status,
  );

  const statuses: { label: string; value: UserStatus }[] = [
    { label: "Online", value: "ONLINE" },
    { label: "Offline", value: "OFFLINE" },
    { label: "AFK", value: "AFK" },
    { label: "DND", value: "DND" },
  ];

  /** Updates local status state on user selection. */
  const handleStatusChange = (newStatus: UserStatus) => {
    setSelectedStatus(newStatus);
  };

  if (!currentUser) return null;

  const userWithUpdatedSettings = {
    ...currentUser,
    status: selectedStatus,
  };

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
          <UserAvatar user={userWithUpdatedSettings} size="md" />
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
              const isSelected = selectedStatus === status.value;
              const statusBgColor = MEMBER_STATUS_COLOR_CLASSES[status.value];

              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleStatusChange(status.value)}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent/10 text-white font-semibold"
                      : "border-muted/20 hover:border-muted/40 text-muted hover:text-white cursor-pointer"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${statusBgColor}`}
                  />
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
