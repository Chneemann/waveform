/**
 * @file components/sidebar/MemberSidebar.tsx
 * @description Sidebar component displaying the list of active server/chat members and their online status.
 */

/**
 * Renders the member sidebar showing online users and their profile avatars.
 *
 * @returns {JSX.Element} The rendered member sidebar navigation container.
 */
export function MemberSidebar() {
  return (
    <aside className="w-60 bg-[hsl(200_6%_8%)] border-l border-neutral-800 p-4 shrink-0 h-full overflow-y-auto">
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
        Online — 1
      </h2>
      <div className="flex items-center gap-3 py-1.5">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-white">
          U
        </div>
        <span className="text-sm font-medium text-foreground">User</span>
      </div>
    </aside>
  );
}
