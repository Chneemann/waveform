/**
 * @file components/sidebar/MemberSidebar.tsx
 * @description Sidebar component displaying lists of online and offline channel members with avatar and status indicators.
 */

/**
 * Renders the member sidebar showing categorized online and offline user statuses.
 *
 * @returns {JSX.Element} The rendered member sidebar interface.
 */
export function MemberSidebar() {
  return (
    <div className="w-full bg-surface p-3 shrink-0 h-full overflow-y-auto space-y-4">
      {/* Online Section */}
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
          Online — 1
        </h2>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                U
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </div>
            <span className="text-sm font-medium text-muted group-hover:text-white truncate">
              User 1
            </span>
          </div>
        </div>
      </div>

      {/* Offline Section */}
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
          Offline — 2
        </h2>
        <div className="space-y-0.5 opacity-65">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs text-white">
                U
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-500 ring-2 ring-surface" />
            </div>
            <span className="text-sm font-medium text-muted group-hover:text-white truncate">
              User 2
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs text-white">
                U
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-500 ring-2 ring-surface" />
            </div>
            <span className="text-sm font-medium text-muted group-hover:text-white truncate">
              User 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
