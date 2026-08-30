/**
 * @file components/members/MemberItem.tsx
 * @description Single member item displaying avatar, username, and status badge.
 */

import type { UserStatus } from "@/db/schema";
import {
  MEMBER_COLOR_CLASSES,
  MEMBER_STATUS_COLOR_CLASSES,
} from "@/lib/constants/member.styles";
import { clsx } from "clsx";

/**
 * Interface representing a member user.
 *
 * @interface Member
 * @property {string} id - Unique identifier for the member.
 * @property {string} username - Display name of the member.
 * @property {string} [color] - Color identifier for the member avatar.
 * @property {UserStatus} status - Current online status of the member.
 */
export interface Member {
  id: string;
  username: string;
  color: string;
  status: UserStatus;
}

/**
 * Properties for the MemberItem component.
 *
 * @interface MemberItemProps
 * @property {Member} member - The member object containing user details.
 * @property {boolean} [isOffline=false] - Optional flag indicating whether the member should be displayed as offline.
 */
interface MemberItemProps {
  member: Member;
  isOffline?: boolean;
}

/**
 * MemberItem component to display a user's avatar, online status indicator, and username.
 *
 * @param {MemberItemProps} props - Component properties.
 * @returns {JSX.Element} The rendered member item.
 */
export function MemberItem({ member, isOffline = false }: MemberItemProps) {
  const userBg = member.color && MEMBER_COLOR_CLASSES[member.color];
  const statusBg = MEMBER_STATUS_COLOR_CLASSES[member.status];

  return (
    <div
      className={clsx(
        "flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group",
        isOffline && "opacity-60",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white",
            userBg,
          )}
        >
          {member.username ? member.username.charAt(0).toUpperCase() : "?"}
        </div>
        <span
          className={clsx(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface",
            statusBg,
          )}
        />
      </div>
      <span className="text-sm font-medium text-muted group-hover:text-white truncate">
        {member.username || "Unbekannt"}
      </span>
    </div>
  );
}
