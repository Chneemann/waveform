/**
 * @file components/ui/MobileDrawer.tsx
 * @description Slide-out drawer component for mobile views with optional responsive breakpoint behavior.
 */

"use client";

import { clsx } from "clsx";

interface MobileDrawerProps {
  isOpen: boolean;
  side: "left" | "right";
  breakpoint?: "md" | "none";
  children: React.ReactNode;
}

/**
 * Slide-out drawer component designed for mobile layouts with configurable side positioning and responsive display logic.
 *
 * @param {MobileDrawerProps} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the drawer is currently expanded or hidden.
 * @param {"left" | "right"} props.side - The edge of the viewport from which the drawer slides out.
 * @param {"md" | "none"} [props.breakpoint="none"] - Optional breakpoint at which the drawer becomes statically positioned.
 * @param {React.ReactNode} props.children - The elements to render inside the drawer container.
 * @returns {JSX.Element} The rendered mobile drawer component.
 */
export function MobileDrawer({
  isOpen,
  side,
  breakpoint = "none",
  children,
}: MobileDrawerProps) {
  const isLeft = side === "left";

  const translateHidden = isLeft ? "-translate-x-full" : "translate-x-full";

  const breakpointStatic =
    breakpoint === "md" ? "md:static md:translate-x-0 md:w-auto" : "";

  return (
    <>
      <div
        className={clsx(
          "fixed inset-y-0 z-40 flex transform transition-transform duration-200 ease-in-out h-full w-full pointer-events-none",
          isLeft ? "left-0 justify-start" : "right-0 justify-end",
          breakpointStatic,
          isOpen ? "translate-x-0" : translateHidden,
        )}
      >
        <div className="pointer-events-auto h-full w-full sm:w-auto flex justify-end bg-surface">
          {children}
        </div>
      </div>
    </>
  );
}
