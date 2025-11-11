import type { ZodError } from "zod";
import { type WebhookResponse, webhookResponseSchema } from "./webhook-schemas.js";

/**
 * Parses and validates a webhook response payload.
 *
 * This function validates the structure of incoming webhook data against the Zod schema,
 * providing runtime type safety and detailed error messages if validation fails.
 */
export const parseWebhookResponse = (data: unknown): WebhookResponse => {
  return webhookResponseSchema.parse(data);
};

export type SafeParseResult<T> = { success: true; data: T } | { success: false; error: ZodError };

/**
 * Safely parses and validates a webhook response payload without throwing errors.
 *
 * This function is useful when you want to handle validation errors programmatically
 * instead of using try-catch blocks. Returns a result object that indicates success
 * or failure with detailed error information.
 */
export const parseWebhookResponseSafe = (data: unknown): SafeParseResult<WebhookResponse> => {
  return webhookResponseSchema.safeParse(data);
};
