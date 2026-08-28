/**
 * @file next.config.ts
 * @description Next.js framework configuration file defining standalone output builds, image optimizations, and Turbopack root settings.
 */

import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone" as const,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
