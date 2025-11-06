import { describe, expect, it } from "vitest";

import {
  getHashFromString,
  isValidSignatureFromString,
  replaceLinebreaks,
  WebhookResponse,
} from "../..";

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
    const generatedHash = getHashFromString(replaceLinebreaks(payloadString), secret);

    expect(generatedHash).toEqual(signature);
  });

  it("Signature should be valid", () => {
    const payloadString = JSON.stringify(payload, null, 2);

    const isValid = isValidSignatureFromString(
      replaceLinebreaks(payloadString),
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

    const isValid = isValidSignatureFromString(
      replaceLinebreaks(payloadString),
      secret,
      signature,
    );

    expect(isValid).toEqual(false);
  });
});
