import { createHmac } from "node:crypto";

export const isValidSignatureFromString = (
  jsonPayload: string,
  secret: string,
  signature: string,
): boolean => getHashFromString(jsonPayload, secret) === signature;

export const getHashFromString = (jsonPayload: string, secret: string): string =>
  createHmac("sha256", secret).update(jsonPayload, "utf8").digest("base64");

export const replaceLinebreaks = (data: string): string => data.replace(/[\r\n]+/gm, "\r\n");
