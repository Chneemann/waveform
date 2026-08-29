/**
 * @file app/(app)/page.tsx
 * @description Main application layout page featuring a dynamic header and default welcome screen.
 */

import { AppHeader } from "@/components/layout/AppHeader";

/**
 * Renders the default application page with the header and central welcome message.
 *
 * @returns {JSX.Element} The rendered application page view.
 */
export default function AppPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background p-4">
      {/* Dynamic Header */}
      <AppHeader />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-muted max-w-sm">
          Select a server from the left side or start a chat with your friends.
        </p>
      </div>
    </div>
  );
}
