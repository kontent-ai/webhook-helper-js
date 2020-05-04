export type WebhookType = 'asset' | 'content_item' | 'content_item_variant' | 'content_type' | 'language_settings' | 'project' | 'sitemap' | 'taxonomy';
export type WebhookOperation = 'upsert' | 'archive' | 'change_workflow_step' | 'restore' | 'publish' | 'unpublish';
export type WebhookApiName = 'delivery_production' | 'delivery_preview' | 'content_management';

export interface IWebhookResponse<TData> {
    data: TData,
    message: IWebhookMessage
}

export interface IWebhookMessage {
    id: string;
    type: WebhookType;
    operation: WebhookOperation;
    api_name: WebhookApiName;
    webhook_url: string;
    created_timestamp: string;
    project_id: string;
}

export interface IWebhookDeliveryItem {
    id: string;
    codename: string;
    language: string;
    type: string;
}

export interface IWebhookDeliveryTaxonomy {
    id: string;
    codename: string;
}

export interface IWebhookDeliveryData {
    items: IWebhookDeliveryItem[];
    taxonomies: IWebhookDeliveryTaxonomy[];
}

export interface IWebhookWorkflowData {
    items: IWebhookWorkflowDataItem[];
}

export interface IWebhookWorkflowReference {
    id: string;
}

export interface IWebhookWorkflowDataItem {
    item: IWebhookWorkflowReference;
    language: IWebhookWorkflowReference;
    transition_from: IWebhookWorkflowReference;
    transition_to: IWebhookWorkflowReference;
}
