import { type WebhookResponse, webhookResponseSchema } from "./webhook-schemas.js";

export type SafeParseResult<T> = { success: true; data: T } | { success: false; error: Error };

/**
 * Safely parses and validates a webhook response payload without throwing errors.
 */
export const parseWebhookResponse = (data: unknown): SafeParseResult<WebhookResponse> => {
  return webhookResponseSchema.safeParse(data);
};
