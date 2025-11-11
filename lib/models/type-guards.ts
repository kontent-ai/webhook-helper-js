import type { z } from "zod";
import type {
  AssetMessage,
  ContentItemPreviewMessage,
  ContentItemPublishedMessage,
  ContentItemWorkflowChangedPreviewMessage,
  ContentTypeMessage,
  LanguageMessage,
  TaxonomyMessage,
  WebhookItemNotification,
  WebhookNotification,
  WebhookObjectNotification,
  webhookMessageSchema,
} from "./webhook-schemas.js";

type WebhookMessage = z.infer<typeof webhookMessageSchema>;

export const isAssetMessage = (message: WebhookMessage): message is AssetMessage => {
  return message.object_type === "asset";
};

export const isContentItemMessage = (
  message: WebhookMessage,
): message is
  | ContentItemPreviewMessage
  | ContentItemPublishedMessage
  | ContentItemWorkflowChangedPreviewMessage => {
  return message.object_type === "content_item";
};

export const isContentTypeMessage = (message: WebhookMessage): message is ContentTypeMessage => {
  return message.object_type === "content_type";
};

export const isLanguageMessage = (message: WebhookMessage): message is LanguageMessage => {
  return message.object_type === "language";
};

export const isTaxonomyMessage = (message: WebhookMessage): message is TaxonomyMessage => {
  return message.object_type === "taxonomy";
};

export const isContentItemPreviewMessage = (
  message: WebhookMessage,
): message is ContentItemPreviewMessage => {
  return (
    isContentItemMessage(message) &&
    message.delivery_slot === "preview" &&
    message.action !== "workflow_step_changed"
  );
};

export const isContentItemPublishedMessage = (
  message: WebhookMessage,
): message is ContentItemPublishedMessage => {
  return isContentItemMessage(message) && message.delivery_slot === "published";
};

export const isContentItemWorkflowChangedPreviewMessage = (
  message: WebhookMessage,
): message is ContentItemWorkflowChangedPreviewMessage => {
  return (
    isContentItemMessage(message) &&
    message.delivery_slot === "preview" &&
    message.action === "workflow_step_changed"
  );
};

export const isWebhookItemNotification = (
  notification: WebhookNotification,
): notification is WebhookItemNotification => {
  return "collection" in notification.data.system;
};

export const isWebhookObjectNotification = (
  notification: WebhookNotification,
): notification is WebhookObjectNotification => {
  return !("collection" in notification.data.system);
};
