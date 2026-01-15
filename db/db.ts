import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "@/db/schema"

/**
 * <ai_context>
 * Database connection using Drizzle ORM with Vercel Postgres.
 * All schema tables are registered here for type-safe queries.
 * </ai_context>
 */
export const db = drizzle(sql, { schema })
