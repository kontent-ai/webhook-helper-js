import { z } from "zod";

export const webhookDeliverySlotSchema = z.enum(["published", "preview"]);

export const assetEventsSchema = z.enum(["created", "deleted", "metadata_changed"]);

export const contentItemPreviewEventsSchema = z.enum([
  "created",
  "deleted",
  "workflow_step_changed",
  "metadata_changed",
]);

export const contentItemPublishedEventsSchema = z.enum([
  "published",
  "unpublished",
  "metadata_changed",
]);

export const contentTypeEventsSchema = z.enum(["created", "deleted", "changed"]);

export const languageEventsSchema = z.enum(["created", "deleted", "changed"]);

export const taxonomyEventsSchema = z.enum([
  "created",
  "deleted",
  "metadata_changed",
  "term_created",
  "term_changed",
  "term_deleted",
  "terms_moved",
]);

export const webhookObjectDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  codename: z.string(),
  last_modified: z.string(),
});

export const webhookItemObjectDataSchema = webhookObjectDataSchema.extend({
  collection: z.string(),
  workflow: z.string(),
  workflow_step: z.string(),
  language: z.string(),
  type: z.string(),
});

const webhookMessageCommonSchema = z.object({
  environment_id: z.string(),
  delivery_slot: webhookDeliverySlotSchema,
});

export const assetMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("asset"),
  action: assetEventsSchema,
});

export const contentItemPreviewMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("content_item"),
  delivery_slot: z.literal("preview"),
  action: z.enum(["created", "deleted", "metadata_changed"]),
});

export const contentItemWorkflowChangedPreviewMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("content_item"),
  delivery_slot: z.literal("preview"),
  action: z.literal("workflow_step_changed"),
  action_context: z.object({
    previous_workflow: z.string(),
    previous_workflow_step: z.string(),
  }),
});

export const contentItemPublishedMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("content_item"),
  action: contentItemPublishedEventsSchema,
  delivery_slot: z.literal("published"),
});

export const contentTypeMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("content_type"),
  action: contentTypeEventsSchema,
});

export const languageMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("language"),
  action: languageEventsSchema,
});

export const taxonomyMessageSchema = webhookMessageCommonSchema.extend({
  object_type: z.literal("taxonomy"),
  action: taxonomyEventsSchema,
});

export const webhookMessageSchema = z.discriminatedUnion("object_type", [
  contentItemPreviewMessageSchema,
  contentItemWorkflowChangedPreviewMessageSchema,
  contentItemPublishedMessageSchema,
  assetMessageSchema,
  contentTypeMessageSchema,
  languageMessageSchema,
  taxonomyMessageSchema,
]);

const assetNotificationSchema = z
  .object({
    data: z.object({
      system: webhookObjectDataSchema,
    }),
    message: assetMessageSchema,
  })
  .transform((notification) => ({
    ...notification,
    object_type: "asset" as const,
  }));

const contentItemNotificationSchema = z
  .object({
    data: z.object({
      system: webhookItemObjectDataSchema,
    }),
    message: z.union([
      contentItemPreviewMessageSchema,
      contentItemPublishedMessageSchema,
      contentItemWorkflowChangedPreviewMessageSchema,
    ]),
  })
  .transform((notification) => ({
    ...notification,
    object_type: "content_item" as const,
  }));

const contentTypeNotificationSchema = z
  .object({
    data: z.object({
      system: webhookObjectDataSchema,
    }),
    message: contentTypeMessageSchema,
  })
  .transform((notification) => ({
    ...notification,
    object_type: "content_type" as const,
  }));

const languageNotificationSchema = z
  .object({
    data: z.object({
      system: webhookObjectDataSchema,
    }),
    message: languageMessageSchema,
  })
  .transform((notification) => ({
    ...notification,
    object_type: "language" as const,
  }));

const taxonomyNotificationSchema = z
  .object({
    data: z.object({
      system: webhookObjectDataSchema,
    }),
    message: taxonomyMessageSchema,
  })
  .transform((notification) => ({
    ...notification,
    object_type: "taxonomy" as const,
  }));

const knownNotificationSchema = z.union([
  assetNotificationSchema,
  contentItemNotificationSchema,
  contentTypeNotificationSchema,
  languageNotificationSchema,
  taxonomyNotificationSchema,
]);

export type UnknownNotification = {
  object_type: "unknown";
  original_notification: Record<PropertyKey, unknown>;
};

export const webhookNotificationSchema = z.unknown().transform((input) => {
  const result = knownNotificationSchema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  return {
    object_type: "unknown" as const,
    original_notification: input as Record<PropertyKey, unknown>,
  };
});

export const webhookResponseSchema = z.object({
  notifications: z.array(webhookNotificationSchema),
});

export type WebhookDeliverySlot = z.infer<typeof webhookDeliverySlotSchema>;
export type AssetEvents = z.infer<typeof assetEventsSchema>;
export type ContentItemPreviewEvents = z.infer<typeof contentItemPreviewEventsSchema>;
export type ContentItemPublishedEvents = z.infer<typeof contentItemPublishedEventsSchema>;
export type ContentTypeEvents = z.infer<typeof contentTypeEventsSchema>;
export type LanguageEvents = z.infer<typeof languageEventsSchema>;
export type TaxonomyEvents = z.infer<typeof taxonomyEventsSchema>;

export type WebhookObjectData = z.infer<typeof webhookObjectDataSchema>;
export type WebhookItemObjectData = z.infer<typeof webhookItemObjectDataSchema>;

export type AssetMessage = z.infer<typeof assetMessageSchema>;
export type ContentItemPreviewMessage = z.infer<typeof contentItemPreviewMessageSchema>;
export type ContentItemWorkflowChangedPreviewMessage = z.infer<
  typeof contentItemWorkflowChangedPreviewMessageSchema
>;
export type ContentItemPublishedMessage = z.infer<typeof contentItemPublishedMessageSchema>;
export type ContentTypeMessage = z.infer<typeof contentTypeMessageSchema>;
export type LanguageMessage = z.infer<typeof languageMessageSchema>;
export type TaxonomyMessage = z.infer<typeof taxonomyMessageSchema>;

export type AssetNotification = z.infer<typeof assetNotificationSchema>;
export type ContentItemNotification = z.infer<typeof contentItemNotificationSchema>;
export type ContentTypeNotification = z.infer<typeof contentTypeNotificationSchema>;
export type LanguageNotification = z.infer<typeof languageNotificationSchema>;
export type TaxonomyNotification = z.infer<typeof taxonomyNotificationSchema>;

export type WebhookNotification = z.infer<typeof webhookNotificationSchema>;
export type WebhookResponse = z.infer<typeof webhookResponseSchema>;
