/**
 * @file app/(app)/page.tsx
 * @description Main dashboard page displaying the primary chat view with header, message area, and input control.
 */

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";

/**
 * Renders the main application dashboard containing the general chat interface.
 *
 * @returns {Promise<JSX.Element>} The rendered application dashboard page.
 */
export default async function ApplicationDashboardPage() {
  return (
    <main className="flex-1 flex flex-col h-full min-w-0 bg-background">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
          This is the beginning of the #general channel.
        </div>
      </div>

      <ChatInput />
    </main>
  );
}
