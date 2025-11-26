import { describe, expect, it } from "vitest";
import {
	isSignatureValid,
	parseSignedWebhookResponse,
	type WebhookResponse,
} from "../../lib";

describe("# Signatures", () => {
	const secret = "hx3snVrI9E2Lgpi1LaL+WfiPWCh88OjI7Bv/3ihq+Qo=";
	const validSignature = "k97ud4G3+Bo58p4LDJQY8SK81AThPMIDlZQjyWJbOgI=";
	const rawPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "74fda2ec-5f05-45e6-801c-0b041697256c",
						name: "This changes everything!",
						codename: "this_changes_everything_",
						collection: "default",
						workflow: "default",
						workflow_step: "published",
						language: "default",
						type: "product_update",
						last_modified: "2025-11-26T10:12:53.4900599Z",
					},
				},
				message: {
					environment_id: "2db94c54-294a-016e-81d4-826f7e4a11d8",
					object_type: "content_item",
					action: "workflow_step_changed",
					delivery_slot: "preview",
					action_context: {
						previous_workflow: "default",
						previous_workflow_step: "draft",
					},
				},
			},
		],
	} as const;

	const payloadString = JSON.stringify(rawPayload, null, 2);

	const expectedParsedPayload = {
		notifications: [
			{
				object_type: "content_item" as const,
				data: {
					system: {
						id: "74fda2ec-5f05-45e6-801c-0b041697256c",
						name: "This changes everything!",
						codename: "this_changes_everything_",
						collection: "default",
						workflow: "default",
						workflow_step: "published",
						language: "default",
						type: "product_update",
						last_modified: "2025-11-26T10:12:53.4900599Z",
					},
				},
				message: {
					environment_id: "2db94c54-294a-016e-81d4-826f7e4a11d8",
					object_type: "content_item" as const,
					action: "workflow_step_changed" as const,
					delivery_slot: "preview" as const,
					action_context: {
						previous_workflow: "default",
						previous_workflow_step: "draft",
					},
				},
			},
		],
	} as const satisfies WebhookResponse;

	describe("isSignatureValid", () => {
		describe("Basic Functionality", () => {
			it("should return true for valid signature, payload, and secret", () => {
				expect(isSignatureValid(payloadString, secret, validSignature)).toBe(true);
			});

			it("should return false for incorrect signature", () => {
				expect(isSignatureValid(payloadString, secret, "invalid_signature")).toBe(
					false,
				);
			});

			it("should return false for incorrect secret", () => {
				const wrongSecret = "wrong_secret_key_here";
				expect(isSignatureValid(payloadString, wrongSecret, validSignature)).toBe(
					false,
				);
			});

			it("should return false for modified payload", () => {
				const modifiedPayload = '{"notifications":[{"modified":"data"}]}';
				expect(isSignatureValid(modifiedPayload, secret, validSignature)).toBe(false);
			});
		});
	});

	describe("parseSignedWebhookResponse (integration)", () => {
		it("should validate signature and parse webhook successfully", () => {
			const result = parseSignedWebhookResponse(
				payloadString,
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
				payloadString,
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
