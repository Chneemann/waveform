/**
 * @file components/ui/MobileDrawer.tsx
 * @description Slide-out drawer component for mobile views with configurable side placement, responsive breakpoint behavior, and backdrop overlay.
 */

"use client";

import { clsx } from "clsx";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side: "left" | "right";
  breakpoint: "md" | "xl";
  children: React.ReactNode;
}

/**
 * Renders a responsive drawer container that slides in from either side on mobile viewports and transitions to a static layout at specified breakpoints.
 *
 * @param {MobileDrawerProps} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility state of the drawer overlay on mobile viewports.
 * @param {() => void} props.onClose - Callback function triggered when clicking the backdrop overlay to close the drawer.
 * @param {"left" | "right"} props.side - The screen edge from which the drawer slides out.
 * @param {"md" | "xl"} props.breakpoint - Tailwind responsive breakpoint at which the drawer becomes static and hides the mobile backdrop.
 * @param {React.ReactNode} props.children - Content rendered within the drawer body.
 * @returns {JSX.Element} The drawer element alongside its conditional backdrop overlay.
 */
export function MobileDrawer({
  isOpen,
  onClose,
  side,
  breakpoint,
  children,
}: MobileDrawerProps) {
  const isLeft = side === "left";

  const translateHidden = isLeft ? "-translate-x-full" : "translate-x-full";
  const breakpointStatic =
    breakpoint === "md"
      ? "md:static md:translate-x-0"
      : "xl:static xl:translate-x-0";
  const breakpointHidden = breakpoint === "md" ? "md:hidden" : "xl:hidden";

  return (
    <>
      <div
        className={clsx(
          "fixed inset-y-0 z-40 flex transform transition-transform duration-200 ease-in-out h-full",
          isLeft ? "left-0" : "right-0",
          breakpointStatic,
          isOpen ? "translate-x-0" : translateHidden,
        )}
      >
        {children}
      </div>

      {isOpen && (
        <div
          className={clsx("fixed inset-0 bg-black/60 z-30", breakpointHidden)}
          onClick={onClose}
        />
      )}
    </>
  );
}
