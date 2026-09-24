/**
 * @file components/settings/SettingsHeader.tsx
 * @description Header section for the settings view with title and subtitle.
 */

"use client";

/** Renders the settings view header containing the main title and description. */
export function SettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">User Settings</h1>
      <p className="text-sm text-muted">
        Manage your profile, status, and account settings.
      </p>
    </div>
  );
}
