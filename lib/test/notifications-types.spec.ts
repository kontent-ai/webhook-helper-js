import { describe, expectTypeOf, it } from "vitest";
import type {
  AssetNotification,
  ContentItemNotification,
  ContentItemPreviewMessage,
  ContentItemPublishedMessage,
  ContentItemWorkflowChangedPreviewMessage,
  ContentTypeNotification,
  LanguageNotification,
  TaxonomyNotification,
  UnknownNotification,
  WebhookNotification,
} from "../index.js";

describe("Type Safety Tests", () => {
  it("should allow iterating notifications with type narrowing", () => {
    const mockNotifications: WebhookNotification[] = [];

    mockNotifications.forEach((notification) => {
      switch (notification.object_type) {
        case "asset":
          expectTypeOf(notification).toEqualTypeOf<AssetNotification>();
          break;
        case "content_item":
          expectTypeOf(notification).toEqualTypeOf<ContentItemNotification>();
          break;
        case "content_type":
          expectTypeOf(notification).toEqualTypeOf<ContentTypeNotification>();
          break;
        case "language":
          expectTypeOf(notification).toEqualTypeOf<LanguageNotification>();
          break;
        case "taxonomy":
          expectTypeOf(notification).toEqualTypeOf<TaxonomyNotification>();
          break;
        case "unknown":
          expectTypeOf(notification).toEqualTypeOf<UnknownNotification>();
          break;
        default: {
          const exhaustive: never = notification;
          expectTypeOf(exhaustive).toBeNever();
        }
      }
    });
  });

  it("should narrow content_item messages by delivery_slot and action", () => {
    const mockNotifications: WebhookNotification[] = [];

    mockNotifications.forEach((notification) => {
      if (notification.object_type === "content_item") {
        expectTypeOf(notification).toEqualTypeOf<ContentItemNotification>();

        if (notification.message.delivery_slot === "preview") {
          if (notification.message.action === "workflow_step_changed") {
            expectTypeOf(notification.message).toEqualTypeOf<ContentItemWorkflowChangedPreviewMessage>();
            expectTypeOf(notification.message.action_context.previous_workflow).toBeString();
            expectTypeOf(notification.message.action_context.previous_workflow_step).toBeString();
          } else {
            expectTypeOf(notification.message).toEqualTypeOf<ContentItemPreviewMessage>();
            expectTypeOf(notification.message.action).toEqualTypeOf<
              "created" | "deleted" | "metadata_changed"
            >();
          }
        } else {
          expectTypeOf(notification.message).toEqualTypeOf<ContentItemPublishedMessage>();
          expectTypeOf(notification.message.action).toEqualTypeOf<
            "published" | "unpublished" | "metadata_changed"
          >();
        }
      }
    });
  });
});
