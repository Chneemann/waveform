/**
 * @file app/(app)/settings/page.tsx
 * @description Server component page for user settings, handling session authentication and rendering SettingsView.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";
import AppFooter from "@/components/layout/AppFooter";

/** Renders the settings page layout with session validation. */
export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-full w-full bg-background p-4">
      <SettingsView />
      <AppFooter />
    </div>
  );
}
