import type { WebhookNotification } from "../models/webhook-models.js";

export type WebhookResponse = {
  notifications: WebhookNotification[];
};
