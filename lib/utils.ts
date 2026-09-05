/**
 * @file lib/utils.ts
 * @description Utility module providing helper functions for classes and data validation.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Regex pattern to validate standard v1-v5 UUIDs.
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Checks whether a given string is a valid UUID.
 *
 * @param {string} id - The string to validate.
 * @returns {boolean} True if valid UUID, false otherwise.
 */
export function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

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
