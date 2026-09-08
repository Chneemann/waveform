/**
 * @file app/lib/legal.ts
 * @description Defines legal navigation configurations, icon mappings, and dynamic copyright text generators.
 */

import { FileText, ShieldCheck } from "lucide-react";

/** List of legal navigation links with their corresponding route paths and icon identifiers. */
export const LEGAL_LINKS = [
  { name: "Imprint", href: "/imprint", iconName: "FileText" },
  { name: "Privacy Policy", href: "/privacy", iconName: "ShieldCheck" },
] as const;

/** Mapping object linking string identifiers to their respective Lucide icon components. */
export const ICON_MAP = {
  FileText: FileText,
  ShieldCheck: ShieldCheck,
};

/** Generates the standardized copyright notice string with the given year. */
export const COPYRIGHT_TEXT = (year: number) =>
  `© ${year} André Kempf. All rights reserved.`;
