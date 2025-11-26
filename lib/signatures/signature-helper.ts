import { createHmac, timingSafeEqual } from "node:crypto";
import { parseWebhookResponse } from "../models/parse-webhook.js";
import type { WebhookResponse } from "../models/webhook-schemas.js";
import type { ParseResult } from "../utils/types.js";

export type SignatureParams = Readonly<{
  payload: string;
  secret: string;
  signature: string;
}>;

export const parseSignedWebhookResponse = ({
  payload,
  secret,
  signature,
}: SignatureParams): ParseResult<WebhookResponse> => {
  if (!isSignatureValid({ payload, secret, signature })) {
    return { success: false, error: new Error("Webhook signature validation failed") };
  }

  try {
    const parsedPayload = JSON.parse(payload) as unknown;

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

export const isSignatureValid = ({ payload, secret, signature }: SignatureParams): boolean => {
  const expectedSignature = getHashFromString(replaceLinebreaks(payload), secret);

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
const replaceLinebreaks = (data: string): string => data.replace(/[\r\n]+/gm, "\r\n");
