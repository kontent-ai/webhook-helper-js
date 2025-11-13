import { createHmac } from "node:crypto";
import type { WebhookResponse } from "lib/models/webhook-schemas";
import { parseWebhookResponse, type SafeParseResult } from "../models/parse-webhook.js";

/**
 * Parses and validates a signed webhook response by verifying its HMAC-SHA256 signature.
 * Returns a safe parse result containing either the validated webhook data or an error.
 */
export const parseSignedWebhookResponse = (
  jsonPayload: string,
  secret: string,
  signature: string,
): SafeParseResult<WebhookResponse> => {
  if (!isSignatureValid(jsonPayload, secret, signature)) {
    return { success: false, error: new Error("Invalid signature") };
  }

  try {
    const parsedPayload = JSON.parse(jsonPayload) as unknown;

    return parseWebhookResponse(parsedPayload);
  } catch (error) {
    return {
      success: false,
      error: new Error(`Invalid payload ${error instanceof Error ? error.message : ""}`),
    };
  }
};

const isSignatureValid = (jsonPayload: string, secret: string, signature: string): boolean =>
  getHashFromString(jsonPayload, secret) === signature;

const getHashFromString = (jsonPayload: string, secret: string): string =>
  createHmac("sha256", secret).update(jsonPayload, "utf8").digest("base64");

/**
 * Normalizes line breaks in a string by replacing all line break variations with CRLF (`\r\n`).
 */
export const replaceLinebreaks = (data: string): string => data.replace(/[\r\n]+/gm, "\r\n");
