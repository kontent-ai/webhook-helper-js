import { WebhookNotification } from "lib/models"

export type WebhookResponse = {
    notifications: WebhookNotification[];
}