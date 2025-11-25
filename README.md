[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fwebhook-helper.svg)](https://badge.fury.io/js/%40kontent-ai%2Fwebhook-helper)
[![Build](https://github.com/kontent-ai/webhook-helper-js/actions/workflows/test.yml/badge.svg)](https://github.com/kontent-ai/webhook-helper-js/actions/workflows/test.yml)

# Kontent.ai Webhook helper

This package aims to help you with Webhooks received from Kontent.ai projects. It provides:

* Runtime validation and parsing of webhook payloads with Zod
* Type-safe notification handling with TypeScript discriminated unions
* [Signature verification](https://kontent.ai/learn/docs/webhooks/webhooks/javascript#a-validate-received-notifications)

## Installation

Install package:

```bash
npm install @kontent-ai/webhook-helper

pnpm add @kontent-ai/webhook-helper
```


## Quick Start

Create a reusable function to parse and validate webhook requests:

```typescript
import { parseSignedWebhookResponse, SIGNATURE_HEADER, ParseResult, WebhookResponse } from '@kontent-ai/webhook-helper';

const parseWebhookRequest = async (
  request: Request,
  secret: string
): Promise<ParseResult<WebhookResponse>> => {
  const signature = request.headers.get(SIGNATURE_HEADER);
  const body = await request.text();

  return parseSignedWebhookResponse(body, secret, signature);
};

const handleWebhook = async (request: Request) => {
  const result = await parseWebhookRequest(request, 'your-webhook-secret');

  if (!result.success) {
    return new Response(result.error.message, { status: 401 });
  }

  result.data.notifications.forEach(notification => {
    if (notification.object_type === 'content_item') {
      console.log('Content item:', notification.data.system.name);
    }
  });

  return new Response('OK', { status: 200 });
};
```

## Parsing & Validating Webhooks

The library provides two main parsing functions:

### Parse with signature verification

```typescript
import { parseSignedWebhookResponse } from '@kontent-ai/webhook-helper';

const result = parseSignedWebhookResponse(body, secret, signature);

if (!result.success) {
  console.error('Validation failed:', result.error);
  return;
}

const webhookData = result.data;
```

### Parse without signature verification

```typescript
import { parseWebhookResponse } from '@kontent-ai/webhook-helper';

const result = parseWebhookResponse(body);

if (!result.success) {
  console.error('Parsing failed:', result.error);
  return;
}

const webhookData = result.data;
```

## Type-Safe Notification Handling

Each notification has an `object_type` discriminator that enables type narrowing:

```typescript
const result = parseWebhookResponse(body);

if (result.success) {
  result.data.notifications.forEach(notification => {
    switch (notification.object_type) {
      case 'content_item':
        console.log('Workflow step:', notification.data.system.workflow_step);
        console.log('Action:', notification.message.action);
        break;
      case 'asset':
        console.log('Asset ID:', notification.data.system.id);
        console.log('Action:', notification.message.action);
        break;
      case 'content_type':
        console.log('Type codename:', notification.data.system.codename);
        break;
      case 'language':
        console.log('Language codename:', notification.data.system.codename);
        break;
      case 'taxonomy':
        console.log('Taxonomy codename:', notification.data.system.codename);
        break;
      case 'unknown':
        console.warn('Unknown notification type:', notification.original_notification);
        break;
    }
  });
}
```

## Notification Structure & object_type

To enable the type-safe discrimination shown above, this library "uplifts" the `object_type` property to the top level of the notification object. This is a convenience helper that creates a discriminated union, allowing TypeScript to automatically narrow the types.

This means the parsed notification object is a slight superset of the original Kontent.ai webhook payload.

If you need to strictly match the original notification shape (without the top-level `object_type`), you can use the `Omit` utility type:

```typescript
import { AssetNotification } from '@kontent-ai/webhook-helper';

// Removes the helper 'object_type' property to match the raw payload structure
type RawAssetNotification = Omit<AssetNotification, "object_type">;
```

## Handling Unknown Webhooks

The library is forward-compatible with future webhook types. When a notification doesn't match any known schema, it's typed as `UnknownNotification`:

```typescript
type UnknownNotification = {
  object_type: "unknown";
  original_notification: Record<PropertyKey, unknown>;
};
```

This allows you to:
- Access raw webhook data via `original_notification`
- Handle future webhook types without breaking your application
- Use exhaustive type checking in switch statements

```typescript
result.data.notifications.forEach(notification => {
  if (notification.object_type === 'unknown') {
    console.log('Unrecognized webhook:', notification.original_notification);
  }
});
```

## Signature Verification

If you need to verify signatures separately from parsing, use `isSignatureValid()`:

```typescript
import { isSignatureValid, replaceLinebreaks, SIGNATURE_HEADER } from '@kontent-ai/webhook-helper';

const verifyWebhookSignature = async (request: Request, secret: string): Promise<boolean> => {
  const signature = request.headers.get(SIGNATURE_HEADER);
  const body = await request.text();

  return isSignatureValid(replaceLinebreaks(body), secret, signature);
}

if (!await verifyWebhookSignature(request, 'your-webhook-secret')) {
  throw new Error('Invalid signature');
}
```

The payload must be exactly the same (including whitespaces) as the original webhook body. If you've parsed the payload into an object, you can reconstruct it:

```typescript
const payload = JSON.stringify(jsonPayload, null, 2);
```

The `replaceLinebreaks()` function normalizes line endings to prevent signature mismatches caused by Windows line breaks:

```typescript
import { replaceLinebreaks } from '@kontent-ai/webhook-helper';

const normalizedPayload = replaceLinebreaks(payload);
```
