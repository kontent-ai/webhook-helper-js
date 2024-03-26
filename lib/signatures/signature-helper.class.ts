import { createHmac } from "crypto";

export interface ISignatureHelper {
  isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean;
  getHashFromString(jsonPayload: string, secret: string): string;
  replaceLinebreaks(data: string): string;
}

export class SignatureHelper implements ISignatureHelper {
  isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean {
    return this.getHashFromString(jsonPayload, secret) === signature;
  }

  getHashFromString(jsonPayload: string, secret: string): string {
    return createHmac("sha256", secret)
      .update(jsonPayload, "utf8")
      .digest("base64");
  }

  replaceLinebreaks(data: string): string {
    return data.replace(/[\r\n]+/gm, "\r\n");
  }
}

export const signatureHelper = new SignatureHelper();
