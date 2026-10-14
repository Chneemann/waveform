/**
 * @file app/(app)/[...slug]/page.tsx
 * @description Catch-all route handler for undefined paths within the (app) route group, triggering a Next.js 404 page.
 */

import { notFound } from "next/navigation";

/** Catches any unmatched nested sub-routes inside the application layout and delegates to the Next.js notFound handler. */
export default function CatchAllNotFound() {
  notFound();
}
