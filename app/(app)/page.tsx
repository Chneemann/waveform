/**
 * @file app/(app)/page.tsx
 * @description Welcome page component displayed as the initial landing screen of the Waveform application.
 */

import Image from "next/image";

/**
 * Renders the welcome page featuring the Waveform logo, main heading, and confirmation text.
 *
 * @returns {JSX.Element} The rendered welcome page component.
 */
export default function WelcomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 relative w-24 h-24">
        <Image
          src="/logo.png"
          alt="Waveform Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-accent mb-2">
        Waveform
      </h1>
      <p className="max-w-md">
        The basic framework has been successfully set up!
      </p>
    </main>
  );
}
