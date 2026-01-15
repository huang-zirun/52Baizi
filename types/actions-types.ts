/**
 * <ai_context>
 * ActionState type for consistent server action responses.
 * Used by all server actions to return success/failure states with data.
 * </ai_context>
 */
export type ActionState<T> =
    | { isSuccess: true; message: string; data: T }
    | { isSuccess: false; message: string; data?: never }
