import { IWebhookDeliveryData, IWebhookResponse, IWebhookWorkflowData } from "../../models";

export interface IWebhookDeliveryResponse extends IWebhookResponse<IWebhookDeliveryData> {}

export interface IWebhookWorkflowResponse extends IWebhookResponse<IWebhookWorkflowData> {}
