/**
 * @file app/(app)/settings/page.tsx
 * @description Settings page for managing user profile, appearance, and account preferences.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";
import AppFooter from "@/components/layout/AppFooter";

export default async function SettingsPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const [currentUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, currentUserId))
    .limit(1);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-full w-full bg-background p-4">
      <SettingsView userId={currentUserId} currentUser={currentUser} />
      <AppFooter />
    </div>
  );
}
