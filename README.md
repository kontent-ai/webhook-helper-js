[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fwebhook-helper.svg)](https://badge.fury.io/js/%40kontent-ai%2Fwebhook-helper)
[![Build](https://github.com/kontent-ai/webhook-helper-js/actions/workflows/test.yml/badge.svg)](https://github.com/kontent-ai/webhook-helper-js/actions/workflows/test.yml)

# Kontent.ai Webhook helper

This package aims to help you with Webhooks received from Kontent.ai projects. Currently, it: 

* Helps with [signature verification](https://kontent.ai/learn/docs/webhooks/webhooks/javascript#a-validate-received-notifications) 
* Provides types for webhook response (only for `Typescript`)

## Installation

Install package:

`npm i --save-dev @kontent-ai/webhook-helper`

### Signature verification

To verify whether a signature is valid use:

```typescript
import { signatureHelper } from '@kontent-ai/webhook-helper';

const isValid = signatureHelper.isValidSignatureFromString(
    payload, // the original string payload 
    secret, // secret can be obtained from Webhook definition in Kontent.ai project
    signature // can be obtained from 'x-kc-signature' header present in webhook request;
```

Keep in mind that the contents of **payload** have to be exactly the same (including whitespaces) as the original webhook body, otherwise, the validation will fail. 
If you already parsed the payload into an object, you should be able to transform it back to the way it originaly was with these settings:

```typescript
const payload: string = JSON.stringify(jsonPayload,null,2);
```

The stringify method can sometimes add Windows line breaks which cause the resulting payload to mismatch the webhook body. In this instance there is an included method you can use:

```typescript
payload = signatureHelper.replaceLinebreaks(payload);
```

### Generate hash

```typescript
import { signatureHelper } from '@kontent-ai/webhook-helper';

const hash = signatureHelper.getHashFromString(payload, secret);
```

### Response model types

If you are using `Typescript` you may use provided interfaces to access webhook properties in a strongly typed manner. 

#### Webhook response

```typescript
import { WebhookResponse } from '@kontent-ai/webhook-helper';

const rawResponse: WebhookResponse = {
    notifications: [
        {
        data: {
            system: {
            id: "aa7f127f-1920-4454-a89a-0609aba8ea6f",
            name: "This changes everything!",
            codename: "this_changes_everything_",
            collection: "marketing",
            workflow: "default",
            workflow_step: "published",
            language: "default",
            type: "product_update",
            last_modified: "2024-03-25T07:55:57.0563735Z",
            },
        },
        message: {
            environment_id: "0f5b6cb2-ea82-014e-ac74-f71e7e8b6aee",
            object_type: "content_item",
            action: "published",
            delivery_slot: "published",
        },
        },
    ],
};
```
