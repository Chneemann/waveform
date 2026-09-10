/**
 * @file components/members/MemberList.tsx
 * @description Renders categorized lists of online and offline members using the UserContext.
 */

import { useMemo } from "react";
import { MemberItem } from "@/components/members/MemberItem";
import { User } from "@/db/schema";

interface MemberListProps {
  members: User[];
}

/** Renders online and offline community members in distinct sections. */
export function MemberList({ members = [] }: MemberListProps) {
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
