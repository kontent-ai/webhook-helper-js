import { fromZodError } from "zod-validation-error";
import type { ParseResult } from "../utils/types.js";
import { type WebhookResponse, webhookResponseSchema } from "./webhook-schemas.js";

export const parseWebhookResponse = (data: unknown): ParseResult<WebhookResponse> => {
  const result = webhookResponseSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: fromZodError(result.error) };
  }

  return result;
};
