export type ParseResult<T> = { success: true; data: T } | { success: false; error: Error };
