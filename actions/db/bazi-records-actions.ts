"use server"

import { db } from "@/db/db"
import {
    InsertBaziRecord,
    SelectBaziRecord,
    baziRecordsTable
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * <ai_context>
 * Server actions for bazi record CRUD operations.
 * </ai_context>
 */

export async function createBaziRecordAction(
    record: InsertBaziRecord
): Promise<ActionState<SelectBaziRecord>> {
    try {
        const [newRecord] = await db
            .insert(baziRecordsTable)
            .values(record)
            .returning()
        return {
            isSuccess: true,
            message: "Bazi record created successfully",
            data: newRecord
        }
    } catch (error) {
        console.error("Error creating bazi record:", error)
        return { isSuccess: false, message: "Failed to create bazi record" }
    }
}

export async function getBaziRecordsByUserIdAction(
    userId: string
): Promise<ActionState<SelectBaziRecord[]>> {
    try {
        const records = await db.query.baziRecordsTable.findMany({
            where: eq(baziRecordsTable.userId, userId),
            orderBy: (records, { desc }) => [desc(records.createdAt)]
        })
        return {
            isSuccess: true,
            message: "Bazi records retrieved successfully",
            data: records
        }
    } catch (error) {
        console.error("Error getting bazi records:", error)
        return { isSuccess: false, message: "Failed to get bazi records" }
    }
}

export async function getBaziRecordByIdAction(
    id: string
): Promise<ActionState<SelectBaziRecord | null>> {
    try {
        const record = await db.query.baziRecordsTable.findFirst({
            where: eq(baziRecordsTable.id, id)
        })
        return {
            isSuccess: true,
            message: "Bazi record retrieved successfully",
            data: record ?? null
        }
    } catch (error) {
        console.error("Error getting bazi record:", error)
        return { isSuccess: false, message: "Failed to get bazi record" }
    }
}

export async function updateBaziRecordAction(
    id: string,
    data: Partial<InsertBaziRecord>
): Promise<ActionState<SelectBaziRecord>> {
    try {
        const [updatedRecord] = await db
            .update(baziRecordsTable)
            .set(data)
            .where(eq(baziRecordsTable.id, id))
            .returning()

        return {
            isSuccess: true,
            message: "Bazi record updated successfully",
            data: updatedRecord
        }
    } catch (error) {
        console.error("Error updating bazi record:", error)
        return { isSuccess: false, message: "Failed to update bazi record" }
    }
}

export async function deleteBaziRecordAction(
    id: string
): Promise<ActionState<void>> {
    try {
        await db.delete(baziRecordsTable).where(eq(baziRecordsTable.id, id))
        return {
            isSuccess: true,
            message: "Bazi record deleted successfully",
            data: undefined
        }
    } catch (error) {
        console.error("Error deleting bazi record:", error)
        return { isSuccess: false, message: "Failed to delete bazi record" }
    }
}
