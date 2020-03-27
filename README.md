[![npm version](https://badge.fury.io/js/@kentico/kontent-webhook-helper.svg)](https://www.npmjs.com/package/@kentico/kontent-webhook-helper)

# Kontent Webhook helper


This package aims to help you with Webhooks received from Kentico Kontent projects. Currently, it: 

* Helps with signature verification as per [signatures](https://docs.kontent.ai/reference/webhooks-reference#a-notification-signatures) 
* Provides types for webhook response (only for `Typescript`)

## Installation

Install package:

`npm i @kentico/kontent-webhook-helper`

### Signature verification

To verify whether a signature is valid use:

```typescript
import { signatureHelper } from '@kentico/kontent-webhook-helper';

const isValid = signatureHelper.isValidSignatureFromString(
    payload, // payload converted to string 
    secret, // secret can be obtained from Webhook definition in Kentico Kontent project
    signature // can be obtained from 'x-kc-signature' header present in webhook request);
```

### Generate hash

```typescript
import { signatureHelper } from '@kentico/kontent-webhook-helper';

const hash = signatureHelper.getHashFromString(payload, secret);
```

### Response model types

If you are using `Typescript` you may use provided interfaces to access webhook properties in a strongly typed manner. 

#### Delivery webhook response

```typescript
import { IWebhookWorkflowResponse } from '@kentico/kontent-webhook-helper';

const rawResponse = {
    "data": {
        "items": [
            {
                "id": "e5d575fe-9608-4523-a07d-e32d780bf92a",
                "codename": "this_article_changed",
                "language": "en-US",
                "type": "article"
            }
        ],
        "taxonomies": [
            {
                "id": "4794dde6-f700-4a5d-b0dc-9ae16dcfc73d",
                "codename": "personas"
            }
        ]
    },
    "message": {
        "id": "e1b372a2-1186-4929-b370-904c59f060b7",
        "project_id": "bf32e7ab-85c3-0073-47b9-90838a8462de",
        "type": "taxonomy",
        "operation": "upsert",
        "api_name": "delivery_production",
        "created_timestamp": "2019-07-18T10:52:33.1059256Z",
        "webhook_url": "https://myapp.com/webhook-endpoint"
    }
};

const response = rawResponse as IWebhookDeliveryResponse;
```

#### Workflow webhook response

```typescript
import { IWebhookWorkflowResponse } from '@kentico/kontent-webhook-helper';

const rawResponse = {
    "data": {
        "items": [
            {
                "item": {
                    "id": "65f05e0f-40c3-436b-a641-e2d4cae16e46"
                },
                "language": {
                    "id": "00000000-0000-0000-0000-000000000000"
                },
                "transition_from": {
                    "id": "eee6db3b-545a-4785-8e86-e3772c8756f9"
                },
                "transition_to": {
                    "id": "03b6ebd3-2f49-4621-92fd-4977b33681d1"
                }
            }
        ]
    },
    "message": {
        "id": "e1b372a2-1186-4929-b370-904c59f060b7",
        "project_id": "bf32e7ab-85c3-0073-47b9-90838a8462de",
        "type": "taxonomy",
        "operation": "upsert",
        "api_name": "delivery_production",
        "created_timestamp": "2019-07-18T10:52:33.1059256Z",
        "webhook_url": "https://myapp.com/webhook-endpoint"
    }
};

const response = rawResponse as IWebhookWorkflowResponse;
```
