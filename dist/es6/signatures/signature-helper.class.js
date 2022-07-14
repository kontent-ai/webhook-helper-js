import { createHmac } from 'crypto';
export class SignatureHelper {
    isValidSignatureFromString(jsonPayload, secret, signature) {
        return this.getHashFromString(jsonPayload, secret) === signature;
    }
    getHashFromString(jsonPayload, secret) {
        return createHmac('sha256', secret)
            .update(jsonPayload, 'utf8')
            .digest('base64');
    }
    replaceLinebreaks(data) {
        return data.replace(/[\r\n]+/gm, '\r\n');
    }
}
export const signatureHelper = new SignatureHelper();
//# sourceMappingURL=signature-helper.class.js.map