import { describe, expect, it } from "vitest";
import {
	isAssetMessage,
	isContentItemMessage,
	isContentItemPreviewMessage,
	isContentItemPublishedMessage,
	isContentItemWorkflowChangedPreviewMessage,
	isContentTypeMessage,
	isLanguageMessage,
	isTaxonomyMessage,
	isWebhookItemNotification,
	isWebhookObjectNotification,
	type WebhookResponse,
} from "..";

describe("# Type Guards", () => {
	const contentItemPublishedPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Published Item",
						codename: "published_item",
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

	const contentItemPreviewPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Preview Item",
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

	const contentItemWorkflowChangedPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Workflow Changed Item",
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

	const assetPayload = {
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

	const contentTypePayload = {
		notifications: [
			{
				data: {
					system: {
						id: "cc8f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Article",
						codename: "article",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "content_type",
					action: "created",
					delivery_slot: "published",
				},
			},
		],
	} as const satisfies WebhookResponse;

	const languagePayload = {
		notifications: [
			{
				data: {
					system: {
						id: "dd8f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Spanish",
						codename: "es_ES",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "language",
					action: "created",
					delivery_slot: "published",
				},
			},
		],
	} as const satisfies WebhookResponse;

	const taxonomyPayload = {
		notifications: [
			{
				data: {
					system: {
						id: "ee8f127f-1920-4454-a89a-0609aba8ea6f",
						name: "Categories",
						codename: "categories",
						last_modified: "2024-03-25T07:55:57.0563735Z",
					},
				},
				message: {
					environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
					object_type: "taxonomy",
					action: "created",
					delivery_slot: "published",
				},
			},
		],
	} as const satisfies WebhookResponse;

	describe("Message Type Guards", () => {
		describe("isAssetMessage", () => {
			it("should return true for asset messages", () => {
				const message = assetPayload.notifications[0].message;
				expect(isAssetMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isAssetMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isAssetMessage(contentTypePayload.notifications[0].message)).toBe(false);
				expect(isAssetMessage(languagePayload.notifications[0].message)).toBe(false);
				expect(isAssetMessage(taxonomyPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isContentItemMessage", () => {
			it("should return true for all content item messages", () => {
				expect(isContentItemMessage(contentItemPublishedPayload.notifications[0].message)).toBe(true);
				expect(isContentItemMessage(contentItemPreviewPayload.notifications[0].message)).toBe(true);
				expect(isContentItemMessage(contentItemWorkflowChangedPayload.notifications[0].message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isContentItemMessage(assetPayload.notifications[0].message)).toBe(false);
				expect(isContentItemMessage(contentTypePayload.notifications[0].message)).toBe(false);
				expect(isContentItemMessage(languagePayload.notifications[0].message)).toBe(false);
				expect(isContentItemMessage(taxonomyPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isContentTypeMessage", () => {
			it("should return true for content type messages", () => {
				const message = contentTypePayload.notifications[0].message;
				expect(isContentTypeMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isContentTypeMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isContentTypeMessage(assetPayload.notifications[0].message)).toBe(false);
				expect(isContentTypeMessage(languagePayload.notifications[0].message)).toBe(false);
				expect(isContentTypeMessage(taxonomyPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isLanguageMessage", () => {
			it("should return true for language messages", () => {
				const message = languagePayload.notifications[0].message;
				expect(isLanguageMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isLanguageMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isLanguageMessage(assetPayload.notifications[0].message)).toBe(false);
				expect(isLanguageMessage(contentTypePayload.notifications[0].message)).toBe(false);
				expect(isLanguageMessage(taxonomyPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isTaxonomyMessage", () => {
			it("should return true for taxonomy messages", () => {
				const message = taxonomyPayload.notifications[0].message;
				expect(isTaxonomyMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isTaxonomyMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isTaxonomyMessage(assetPayload.notifications[0].message)).toBe(false);
				expect(isTaxonomyMessage(contentTypePayload.notifications[0].message)).toBe(false);
				expect(isTaxonomyMessage(languagePayload.notifications[0].message)).toBe(false);
			});
		});
	});

	describe("Content Item Sub-type Guards", () => {
		describe("isContentItemPreviewMessage", () => {
			it("should return true for preview content item messages (non-workflow)", () => {
				const message = contentItemPreviewPayload.notifications[0].message;
				expect(isContentItemPreviewMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isContentItemPreviewMessage(contentItemWorkflowChangedPayload.notifications[0].message)).toBe(false);
				expect(isContentItemPreviewMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isContentItemPreviewMessage(assetPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isContentItemPublishedMessage", () => {
			it("should return true for published content item messages", () => {
				const message = contentItemPublishedPayload.notifications[0].message;
				expect(isContentItemPublishedMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isContentItemPublishedMessage(contentItemPreviewPayload.notifications[0].message)).toBe(false);
				expect(isContentItemPublishedMessage(contentItemWorkflowChangedPayload.notifications[0].message)).toBe(false);
				expect(isContentItemPublishedMessage(assetPayload.notifications[0].message)).toBe(false);
			});
		});

		describe("isContentItemWorkflowChangedPreviewMessage", () => {
			it("should return true for workflow changed messages", () => {
				const message = contentItemWorkflowChangedPayload.notifications[0].message;
				expect(isContentItemWorkflowChangedPreviewMessage(message)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isContentItemWorkflowChangedPreviewMessage(contentItemPreviewPayload.notifications[0].message)).toBe(false);
				expect(isContentItemWorkflowChangedPreviewMessage(contentItemPublishedPayload.notifications[0].message)).toBe(false);
				expect(isContentItemWorkflowChangedPreviewMessage(assetPayload.notifications[0].message)).toBe(false);
			});
		});
	});

	describe("Notification Type Guards", () => {
		describe("isWebhookItemNotification", () => {
			it("should return true for content item notifications (has collection, workflow, etc.)", () => {
				const notification = contentItemPublishedPayload.notifications[0];
				expect(isWebhookItemNotification(notification)).toBe(true);
			});

			it("should return false for other", () => {
				expect(isWebhookItemNotification(assetPayload.notifications[0])).toBe(false);
				expect(isWebhookItemNotification(contentTypePayload.notifications[0])).toBe(false);
				expect(isWebhookItemNotification(languagePayload.notifications[0])).toBe(false);
				expect(isWebhookItemNotification(taxonomyPayload.notifications[0])).toBe(false);
			});
		});

		describe("isWebhookObjectNotification", () => {
			it("should return true for object notifications", () => {
				expect(isWebhookObjectNotification(assetPayload.notifications[0])).toBe(true);
				expect(isWebhookObjectNotification(contentTypePayload.notifications[0])).toBe(true);
				expect(isWebhookObjectNotification(languagePayload.notifications[0])).toBe(true);
				expect(isWebhookObjectNotification(taxonomyPayload.notifications[0])).toBe(true);
			});

			it("should return false for other", () => {
				expect(isWebhookObjectNotification(contentItemPublishedPayload.notifications[0])).toBe(false);
			});
		});
	});
});
