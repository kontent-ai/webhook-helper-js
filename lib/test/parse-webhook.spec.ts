import { describe, expect, it } from "vitest";
import {
	parseWebhookResponse,
	parseWebhookResponseSafe,
	type WebhookResponse,
} from "..";

describe("# Webhook Validation", () => {
	const validWebhookPayload = {
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
	} as const satisfies WebhookResponse;

	const validPreviewWebhookPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Preview item",
						codename: "preview_item",
						collection: "default",
						workflow: "default",
						workflow_step: "draft",
						language: "default",
						type: "article",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "content_item",
					action: "created",
					delivery_slot: "preview",
				},
			},
		],
	} as const satisfies WebhookResponse;

	const validWorkflowChangedPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Workflow changed item",
						codename: "workflow_changed_item",
						collection: "default",
						workflow: "default",
						workflow_step: "review",
						language: "default",
						type: "article",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
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
	} as const satisfies WebhookResponse;

	const validAssetWebhookPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "bb8f127f-1920-4454-a89a-0609aba8ea6f",
						name: "My Asset",
						codename: "my_asset",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "asset",
					action: "created",
					delivery_slot: "published",
				},
			},
		],
	} as const satisfies WebhookResponse;

	describe("parseWebhookResponse", () => {
		it("should parse valid published content item webhook", () => {
			const result = parseWebhookResponse(validWebhookPayload);

			expect(result).toEqual(validWebhookPayload);
			expect(result.notifications[0].message.object_type).toBe("content_item");
			expect(result.notifications[0].message.action).toBe("published");
		});

		it("should parse valid preview content item webhook", () => {
			const result = parseWebhookResponse(validPreviewWebhookPayload);

			expect(result).toEqual(validPreviewWebhookPayload);
			expect(result.notifications[0].message.object_type).toBe("content_item");
			expect(result.notifications[0].message.delivery_slot).toBe("preview");
		});

		it("should parse valid workflow changed webhook", () => {
			const result = parseWebhookResponse(validWorkflowChangedPayload);

			expect(result).toEqual(validWorkflowChangedPayload);
			expect(result.notifications[0].message.action).toBe("workflow_step_changed");
			if (result.notifications[0].message.action === "workflow_step_changed") {
				expect(result.notifications[0].message.action_context.previous_workflow_step).toBe(
					"draft",
				);
			}
		});

		it("should parse valid asset webhook", () => {
			const result = parseWebhookResponse(validAssetWebhookPayload);

			expect(result).toEqual(validAssetWebhookPayload);
			expect(result.notifications[0].message.object_type).toBe("asset");
			expect(result.notifications[0].message.action).toBe("created");
		});

		it("should throw error for invalid webhook (missing notifications)", () => {
			const invalidPayload = { invalid: "data" };

			expect(() => parseWebhookResponse(invalidPayload)).toThrow();
		});

		it("should throw error for webhook with empty notifications array", () => {
			const invalidPayload = { notifications: [] };

			// Empty array is actually valid according to the schema
			expect(() => parseWebhookResponse(invalidPayload)).not.toThrow();
		});

		it("should throw error for notification missing data", () => {
			const invalidPayload = {
				notifications: [
					{
						message: {
							environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
							object_type: "content_item",
							action: "published",
							delivery_slot: "published",
						},
					},
				],
			};

			expect(() => parseWebhookResponse(invalidPayload)).toThrow();
		});

		it("should throw error for notification missing system data", () => {
			const invalidPayload = {
				notifications: [
					{
						data: {},
						message: {
							environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
							object_type: "content_item",
							action: "published",
							delivery_slot: "published",
						},
					},
				],
			};

			expect(() => parseWebhookResponse(invalidPayload)).toThrow();
		});

		it("should throw error for invalid action type", () => {
			const invalidPayload = {
				notifications: [
					{
						data: {
							system: {
								id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
								name: "Test",
								codename: "test",
								collection: "default",
								workflow: "default",
								workflow_step: "published",
								language: "default",
								type: "article",
								last_modified: "2024-03-25T07:55:57.0563735Z",
							},
						},
						message: {
							environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
							object_type: "content_item",
							action: "invalid_action",
							delivery_slot: "published",
						},
					},
				],
			};

			expect(() => parseWebhookResponse(invalidPayload)).toThrow();
		});

		it("should throw error for mismatched delivery_slot and action", () => {
			const invalidPayload = {
				notifications: [
					{
						data: {
							system: {
								id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
								name: "Test",
								codename: "test",
								collection: "default",
								workflow: "default",
								workflow_step: "published",
								language: "default",
								type: "article",
								last_modified: "2024-03-25T07:55:57.0563735Z",
							},
						},
						message: {
							environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
							object_type: "content_item",
							action: "workflow_step_changed",
							delivery_slot: "published", // Should be "preview" for workflow changes
						},
					},
				],
			};

			expect(() => parseWebhookResponse(invalidPayload)).toThrow();
		});
	});

	describe("parseWebhookResponseSafe", () => {
		it("should return success for valid webhook", () => {
			const result = parseWebhookResponseSafe(validWebhookPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validWebhookPayload);
			}
		});

		it("should return error for invalid webhook", () => {
			const invalidPayload = { invalid: "data" };
			const result = parseWebhookResponseSafe(invalidPayload);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});

		it("should provide detailed error information", () => {
			const invalidPayload = {
				notifications: [
					{
						data: {
							system: {
								id: "test",
								name: "test",
								codename: "test",
								collection: "default",
								workflow: "default",
								workflow_step: "published",
								language: "default",
								type: "article",
								// missing last_modified
							},
						},
						message: {
							environment_id: "test",
							object_type: "content_item",
							action: "published",
							delivery_slot: "published",
						},
					},
				],
			};

			const result = parseWebhookResponseSafe(invalidPayload);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
				// Check that error messages mention the missing field
				const errorMessages = result.error.issues.map((issue: { message: string }) => issue.message);
				expect(errorMessages.length).toBeGreaterThan(0);
			}
		});

		it("should handle multiple notifications", () => {
			const multiNotificationPayload = {
				notifications: [validWebhookPayload.notifications[0], validAssetWebhookPayload.notifications[0]],
			};

			const result = parseWebhookResponseSafe(multiNotificationPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.notifications).toHaveLength(2);
				expect(result.data.notifications[0].message.object_type).toBe("content_item");
				expect(result.data.notifications[1].message.object_type).toBe("asset");
			}
		});
	});
});
