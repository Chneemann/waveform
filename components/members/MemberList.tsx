/**
 * @file components/members/MemberList.tsx
 * @description Renders categorized online and offline member lists.
 */

import { useMemo } from "react";
import { MemberItem, type Member } from "@/components/members/MemberItem";

/**
 * Renders categorized lists of online and offline members with user counters.
 *
 * @param {Object} props - Component properties.
 * @param {Member[]} [props.members=[]] - Array of member objects to group and render.
 * @returns {JSX.Element} The rendered member list container.
 */
export function MemberList({ members = [] }: { members?: Member[] }) {
  const { onlineMembers, offlineMembers } = useMemo(() => {
    return {
      onlineMembers: members.filter((m) => m.status !== "OFFLINE"),
      offlineMembers: members.filter((m) => m.status === "OFFLINE"),
    };
  }, [members]);

  return (
    <div className="w-full bg-surface p-3 shrink-0 h-full overflow-y-auto space-y-4">
      {/* Online Section */}
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
          Online — {onlineMembers.length}
        </h2>
        <div className="space-y-0.5">
          {onlineMembers.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
          {onlineMembers.length === 0 && (
            <p className="text-xs text-muted/60 px-2 italic">
              No members online
            </p>
          )}
        </div>
      </div>

      {/* Offline Section */}
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
          Offline — {offlineMembers.length}
        </h2>
        <div className="space-y-0.5">
          {offlineMembers.map((member) => (
            <MemberItem key={member.id} member={member} isOffline />
          ))}
        </div>
      </div>
    </div>
  );
}
