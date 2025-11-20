import { describe, expect, it } from "vitest";
import { parseWebhookResponse, type WebhookResponse } from "../lib";

describe("Webhook Validation", () => {
	const validWebhookPayload = {
		notifications: [
			{
				object_type: "content_item",
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
				object_type: "content_item",
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
				object_type: "content_item",
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
				object_type: "asset",
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

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validWebhookPayload);
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("content_item");
				if (notification.object_type === "content_item") {
					expect(notification.message.action).toBe("published");
				}
			}
		});

		it("should parse valid preview content item webhook", () => {
			const result = parseWebhookResponse(validPreviewWebhookPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validPreviewWebhookPayload);
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("content_item");
				if (notification.object_type === "content_item") {
					expect(notification.message.delivery_slot).toBe("preview");
				}
			}
		});

		it("should parse valid workflow changed webhook", () => {
			const result = parseWebhookResponse(validWorkflowChangedPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validWorkflowChangedPayload);
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("content_item");
				if (notification.object_type === "content_item") {
					expect(notification.message.action).toBe("workflow_step_changed");
					if (notification.message.action === "workflow_step_changed") {
						expect(notification.message.action_context.previous_workflow_step).toBe("draft");
					}
				}
			}
		});

		it("should parse valid asset webhook", () => {
			const result = parseWebhookResponse(validAssetWebhookPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validAssetWebhookPayload);
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("asset");
			}
		});

		it("should return error for invalid webhook (missing notifications)", () => {
			const invalidPayload = { invalid: "data" };
			const result = parseWebhookResponse(invalidPayload);

			expect(result.success).toBe(false);
		});

		it("should return success for webhook with empty notifications array", () => {
			const invalidPayload = { notifications: [] };
			const result = parseWebhookResponse(invalidPayload);

			expect(result.success).toBe(true);
		});

		it("should parse notification missing data as unknown", () => {
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

			const result = parseWebhookResponse(invalidPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("unknown");
				if (notification.object_type === "unknown") {
					expect(notification.original_notification).toEqual(invalidPayload.notifications[0]);
				}
			}
		});

		it("should parse notification missing system data as unknown", () => {
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

			const result = parseWebhookResponse(invalidPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("unknown");
				if (notification.object_type === "unknown") {
					expect(notification.original_notification).toEqual(invalidPayload.notifications[0]);
				}
			}
		});

		it("should parse notification with invalid action type as unknown", () => {
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

			const result = parseWebhookResponse(invalidPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				const notification = result.data.notifications[0];
				expect(notification.object_type).toBe("unknown");
				if (notification.object_type === "unknown") {
					expect(notification.original_notification).toEqual(invalidPayload.notifications[0]);
				}
			}
		});

		it("should handle multiple notifications", () => {
			const multiNotificationPayload = {
				notifications: [
					validWebhookPayload.notifications[0],
					validAssetWebhookPayload.notifications[0],
				],
			};

			const result = parseWebhookResponse(multiNotificationPayload);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.notifications).toHaveLength(2);
				expect(result.data.notifications[0].object_type).toBe("content_item");
				expect(result.data.notifications[1].object_type).toBe("asset");
			}
		});
	});

});
