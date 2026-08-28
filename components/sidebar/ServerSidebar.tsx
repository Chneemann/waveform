/**
 * @file components/sidebar/ServerSidebar.tsx
 * @description Sidebar navigation component for switching between servers and direct messages.
 */

/**
 * Navigation bar for switching between servers and direct messages.
 *
 * @returns {JSX.Element} The rendered server sidebar component.
 */
export function ServerSidebar() {
  return (
    <aside className="w-18 bg-surface flex flex-col items-center py-3 gap-3 border-r border-background shrink-0 h-full justify-between">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center font-bold text-white cursor-pointer hover:rounded-xl transition-all shadow-md">
          W
        </div>
        <div className="w-8 h-0.5 bg-background/80 rounded-full" />
        <div className="w-12 h-12 rounded-3xl bg-background flex items-center justify-center text-muted hover:bg-accent hover:text-white hover:rounded-xl transition-all cursor-pointer">
          +
        </div>
      </div>
    </aside>
  );
}
