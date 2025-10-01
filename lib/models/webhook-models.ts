type WebhookPublishedDeliverySlot = "published";
type WebhookPreviewDeliverySlot = "preview";

export type WebhookDeliverySlot = WebhookPublishedDeliverySlot | WebhookPreviewDeliverySlot;

type CommonEvents = "created" | "deleted";
export type AssetEvents = CommonEvents | "metadata_changed";
export type ContentItemPreviewEvents = CommonEvents | "workflow_step_changed" | "metadata_changed";
export type ContentItemPublishedEvents = "published" | "unpublished" | "metadata_changed";
export type ContentTypeEvents = CommonEvents | "changed";
export type LanguageEvents = CommonEvents | "changed";
export type TaxonomyEvents =
  | CommonEvents
  | "metadata_changed"
  | "term_created"
  | "term_changed"
  | "term_deleted"
  | "terms_moved";

export type WebhookNotification = WebhookItemNotification | WebhookObjectNotification;

export type WebhookItemNotification = {
  data: {
    system: WebhookItemObjectData;
  };
  message: ContentItemPreviewMessage | ContentItemWorkflowChangedPreviewMessage | ContentItemPublishedMessage;
};

export type WebhookObjectNotification = {
  data: {
    system: WebhookObjectData;
  };
  message: AssetMesage | ContentTypeMessage | LanguageMessage | TaxonomyMessage;
};

type WebhookMessageCommon = {
  environment_id: string;
  delivery_slot: WebhookDeliverySlot;
};

export type AssetMesage = WebhookMessageCommon & {
  object_type: "asset";
  action: AssetEvents;
};

export type ContentItemPreviewMessage =
  & WebhookMessageCommon
  & {
    object_type: "content_item";
    delivery_slot: WebhookPreviewDeliverySlot;
    action: Exclude<ContentItemPreviewEvents, "workflow_step_changed">;
  };

export type ContentItemWorkflowChangedPreviewMessage =
  & WebhookMessageCommon
  & {
    object_type: "content_item";
    delivery_slot: WebhookPreviewDeliverySlot;
    action: Extract<ContentItemPreviewEvents, "workflow_step_changed">;
    action_context: {
      previous_workflow: string;
      previous_workflow_step: string;
    };
  };

export type ContentItemPublishedMessage = WebhookMessageCommon & {
  object_type: "content_item";
  action: ContentItemPublishedEvents;
  delivery_slot: WebhookPublishedDeliverySlot;
};

export type ContentTypeMessage = WebhookMessageCommon & {
  object_type: "content_type";
  action: ContentTypeEvents;
};

export type LanguageMessage = WebhookMessageCommon & {
  object_type: "language";
  action: LanguageEvents;
};

export type TaxonomyMessage = WebhookMessageCommon & {
  object_type: "taxonomy";
  action: TaxonomyEvents;
};

export type WebhookObjectData = {
  id: string;
  name: string;
  codename: string;
  last_modified: string;
};

export type WebhookItemObjectData = {
  collection: string;
  workflow: string;
  workflow_step: string;
  language: string;
  type: string;
} & WebhookObjectData;
