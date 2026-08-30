/**
 * @file lib/constants/member.styles.ts
 */

import type { UserStatus } from "@/db/schema";

/**
 * Shared Tailwind CSS class constants mapping available member background color keys to their respective CSS utility classes.
 */
export const MEMBER_COLOR_CLASSES: Record<string, string> = {
  "bg-indigo-500": "bg-indigo-500",
  "bg-emerald-500": "bg-emerald-500",
  "bg-rose-500": "bg-rose-500",
  "bg-amber-500": "bg-amber-500",
  "bg-sky-500": "bg-sky-500",
  "bg-violet-500": "bg-violet-500",
  "bg-fuchsia-500": "bg-fuchsia-500",
  "bg-cyan-500": "bg-cyan-500",
};

/**
 * List of available color option class names for member icon selection.
 * Dynamically generated from MEMBER_COLOR_OPTIONS to avoid duplicate maintenance.
 */
export const MEMBER_COLOR_OPTIONS = Object.keys(MEMBER_COLOR_CLASSES);

/**
 * Mapping of user status keys to their respective Tailwind CSS indicator background colors.
 */
export const MEMBER_STATUS_COLOR_CLASSES: Record<UserStatus, string> = {
  ONLINE: "bg-emerald-500",
  IDLE: "bg-amber-500",
  DND: "bg-rose-500",
  OFFLINE: "bg-slate-500",
};
