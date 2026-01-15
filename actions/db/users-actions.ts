"use server"

import { db } from "@/db/db"
import { InsertUser, SelectUser, usersTable } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * <ai_context>
 * Server actions for user CRUD operations.
 * </ai_context>
 */

export async function createUserAction(
    user: InsertUser
): Promise<ActionState<SelectUser>> {
    try {
        const [newUser] = await db.insert(usersTable).values(user).returning()
        return {
            isSuccess: true,
            message: "User created successfully",
            data: newUser
        }
    } catch (error) {
        console.error("Error creating user:", error)
        return { isSuccess: false, message: "Failed to create user" }
    }
}

export async function getUserByUserIdAction(
    userId: string
): Promise<ActionState<SelectUser | null>> {
    try {
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.userId, userId)
        })
        return {
            isSuccess: true,
            message: "User retrieved successfully",
            data: user ?? null
        }
    } catch (error) {
        console.error("Error getting user:", error)
        return { isSuccess: false, message: "Failed to get user" }
    }
}

export async function updateUserAction(
    userId: string,
    data: Partial<InsertUser>
): Promise<ActionState<SelectUser>> {
    try {
        const [updatedUser] = await db
            .update(usersTable)
            .set(data)
            .where(eq(usersTable.userId, userId))
            .returning()

        return {
            isSuccess: true,
            message: "User updated successfully",
            data: updatedUser
        }
    } catch (error) {
        console.error("Error updating user:", error)
        return { isSuccess: false, message: "Failed to update user" }
    }
}

export async function deleteUserAction(
    userId: string
): Promise<ActionState<void>> {
    try {
        await db.delete(usersTable).where(eq(usersTable.userId, userId))
        return {
            isSuccess: true,
            message: "User deleted successfully",
            data: undefined
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { isSuccess: false, message: "Failed to delete user" }
    }
}
