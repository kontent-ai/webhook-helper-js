export type ParseResult<T> = Readonly<
  { success: true; data: T } | { success: false; error: Error }
>;
