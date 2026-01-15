import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * <ai_context>
 * Users table for storing user profile information.
 * Linked to Clerk authentication via userId.
 * </ai_context>
 */

export const membershipEnum = pgEnum("membership", ["free", "pro", "premium"])

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    membership: membershipEnum("membership").notNull().default("free"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date())
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
