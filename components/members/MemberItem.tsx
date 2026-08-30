/**
 * @file components/members/MemberItem.tsx
 * @description Single member item displaying avatar, username, and status badge.
 */

import type { UserStatus } from "@/db/schema";
import { clsx } from "clsx";
import { UserAvatar } from "../ui/UserAvatar";

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
  return (
    <div
      className={clsx(
        "flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors cursor-pointer group",
        isOffline && "opacity-60",
      )}
    >
      <div className="relative shrink-0">
        <UserAvatar user={member} size="md" />
      </div>
      <span className="text-sm font-medium text-muted group-hover:text-white truncate">
        {member.username}
      </span>
    </div>
  );
}
