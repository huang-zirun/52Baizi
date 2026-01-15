import { pgEnum, pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core"
import { usersTable } from "./users-schema"

/**
 * <ai_context>
 * Bazi records table for storing user's bazi calculation results.
 * Each record represents one bazi reading with birth information and calculated pillars.
 * </ai_context>
 */

export const genderEnum = pgEnum("gender", ["male", "female"])

export const baziRecordsTable = pgTable("bazi_records", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
        .references(() => usersTable.userId, { onDelete: "cascade" })
        .notNull(),
    name: text("name").notNull(),
    gender: genderEnum("gender").notNull(),
    birthYear: integer("birth_year").notNull(),
    birthMonth: integer("birth_month").notNull(),
    birthDay: integer("birth_day").notNull(),
    birthHour: integer("birth_hour").notNull(),
    birthMinute: integer("birth_minute"),
    birthPlace: text("birth_place"),
    yearPillar: text("year_pillar"),
    monthPillar: text("month_pillar"),
    dayPillar: text("day_pillar"),
    hourPillar: text("hour_pillar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date())
})

export type InsertBaziRecord = typeof baziRecordsTable.$inferInsert
export type SelectBaziRecord = typeof baziRecordsTable.$inferSelect
