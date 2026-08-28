/**
 * @file db/index.ts
 * @description Database connection initialization module using Drizzle ORM and Postgres.js client.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL variable environment is missing.");
}

/**
 * PostgreSQL client instance initialized with the environment database connection string.
 */
const client = postgres(connectionString);

/**
 * Drizzle ORM database instance configured with the schema definition and PostgreSQL client.
 */
export const db = drizzle(client, { schema });
