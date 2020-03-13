import { createHmac, BinaryLike } from 'crypto';

export interface ISignatureHelper {

    isValidSignatureFromBinary(jsonPayload: BinaryLike, secret: string, signature: string): boolean;
    isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean;
    getHashFromBinary(jsonPayload: BinaryLike, secret: string): string;
    getHashFromString(jsonPayload: string, secret: string): string;
}

export class SignatureHelper implements ISignatureHelper {

    isValidSignatureFromBinary(jsonPayload: BinaryLike, secret: string, signature: string): boolean {
        return this.getHashFromBinary(jsonPayload, secret) === signature;
    }

    isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean {
        return this.getHashFromString(jsonPayload, secret) === signature;
    }

    getHashFromBinary(jsonPayload: BinaryLike, secret: string): string {
        return createHmac('sha256', secret)
            .update(jsonPayload)
            .digest('base64');
    }

    getHashFromString(jsonPayload: string, secret: string): string {
        return createHmac('sha256', secret)
            .update(jsonPayload.replace(/[\n]+/g,'\r\n'), 'utf8')
            .digest('base64');
    }
}

export const signatureHelper = new SignatureHelper();
