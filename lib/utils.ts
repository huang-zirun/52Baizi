import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * <ai_context>
 * Utility functions for the application.
 * cn() is used for conditional class name merging with Tailwind.
 * </ai_context>
 */

/**
 * Merge class names with Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs))
}
