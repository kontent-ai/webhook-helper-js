export type WebhookNotification = {
  data: WebhookData,
  message: WebhookMessage
}

export type WebhookMessage = {
  environment_id: string,
  object_type: string,
  action: string,
  delivery_slot: string
}

export type WebhookData = {
  system: WebhookObject
}

export type WebhookObject = {
  id: string,
  name: string,
  codename: string,
  last_modified: string
}

export type WebhookItemObject = {
  collection: string,
  workflow: string,
  workflow_step: string,
  language: string,
  type: string,
} & WebhookObject;

