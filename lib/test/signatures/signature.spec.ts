import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
	isSignatureValid,
	parseSignedWebhookResponse,
	replaceLinebreaks,
	type WebhookResponse,
} from "../..";

const getHashFromString = (jsonPayload: string, secret: string): string =>
	createHmac("sha256", secret).update(jsonPayload, "utf8").digest("base64");

describe("# Signatures", () => {
	const secret = "BHPyfqwSy1iJjcscOB+GSkDf9THrBlfcKkwtADJdbP4=";
	const rawPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "This changes everything!",
						codename: "this_changes_everything_",
						collection: "marketing",
						workflow: "default",
						workflow_step: "published",
						language: "default",
						type: "product_update",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "content_item",
					action: "published",
					delivery_slot: "published",
				},
			},
		],
	} as const;

	const payloadString = JSON.stringify(rawPayload, null, 2);
	const normalizedPayloadString = replaceLinebreaks(payloadString);
	const validSignature = getHashFromString(normalizedPayloadString, secret);

	const expectedParsedPayload = {
		notifications: [
			{
				object_type: "content_item" as const,
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "This changes everything!",
						codename: "this_changes_everything_",
						collection: "marketing",
						workflow: "default",
						workflow_step: "published",
						language: "default",
						type: "product_update",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "content_item" as const,
					action: "published" as const,
					delivery_slot: "published" as const,
				},
			},
		],
	} as const satisfies WebhookResponse;

	describe("isSignatureValid", () => {
		describe("Basic Functionality", () => {
			it("should return true for valid signature, payload, and secret", () => {
				expect(isSignatureValid(normalizedPayloadString, secret, validSignature)).toBe(true);
			});

			it("should return false for incorrect signature", () => {
				expect(isSignatureValid(normalizedPayloadString, secret, "invalid_signature")).toBe(
					false,
				);
			});

			it("should return false for incorrect secret", () => {
				const wrongSecret = "wrong_secret_key_here";
				expect(isSignatureValid(normalizedPayloadString, wrongSecret, validSignature)).toBe(
					false,
				);
			});

			it("should return false for modified payload", () => {
				const modifiedPayload = '{"notifications":[{"modified":"data"}]}';
				expect(isSignatureValid(modifiedPayload, secret, validSignature)).toBe(false);
			});
		});

		describe("Empty Input Handling", () => {
			it("should return false for empty payload string", () => {
				const emptyPayload = "";
				const signatureForEmpty = getHashFromString(emptyPayload, secret);
				expect(isSignatureValid(emptyPayload, secret, "wrong_sig")).toBe(false);
				expect(isSignatureValid(emptyPayload, secret, signatureForEmpty)).toBe(true);
			});
		});

		describe("Whitespace Sensitivity", () => {
			it("should be sensitive to trailing whitespace in payload", () => {
				const payload = '{"test":"data"}';
				const payloadWithSpace = '{"test":"data"} ';

				const signatureNoSpace = getHashFromString(payload, secret);
				const signatureWithSpace = getHashFromString(payloadWithSpace, secret);

				expect(isSignatureValid(payload, secret, signatureNoSpace)).toBe(true);
				expect(isSignatureValid(payloadWithSpace, secret, signatureNoSpace)).toBe(false);
				expect(isSignatureValid(payloadWithSpace, secret, signatureWithSpace)).toBe(true);
			});

			it("should be sensitive to different JSON formatting", () => {
				const compact = '{"test":"data"}';
				const formatted = '{\r\n  "test": "data"\r\n}';

				const signatureCompact = getHashFromString(compact, secret);
				const signatureFormatted = getHashFromString(formatted, secret);

				expect(isSignatureValid(compact, secret, signatureCompact)).toBe(true);
				expect(isSignatureValid(formatted, secret, signatureCompact)).toBe(false);
				expect(isSignatureValid(formatted, secret, signatureFormatted)).toBe(true);
			});

			it("should be sensitive to line break differences (LF vs CRLF)", () => {
				const lfPayload = '{"test":\n"data"}';
				const crlfPayload = '{"test":\r\n"data"}';

				const signatureLF = getHashFromString(lfPayload, secret);
				const signatureCRLF = getHashFromString(crlfPayload, secret);

				expect(isSignatureValid(lfPayload, secret, signatureLF)).toBe(true);
				expect(isSignatureValid(crlfPayload, secret, signatureLF)).toBe(false);
				expect(isSignatureValid(crlfPayload, secret, signatureCRLF)).toBe(true);
			});
		});
	});

	describe("parseSignedWebhookResponse (integration)", () => {
		it("should validate signature and parse webhook successfully", () => {
			const result = parseSignedWebhookResponse(
				normalizedPayloadString,
				secret,
				validSignature,
			);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(expectedParsedPayload);
			}
		});

		it("should return error for invalid signature", () => {
			const result = parseSignedWebhookResponse(
				normalizedPayloadString,
				secret,
				"invalid_signature",
			);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.message).toEqual("Webhook signature validation failed");
			}
		});
	});
});
