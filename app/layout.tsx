/**
 * @file app/layout.tsx
 * @description Root layout component that wraps the entire application, providing global CSS styles, base HTML structure, and page metadata.
 */

import { SessionProvider } from "next-auth/react";
import "./globals.css";

/**
 * Global application metadata configuration.
 */
export const metadata = {
  title: "Waveform",
  description: "Realtime Chat Application",
};

/**
 * Root layout component serving as the top-level wrapper for all pages.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child nodes to be rendered within the main layout wrapper.
 * @returns {JSX.Element} The root HTML document structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
