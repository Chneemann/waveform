/**
 * @file app/(app)/layout.tsx
 * @description Main application layout component that manages responsive sidebars and drawer overlays.
 */

"use client";

import { useSidebarStore } from "@/lib/stores/useSidebarStore";
import { ServerSidebar } from "@/components/sidebar/ServerSidebar";
import { ChannelSidebar } from "@/components/sidebar/ChannelSidebar";
import { MemberSidebar } from "@/components/sidebar/MemberSidebar";
import { UserProfile } from "@/components/sidebar/UserProfile";
import { MobileDrawer } from "@/components/ui/MobileDrawer";

/**
 * Client component serving as the primary application layout, handling the server, channel, and member sidebars with mobile drawer support.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child layout or page content to render in the central main view.
 * @returns {JSX.Element} The application layout structure with responsive sidebars.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isNavOpen, isMembersOpen, closeAll } = useSidebarStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Left Navigation: Server + Channels + User Profile */}
      <MobileDrawer
        isOpen={isNavOpen}
        onClose={closeAll}
        side="left"
        breakpoint="md"
      >
        <div className="flex flex-col h-full shrink-0">
          <div className="flex flex-1 min-h-0">
            <ServerSidebar />
            <ChannelSidebar />
          </div>
          <UserProfile />
        </div>
      </MobileDrawer>

      {/* Center: Main Area */}
      <div className="flex-1 flex min-w-0">{children}</div>

      {/* Right: List of Members */}
      <MobileDrawer
        isOpen={isMembersOpen}
        onClose={closeAll}
        side="right"
        breakpoint="xl"
      >
        <MemberSidebar />
      </MobileDrawer>
    </div>
  );
}
