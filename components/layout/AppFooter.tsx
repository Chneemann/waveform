/**
 * @file app/components/layout/AppFooter.tsx
 * @description Site footer component rendering legal compliance links and dynamic copyright notice.
 */

"use client";

import Link from "next/link";
import { LEGAL_LINKS, COPYRIGHT_TEXT, ICON_MAP } from "@/lib/legal";

/** Renders the site footer containing the dynamic copyright notice and legal compliance links with icons. */
export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full shrink-0 bg-background text-xs mt-4">
      <div className="w-full flex flex-row flex-wrap justify-between items-center gap-2">
        {/* Left: Copyright Notice */}
        <p className="text-muted truncate">{COPYRIGHT_TEXT(currentYear)}</p>

        {/* Right: Legal & Compliance Links */}
        <div className="flex items-center gap-2 sm:gap-4 text-muted">
          {LEGAL_LINKS.map((link, index) => {
            const IconComponent = ICON_MAP[link.iconName];

            return (
              <div key={link.href} className="flex items-center gap-2 sm:gap-4">
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                  title={link.name}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0 text-foreground-muted group-hover:text-foreground transition-colors" />
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
                {index < LEGAL_LINKS.length - 1 && (
                  <span className="text-foreground-muted">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
