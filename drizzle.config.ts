/**
 * @file drizzle.config.ts
 * @description Drizzle Kit configuration file for managing database migrations, schema paths, and database credentials.
 */

import { defineConfig } from "drizzle-kit";

/**
 * Configuration object exported for Drizzle Kit CLI commands.
 */
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
