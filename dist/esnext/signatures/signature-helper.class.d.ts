export interface ISignatureHelper {
    isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean;
    getHashFromString(jsonPayload: string, secret: string): string;
    replaceLinebreaks(data: string): string;
}
export declare class SignatureHelper implements ISignatureHelper {
    isValidSignatureFromString(jsonPayload: string, secret: string, signature: string): boolean;
    getHashFromString(jsonPayload: string, secret: string): string;
    replaceLinebreaks(data: string): string;
}
export declare const signatureHelper: SignatureHelper;
