/**
 * @file app/(app)/legal/page.tsx
 * @description Legal page component handling tabbed navigation between imprint and privacy policy views.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import ImprintPage from "./imprint/page";
import PrivacyPage from "./privacy/page";
import AppFooter from "@/components/layout/AppFooter";

/** Renders the legal section layout with tab-based toggling between imprint and privacy notices. */
export default function LegalPage() {
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: "imprint" | "privacy" =
    tabParam === "privacy" ? "privacy" : "imprint";

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 min-h-0 overflow-hidden">
      <AppHeader
        isLegalImprint={activeTab === "imprint"}
        isLegalPrivacy={activeTab === "privacy"}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 min-h-0 pr-1">
        {activeTab === "imprint" ? <ImprintPage /> : <PrivacyPage />}
      </div>

      <AppFooter />
    </div>
  );
}
