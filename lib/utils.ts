/**
 * @file lib/utils.ts
 * @description Utility module providing helper functions for conditionally merging and combining Tailwind CSS classes.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names or conditional class objects into a single string using clsx and tailwind-merge.
 * Resolves Tailwind CSS class conflicts intelligently.
 *
 * @param {...ClassValue[]} inputs - An array of class names, objects, or expressions to be combined.
 * @returns {string} The merged and optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
