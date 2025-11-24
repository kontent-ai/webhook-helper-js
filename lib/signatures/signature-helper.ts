import { createHmac, timingSafeEqual } from "node:crypto";
import { type ParseResult, parseWebhookResponse } from "../models/parse-webhook.js";
import type { WebhookResponse } from "../models/webhook-schemas.js";

export const parseSignedWebhookResponse = (
  jsonPayload: string,
  secret: string,
  signature: string,
): ParseResult<WebhookResponse> => {
  if (!isSignatureValid(jsonPayload, secret, signature)) {
    return { success: false, error: new Error("Webhook signature validation failed") };
  }

  try {
    const parsedPayload = JSON.parse(jsonPayload) as unknown;

    return parseWebhookResponse(parsedPayload);
  } catch (error) {
    return {
      success: false,
      error: new Error(
        `Failed to parse webhook payload: ${error instanceof Error ? error.message : "Invalid JSON"}`,
      ),
    };
  }
};

export const isSignatureValid = (
  jsonPayload: string,
  secret: string,
  signature: string,
): boolean => {
  const expectedSignature = getHashFromString(jsonPayload, secret);

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(expectedSignature, "utf8"), Buffer.from(signature, "utf8"));
  } catch {
    return false;
  }
};

const getHashFromString = (jsonPayload: string, secret: string): string =>
  createHmac("sha256", secret).update(jsonPayload, "utf8").digest("base64");

/**
 * Normalizes line breaks in a string by replacing all line break variations with CRLF (`\r\n`).
 */
export const replaceLinebreaks = (data: string): string => data.replace(/[\r\n]+/gm, "\r\n");
