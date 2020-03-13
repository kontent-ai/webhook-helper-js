[![npm version](https://badge.fury.io/js/wip-webhook-helper.svg)](https://badge.fury.io/js/wip-webhook-helper.svg)

# Kontent Webhook helper


This package aims to help you with Webhooks received from Kentico Kontent projects. Currently, it contains methods for verifying webhook validity as per [signatures](https://docs.kontent.ai/reference/webhooks-reference#a-notification-signatures).

## Installation

Install package:

`npm i wip-webhook-helper`

### Verify signature

To verify whether a signature is valid use one of:

```typescript
import { signatureHelper } from 'wip-webhook-helper';

const isValid = signatureHelper.isValidSignatureFromString(
    payload, // payload converted to string 
    secret, // secret can be obtained from Webhook definition in Kentico Kontent project
    signature // can be obtained from 'x-kc-signature' header present in webhook request);
```

```typescript
import { signatureHelper } from 'wip-webhook-helper';

const isValid = signatureHelper.isValidSignatureFromBinary(
    payload, // payload in a binary format (e.g. 'req.body' in node.js HTTP POST request object)
    secret, // secret can be obtained from Webhook definition in Kentico Kontent project
    signature // can be obtained from 'x-kc-signature' header present in webhook request);
```

### Generate hash

```typescript
import { signatureHelper } from 'wip-webhook-helper';

const hash = signatureHelper.getHashFromString(payload, secret);
```

```typescript
import { signatureHelper } from 'wip-webhook-helper';

const hash = signatureHelper.getHashFromBinary(payload, secret);
```