/**
 * @file lib/constants/server.styles.ts
 * @description Shared Tailwind CSS styling constants, color mappings, and active/inactive state utility classes for server navigation icons.
 */

/**
 * Shared Tailwind CSS class constants mapping available server background color keys to their respective CSS utility classes.
 */
export const SERVER_COLOR_CLASSES: Record<string, string> = {
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
 * List of available color option class names for server icon selection.
 * Dynamically generated from SERVER_COLOR_CLASSES to avoid duplicate maintenance.
 */
export const SERVER_COLOR_OPTIONS = Object.keys(SERVER_COLOR_CLASSES);

/**
 * Common Tailwind CSS class constants defining base, active, and inactive visual states for server navigation icons.
 */
export const BASE_ICON_STYLES =
  "w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-md shrink-0";
export const ACTIVE_ICON_STYLES =
  "rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-surface cursor-default pointer-events-none opacity-100";
export const INACTIVE_ICON_STYLES =
  "rounded-3xl opacity-80 hover:opacity-100 hover:rounded-xl hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-accent/40 cursor-pointer active:scale-95";
