/**
 * @file components/ui/UserAvatar.tsx
 * @description Renders a user avatar with initials and an online status indicator badge.
 */

import type { UserStatus } from "@/db/schema";
import {
  MEMBER_COLOR_CLASSES,
  MEMBER_STATUS_COLOR_CLASSES,
} from "@/lib/constants/member.styles";
import { clsx } from "clsx";

/**
 * Size variants available for the UserAvatar component.
 *
 * @type AvatarSize
 */
type AvatarSize = "sm" | "md";

/**
 * User object properties required to render the avatar.
 *
 * @interface AvatarUser
 * @property {string} username - The display name of the user used to derive initials.
 * @property {string} color - Color key mapping to the avatar background style.
 * @property {UserStatus} status - The current online status of the user.
 */
export interface AvatarUser {
  username: string;
  color: string;
  status: UserStatus;
}

/**
 * Properties for the UserAvatar component.
 *
 * @interface UserAvatarProps
 * @property {AvatarUser} user - The user object containing display details and status.
 * @property {AvatarSize} [size="sm"] - The display size variant of the avatar.
 * @property {string} [className] - Optional custom CSS classes for styling adjustments.
 */
interface UserAvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
  className?: string;
}

const SIZE_MAP: Record<AvatarSize, { container: string; badge: string }> = {
  sm: { container: "w-8 h-8 text-xs", badge: "w-2.5 h-2.5" },
  md: { container: "w-10 h-10 text-sm", badge: "w-3 h-3" },
};

/**
 * Renders an avatar element displaying user initials along with a status badge.
 *
 * @param {UserAvatarProps} props - Component properties.
 * @returns {JSX.Element} The rendered UserAvatar element.
 */
export function UserAvatar({ user, size = "sm", className }: UserAvatarProps) {
  const { container, badge } = SIZE_MAP[size];

  const userBg = MEMBER_COLOR_CLASSES[user.color];
  const statusBg = MEMBER_STATUS_COLOR_CLASSES[user.status];

  return (
    <div className={clsx("relative shrink-0", className)}>
      <div
        className={clsx(
          container,
          userBg,
          "rounded-full flex items-center justify-center font-bold text-white shadow-sm",
        )}
      >
        {user.username.charAt(0).toUpperCase()}
      </div>

      <span
        className={clsx(
          "absolute bottom-0 right-0 rounded-full ring-2 ring-surface",
          badge,
          statusBg,
        )}
      />
    </div>
  );
}
