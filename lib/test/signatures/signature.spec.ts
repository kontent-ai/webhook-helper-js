import { IWebhookDeliveryResponse, WebhookResponse, signatureHelper } from "../..";
import { describe, expect, it } from "@jest/globals";

describe("# Signatures", () => {
  const secret = "BHPyfqwSy1iJjcscOB+GSkDf9THrBlfcKkwtADJdbP4=";
  const signature = "CF9/hYLw2CDcVp2wW39OFUglh++fGdHFeOhiWxM3jZg=";
  const payload = {
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
  } as const satisfies WebhookResponse;

  it("Generated hash should match signature", () => {
    const payloadString = JSON.stringify(payload, null, 2);
    const generatedHash = signatureHelper.getHashFromString(signatureHelper.replaceLinebreaks(payloadString), secret);

    expect(generatedHash).toEqual(signature);
  });

  it("Signature should be valid", () => {
    const payloadString = JSON.stringify(payload, null, 2);

    const isValid = signatureHelper.isValidSignatureFromString(
      signatureHelper.replaceLinebreaks(payloadString),
      secret,
      signature,
    );

    expect(isValid).toEqual(true);
  });

  it("Signature is invalid due to wrong body", () => {
    const wrongInput = {
      notifications: {
        ...payload.notifications[0],
        data: { system: { ...payload.notifications[0].data.system, name: "wrong_name" } },
      },
    };
    const payloadString = JSON.stringify(wrongInput, null, 2);

    const isValid = signatureHelper.isValidSignatureFromString(
      signatureHelper.replaceLinebreaks(payloadString),
      secret,
      signature,
    );

    expect(isValid).toEqual(false);
  });
});

describe("legacy webhooks", () => {
  const secret = "4INSnqn9ZA9pOWHpRySS+rsEqL6qHF3CIAftipJeuDc=";
  const signature = "5+vhM4vWobuiwGyLSGqOL7KwXnaQXISzuKUxhI4xL3o=";

  const legacyPayload: IWebhookDeliveryResponse = {
    data: {
      items: [
        {
          id: "f0e9e9fa-91e8-40d5-9527-b7e0ae51fc54",
          codename: "christian_bale",
          collection: "default",
          language: "en",
          type: "actor",
        },
      ],
      taxonomies: [],
    },
    message: {
      id: "790b5fea-febe-4421-b8e7-d333afc60136",
      project_id: "b259760f-81c5-013a-05e7-69efb4b954e5",
      type: "content_item_variant",
      operation: "publish",
      api_name: "delivery_production",
      created_timestamp: "2020-03-13T08:05:07.4044893Z",
      webhook_url: "https://enxkdw8lvglue.x.pipedream.net/",
    },
  };

  it("Generated hash should match signature", () => {
    const payloadString = JSON.stringify(legacyPayload, null, 2);
    const generatedHash = signatureHelper.getHashFromString(signatureHelper.replaceLinebreaks(payloadString), secret);

    expect(generatedHash).toEqual(signature);
  });

  it("Signature should be valid", () => {
    const payloadString = JSON.stringify(legacyPayload, null, 2);

    const isValid = signatureHelper.isValidSignatureFromString(
      signatureHelper.replaceLinebreaks(payloadString),
      secret,
      signature,
    );

    expect(isValid).toEqual(true);
  });
});
