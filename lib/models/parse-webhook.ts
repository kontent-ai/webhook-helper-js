import { fromZodError } from "zod-validation-error";
import { type WebhookResponse, webhookResponseSchema } from "./webhook-schemas.js";

export type ParseResult<T> = { success: true; data: T } | { success: false; error: Error };

export const parseWebhookResponse = (data: unknown): ParseResult<WebhookResponse> => {
  const result = webhookResponseSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: fromZodError(result.error) };
  }

  return result;
};
