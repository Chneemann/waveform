/**
 * @file lib/constants/member.styles.ts
 * @description Tailwind CSS color mapping constants and status options for server members.
 */

import type { UserStatus } from "@/db/schema";

/** Shared Tailwind CSS class constants mapping available member background color keys to their respective CSS utility classes. */
export const MEMBER_COLOR_CLASSES: Record<string, string> = {
  "bg-indigo-500": "bg-indigo-500",
  "bg-violet-500": "bg-violet-500",
  "bg-purple-500": "bg-purple-500",
  "bg-fuchsia-500": "bg-fuchsia-500",
  "bg-pink-500": "bg-pink-500",
  "bg-rose-500": "bg-rose-500",
  "bg-red-500": "bg-red-500",
  "bg-orange-500": "bg-orange-500",
  "bg-amber-500": "bg-amber-500",
  "bg-yellow-500": "bg-yellow-500",
  "bg-lime-500": "bg-lime-500",
  "bg-emerald-500": "bg-emerald-500",
  "bg-teal-500": "bg-teal-500",
  "bg-cyan-500": "bg-cyan-500",
  "bg-sky-500": "bg-sky-500",
  "bg-blue-500": "bg-blue-500",
};

/** List of available color option class names for member icon selection. */
export const MEMBER_COLOR_OPTIONS = Object.keys(MEMBER_COLOR_CLASSES);

/** Mapping of user status keys to their respective Tailwind CSS indicator background colors. */
export const MEMBER_STATUS_COLOR_CLASSES: Record<UserStatus, string> = {
  ONLINE: "bg-emerald-500",
  OFFLINE: "bg-slate-500",
  AFK: "bg-amber-500",
  DND: "bg-rose-500",
};

/** Selectable options array for user status values and human-readable labels. */
export const MEMBER_STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
  { label: "AFK", value: "AFK" },
  { label: "DND", value: "DND" },
];
