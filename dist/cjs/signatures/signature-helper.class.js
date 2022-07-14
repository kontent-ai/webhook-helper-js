"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureHelper = exports.SignatureHelper = void 0;
const crypto_1 = require("crypto");
class SignatureHelper {
    isValidSignatureFromString(jsonPayload, secret, signature) {
        return this.getHashFromString(jsonPayload, secret) === signature;
    }
    getHashFromString(jsonPayload, secret) {
        return (0, crypto_1.createHmac)('sha256', secret)
            .update(jsonPayload, 'utf8')
            .digest('base64');
    }
    replaceLinebreaks(data) {
        return data.replace(/[\r\n]+/gm, '\r\n');
    }
}
exports.SignatureHelper = SignatureHelper;
exports.signatureHelper = new SignatureHelper();
//# sourceMappingURL=signature-helper.class.js.map