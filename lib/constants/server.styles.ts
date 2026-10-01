/**
 * @file lib/constants/server.styles.ts
 * @description Shared Tailwind CSS styling constants, color mappings, and active/inactive state utility classes for server navigation icons.
 */

/** Shared Tailwind CSS class constants mapping available server background color keys to their respective CSS utility classes. */
export const SERVER_COLOR_CLASSES: Record<string, string> = {
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

/** List of available color option class names for server icon selection. */
export const SERVER_COLOR_OPTIONS = Object.keys(SERVER_COLOR_CLASSES);

/** Common Tailwind CSS class constants defining base, active, and inactive visual states for server navigation icons. */
export const BASE_ICON_STYLES =
  "w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-md shrink-0";
export const ACTIVE_ICON_STYLES =
  "rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-surface cursor-default pointer-events-none opacity-100";
export const INACTIVE_ICON_STYLES =
  "rounded-3xl opacity-80 hover:opacity-100 hover:rounded-xl hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-accent/40 cursor-pointer active:scale-95";
